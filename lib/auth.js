import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { query } from "./db";
import {desktopLocal,isDesktopRuntime} from "./desktop-local";

const COOKIE = "pscpp_session";
const DEFAULT_SESSION_DAYS = 30;
const MAX_SESSION_DAYS = 90;

function sessionDays() {
  const configured = Number.parseInt(process.env.AUTH_SESSION_DAYS || "", 10);
  if (!Number.isInteger(configured) || configured < 1) return DEFAULT_SESSION_DAYS;
  return Math.min(configured, MAX_SESSION_DAYS);
}

function secret() {
  const value = String(process.env.AUTH_SECRET || "");
  if (value.length < 32) throw new Error("AUTH_SECRET deve ter pelo menos 32 caracteres.");
  return new TextEncoder().encode(value);
}

export async function createSession(user,{adminMfaVerified=false}={}) {
  const days = sessionDays();
  const version = Number(user.session_version || 1);
  const token = await new SignJWT({
    email: user.email,
    role: user.role || "student",
    sv: version,
    amfa: user.role==="admin" ? Boolean(adminMfaVerified) : undefined
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${days}d`)
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !isDesktopRuntime(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * days,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !isDesktopRuntime(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession() {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;

    if (isDesktopRuntime()) {
      const local = await desktopLocal("/v1/profile");
      const profile = local.profile;
      if (!profile || String(profile.user_id) !== String(payload.sub)) return null;
      if (profile.entitlement_status === "reauth_required") return null;
      const checked=Date.parse(profile.last_online_auth_at||"");
      if(!Number.isFinite(checked)||checked>Date.now()+300000||Date.now()-checked>30*86400000)return null;
      if(profile.role==="admin")return null;
      return { id:String(profile.user_id), email:profile.email || payload.email, role:profile.role || payload.role || "student",
        adminMfaEnabled:false, adminMfaVerified:false, offline:true };
    }
    const result = await query("select id,email,role,status,session_version,admin_mfa_enabled from users where id=$1 limit 1",[payload.sub]);
    const user = result.rows[0];
    if (!user || user.status !== "active") return null;
    if (Number(payload.sv || 1) !== Number(user.session_version || 1)) return null;
    return { id:String(user.id),email:user.email,role:user.role,adminMfaEnabled:Boolean(user.admin_mfa_enabled),adminMfaVerified:Boolean(payload.amfa) };
  } catch {
    return null;
  }
}
