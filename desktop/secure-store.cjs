const keytar = require("keytar");

const SERVICE = "ESTIBORDO";
const ACCOUNT = "desktop-session";

async function saveSession(value) {
  await keytar.setPassword(SERVICE, ACCOUNT, JSON.stringify(value));
}
async function loadSession() {
  const raw = await keytar.getPassword(SERVICE, ACCOUNT);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function clearSession() {
  await keytar.deletePassword(SERVICE, ACCOUNT);
}
module.exports = { saveSession, loadSession, clearSession };
