const { app, BrowserWindow, shell } = require("electron");
const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");
const http = require("node:http");
const { openLocalDatabase, getSyncStatus } = require("./local-db.cjs");
const { loadSession } = require("./secure-store.cjs");
const { createSyncEngine } = require("./sync-engine.cjs");
const { startLocalBridge } = require("./local-bridge.cjs");

const HOST = "127.0.0.1";
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

function startLocalServer(port, bridge) {
  const root = runtimeRoot();
  const serverEntry = path.join(root, "server.js");
  const env = {
    ...process.env,
    HOSTNAME: HOST,
    PORT: String(port),
    ESTIBORDO_DESKTOP: "1",
    ESTIBORDO_LOCAL_DB_PATH: path.join(app.getPath("userData"), "estibordo.sqlite3"),
    ESTIBORDO_LOCAL_BRIDGE_URL: `http://${HOST}:${bridge.port}`,
    ESTIBORDO_LOCAL_BRIDGE_TOKEN: bridge.token,
    NEXT_PUBLIC_APP_URL: `http://${HOST}:${port}`,
  };

  serverProcess = spawn(process.execPath, [serverEntry], {
    cwd: root,
    env: { ...env, ELECTRON_RUN_AS_NODE: "1" },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  serverProcess.stdout?.on("data", (chunk) => console.log("[next]", String(chunk).trim()));
  serverProcess.stderr?.on("data", (chunk) => console.error("[next]", String(chunk).trim()));
  serverProcess.once("exit", (code, signal) => {
    if (!app.isQuitting && mainWindow && !mainWindow.isDestroyed()) {
      console.error("Servidor local encerrado inesperadamente.", { code, signal });
    }
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
  const port = await getFreePort();
  localOrigin = `http://${HOST}:${port}`;
  localDb = openLocalDatabase(app.getPath("userData"));
  syncEngine = createSyncEngine({
    db: localDb,
    getSession: loadSession,
    apiBaseUrl: process.env.ESTIBORDO_API_BASE_URL || "",
    onStatus: (status) => console.log("[sync]", status),
  });
  syncEngine.start();
  localBridge = await startLocalBridge({ db: localDb, syncEngine, host: HOST });
  startLocalServer(port, localBridge);
  await waitForServer(localOrigin);
  console.log("[local-first]", getSyncStatus(localDb));

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

  mainWindow.once("ready-to-show", () => mainWindow?.show());
  await mainWindow.loadURL(localOrigin);
}

app.on("before-quit", () => {
  app.isQuitting = true;
  syncEngine?.stop();
  localBridge?.server?.close();
  localBridge = null;
  localDb?.close();
  localDb = null;
  stopLocalServer();
});

app.on("window-all-closed", () => app.quit());

app.whenReady().then(createWindow).catch((error) => {
  console.error(error);
  stopLocalServer();
  app.quit();
});
