const { app, BrowserWindow, shell, dialog } = require("electron");
const { spawn } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const http = require("http");

let serverProcess;
const PORT = 32145;
const HOST = "127.0.0.1";

function persistentSecret(userData) {
  const file = path.join(userData, "auth-secret.txt");
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8").trim();
  const value = crypto.randomBytes(48).toString("base64url");
  fs.mkdirSync(userData, { recursive: true });
  fs.writeFileSync(file, value, { encoding: "utf8", mode: 0o600 });
  return value;
}

function waitForServer(timeoutMs = 60000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const probe = () => {
      const req = http.get({ host: HOST, port: PORT, path: "/api/desktop/health", timeout: 1500 }, res => {
        res.resume();
        if (res.statusCode === 200) return resolve();
        retry();
      });
      req.on("error", retry);
      req.on("timeout", () => { req.destroy(); retry(); });
    };
    const retry = () => {
      if (Date.now() - started > timeoutMs) return reject(new Error("Servidor local não iniciou no prazo."));
      setTimeout(probe, 400);
    };
    probe();
  });
}

async function startServer() {
  const userData = app.getPath("userData");
  const serverDir = app.isPackaged ? path.join(process.resourcesPath, "server") : process.cwd();
  const serverFile = app.isPackaged ? path.join(serverDir, "server.js") : require.resolve("next/dist/bin/next");
  const args = app.isPackaged ? [serverFile] : [serverFile, "dev", "-p", String(PORT), "-H", HOST];
  const migrationsDir = app.isPackaged ? path.join(process.resourcesPath, "db", "migrations") : path.join(process.cwd(), "db", "migrations");
  const env = {
    ...process.env,
    ELECTRON_RUN_AS_NODE: "1",
    NODE_ENV: app.isPackaged ? "production" : "development",
    PORT: String(PORT),
    HOSTNAME: HOST,
    PSCPP_DESKTOP: "1",
    PSCPP_DATA_DIR: path.join(userData, "database"),
    PSCPP_MIGRATIONS_DIR: migrationsDir,
    AUTH_SECRET: persistentSecret(userData),
    AUTH_SESSION_DAYS: "90",
    NEXT_PUBLIC_APP_URL: `http://${HOST}:${PORT}`
  };
  serverProcess = spawn(process.execPath, args, { cwd: serverDir, env, windowsHide: true, stdio: ["ignore","pipe","pipe"] });
  serverProcess.stdout.on("data", d => console.log("[PSCPP]", String(d).trim()));
  serverProcess.stderr.on("data", d => console.error("[PSCPP]", String(d).trim()));
  serverProcess.on("exit", code => { if (!app.isQuitting && code) console.error("Servidor local encerrou:", code); });
  await waitForServer();
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 1100, minHeight: 720,
    show: false, autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  await win.loadURL(`http://${HOST}:${PORT}/api/desktop/bootstrap`);
  win.once("ready-to-show", () => win.show());
}

app.whenReady().then(async () => {
  try { await startServer(); await createWindow(); }
  catch (error) { dialog.showErrorBox("ESTIBORDO PSCPP", "Não foi possível iniciar o aplicativo local.\n\n" + error.message); app.quit(); }
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => { app.isQuitting = true; if (serverProcess && !serverProcess.killed) serverProcess.kill(); });
