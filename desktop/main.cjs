const { app, BrowserWindow, dialog, shell } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
// Keep native modules out of top-level initialization so load failures are recorded.
let logFile;
function log(stage, detail) {
  const line = `${new Date().toISOString()} ${stage}${detail ? `: ${detail}` : ""}\n`;
  try {
    if (!logFile) {
      const dir = path.join(app.getPath("userData"), "logs");
      fs.mkdirSync(dir, { recursive: true });
      logFile = path.join(dir, "startup.log");
    }
    fs.appendFileSync(logFile, line);
  } catch (error) {
    console.error("Could not write startup log", error);
  }
}
function describe(error) {
  return String(error?.stack || error?.message || error).replace(/(Bearer\s+)[^\s]+/gi, "$1[redacted]");
}
let startupFailed = false;
function failStartup(error) {
  if (startupFailed || app.isQuitting) return;
  startupFailed = true;
  log("STARTUP_FAILED", describe(error));
  const message = `O ESTIBORDO não conseguiu iniciar.\n\n${String(error?.message || error)}\n\nRegistro do erro: ${logFile || "indisponível"}`;
  try { dialog.showErrorBox("Falha ao iniciar o ESTIBORDO", message); }
  catch (dialogError) { log("ERROR_DIALOG_FAILED", describe(dialogError)); }
  app.quit();
}
process.on("uncaughtException", failStartup);
process.on("unhandledRejection", failStartup);
log("START", `version=${app.getVersion()} packaged=${app.isPackaged}`);

const HOST = "127.0.0.1";
function remoteApiOrigin(raw) {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("A API remota do ESTIBORDO precisa ser uma origem HTTPS sem credenciais.");
  }
  return url.origin;
}
let REMOTE_API;
let serverProcess = null;
let mainWindow = null;
let localOrigin = null;
let localDb = null;
let syncEngine = null;
let localBridge = null;

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, HOST, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close(() => port ? resolve(port) : reject(new Error("Porta local indisponível.")));
    });
  });
}

function requestOk(url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 1500 }, (res) => {
      res.resume();
      resolve(Boolean(res.statusCode && res.statusCode < 500));
    });
    req.on("timeout", () => { req.destroy(); resolve(false); });
    req.on("error", () => resolve(false));
  });
}

async function waitForServer(origin, timeoutMs = 45000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await requestOk(`${origin}/api/health?shallow=1`)) return;
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  throw new Error("O servidor local do ESTIBORDO não iniciou no prazo esperado.");
}

function runtimeRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "runtime")
    : path.join(__dirname, "runtime");
}

function localAuthSecret(db) {
  const row=db.prepare("SELECT value_json FROM local_settings WHERE key='local_auth_secret'").get();
  if(row){try{return JSON.parse(row.value_json)}catch{}}
  const value=crypto.randomBytes(48).toString("base64url");
  db.prepare("INSERT OR REPLACE INTO local_settings(key,value_json,updated_at) VALUES(?,?,?)").run("local_auth_secret",JSON.stringify(value),new Date().toISOString());
  return value;
}

function startLocalServer(port, bridge, authSecret) {
  const root = runtimeRoot();
  const serverEntry = path.join(root, "server.js");
  const env = {
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP,
    HOSTNAME: HOST,
    PORT: String(port),
    ESTIBORDO_DESKTOP: "1",
    ESTIBORDO_LOCAL_DB_PATH: path.join(app.getPath("userData"), "estibordo.sqlite3"),
    ESTIBORDO_LOCAL_BRIDGE_URL: `http://${HOST}:${bridge.port}`,
    ESTIBORDO_LOCAL_BRIDGE_TOKEN: bridge.token,
    ESTIBORDO_REMOTE_API_ORIGIN: REMOTE_API,
    NEXT_PUBLIC_APP_URL: `http://${HOST}:${port}`,
    AUTH_SECRET: authSecret,
  };

  serverProcess = spawn(process.execPath, [serverEntry], {
    cwd: root,
    env: { ...env, ELECTRON_RUN_AS_NODE: "1" },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  serverProcess.once("error", (error) => failStartup(error));
  serverProcess.stdout?.on("data", (chunk) => log("NEXT_STDOUT", String(chunk).trim()));
  serverProcess.stderr?.on("data", (chunk) => log("NEXT_STDERR", String(chunk).trim()));
  serverProcess.once("exit", (code, signal) => {
    log("NEXT_EXIT", `code=${code} signal=${signal}`);
    if (!app.isQuitting && !startupFailed) failStartup(new Error(`Servidor local encerrado (código ${code}, sinal ${signal}).`));
  });
}

function stopLocalServer() {
  if (!serverProcess || serverProcess.killed) return;
  serverProcess.kill();
  serverProcess = null;
}

function isAllowedNavigation(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return Boolean(localOrigin && url.origin === localOrigin);
  } catch {
    return false;
  }
}

async function createWindow() {
  log("ELECTRON_READY");
  REMOTE_API = remoteApiOrigin(process.env.ESTIBORDO_API_BASE_URL || "https://simulado-pscpp.vercel.app");
  const { openLocalDatabase, getSyncStatus } = require("./local-db.cjs");
  const { loadSession, saveSession, clearSession } = require("./secure-store.cjs");
  const { createSyncEngine } = require("./sync-engine.cjs");
  const { startLocalBridge } = require("./local-bridge.cjs");
  log("MODULES_LOADED");
  const port = await getFreePort();
  localOrigin = `http://${HOST}:${port}`;
  fs.mkdirSync(app.getPath("userData"), { recursive: true });
  localDb = openLocalDatabase(app.getPath("userData"));
  log("SQLITE_READY");
  syncEngine = createSyncEngine({
    db: localDb,
    getSession: loadSession,
    saveSession,
    onRenew: (fresh) => {
      const t=new Date().toISOString();
      const entitlement=fresh.entitlement?.active?"active":fresh.entitlement?.trial?"trial":String(fresh.entitlement?.status||"inactive");
      localDb.prepare("UPDATE local_profile SET entitlement_status=?,entitlement_checked_at=?,entitlement_expires_at=?,entitlement_lifetime=?,last_online_auth_at=?,updated_at=? WHERE user_id=?")
        .run(entitlement,t,fresh.entitlement?.expires_at||null,fresh.entitlement?.lifetime?1:0,t,t,String(fresh.user.id));
    },
    onAuthRejected: async (userId) => {
      await clearSession();
      const t=new Date().toISOString();
      localDb.prepare("UPDATE local_profile SET entitlement_status='reauth_required',updated_at=? WHERE user_id=?").run(t,String(userId));
    },
    apiBaseUrl: REMOTE_API,
    onStatus: (status) => log("SYNC", JSON.stringify(status)),
  });
  syncEngine.start();
  const authSecret=localAuthSecret(localDb);
  localBridge = await startLocalBridge({ db: localDb, syncEngine, secureStore: { loadSession, saveSession, clearSession }, apiBaseUrl: REMOTE_API, host: HOST });
  log("BRIDGE_READY");
  startLocalServer(port, localBridge, authSecret);
  await waitForServer(localOrigin);
  if (startupFailed) return;
  log("NEXT_READY", JSON.stringify(getSyncStatus(localDb)));

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#07111d",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedNavigation(url)) return { action: "allow" };
    if (/^https:\/\//i.test(url)) void shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!isAllowedNavigation(url)) {
      event.preventDefault();
      if (/^https:\/\//i.test(url)) void shell.openExternal(url);
    }
  });

  mainWindow.webContents.on("did-fail-load", (_event, code, description, url, isMainFrame) => {
    log("PAGE_LOAD_FAILED", `code=${code} description=${description} main=${isMainFrame} url=${url}`);
    if (isMainFrame) failStartup(new Error(`A interface local não carregou: ${description} (${code}).`));
  });
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    log("RENDER_GONE", `reason=${details.reason} exitCode=${details.exitCode}`);
    failStartup(new Error(`A interface encerrou: ${details.reason} (${details.exitCode}).`));
  });
  mainWindow.once("ready-to-show", () => { if (!mainWindow?.isDestroyed()) mainWindow.show(); });
  await mainWindow.loadURL(localOrigin);
  if (startupFailed) return;
  if (!mainWindow.isVisible()) mainWindow.show();
  log("WINDOW_VISIBLE");
}

app.on("before-quit", () => {
  app.isQuitting = true;
  log("QUIT");
  syncEngine?.stop();
  localBridge?.server?.close();
  localBridge = null;
  localDb?.close();
  localDb = null;
  stopLocalServer();
});

app.on("window-all-closed", () => app.quit());

app.whenReady().then(createWindow).catch(failStartup);
