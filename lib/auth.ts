import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "./auth-types";
import { SESSION_COOKIE } from "./auth-types";

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET が設定されていません");
  }
  return new TextEncoder().encode(secret);
}

export function getCredentials(): {
  owner: { email: string; password: string; name: string };
  lancers: { email: string; password: string; name: string };
} {
  return {
    owner: {
      email: process.env.OWNER_EMAIL ?? "keikamotushige@gmail.com",
      password: process.env.OWNER_PASSWORD ?? "owner2026!",
      name: "オーナー",
    },
    lancers: {
      email: process.env.LANCERS_TEST_EMAIL ?? "lancers@test.com",
      password: process.env.LANCERS_TEST_PASSWORD ?? "lancers2026!",
      name: "ランサーズテスト",
    },
  };
}

export function authenticateUser(
  email: string,
  password: string
): SessionUser | null {
  const creds = getCredentials();
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail === creds.owner.email.toLowerCase() &&
    password === creds.owner.password
  ) {
    return {
      email: creds.owner.email,
      name: creds.owner.name,
      role: "owner",
    };
  }

  if (
    normalizedEmail === creds.lancers.email.toLowerCase() &&
    password === creds.lancers.password
  ) {
    return {
      email: creds.lancers.email,
      name: creds.lancers.name,
      role: "lancers",
    };
  }

  return null;
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.email || !payload.name || !payload.role) return null;
    return {
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function isOwner(user: SessionUser | null): boolean {
  return user?.role === "owner";
}
