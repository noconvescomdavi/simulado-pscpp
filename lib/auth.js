import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { query } from "./db";

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

export async function createSession(user) {
  const days = sessionDays();
  const token = await new SignJWT({ email: user.email, role: user.role || "student" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${days}d`)
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * days,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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

    const result = await query(
      "select id,email,role,status from users where id=$1 limit 1",
      [payload.sub]
    );
    const user = result.rows[0];
    if (!user || user.status !== "active") return null;

    return { id: String(user.id), email: user.email, role: user.role };
  } catch {
    return null;
  }
}
