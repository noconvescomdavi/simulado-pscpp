import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "pscpp_session";
const SESSION_DAYS = 365;
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET);

export async function createSession(user) {
  const token = await new SignJWT({ email:user.email, role:user.role || "student" })
    .setProtectedHeader({alg:"HS256"})
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"lax",
    path:"/",
    maxAge:60*60*24*SESSION_DAYS
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", {httpOnly:true,path:"/",maxAge:0});
}

export async function getSession() {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const {payload} = await jwtVerify(token, secret());
    return {id:payload.sub,email:payload.email,role:payload.role};
  } catch {
    return null;
  }
}