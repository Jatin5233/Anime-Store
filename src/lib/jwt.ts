import jwt, { SignOptions } from "jsonwebtoken";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
const REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");

/* ================= TOKEN HELPERS ================= */
export function signAccessToken(
  payload: object,
  options: SignOptions = {}
): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m",
    ...options,
  });
}

export function signRefreshToken(
  payload: object,
  options: SignOptions = {}
): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
    ...options,
  });
}
