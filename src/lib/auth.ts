import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export type AuthUser = {
  userId: string;
  role: "user" | "admin";
};

export function verifyAccessToken(token: string): AuthUser {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as AuthUser;
    return decoded;
  } catch {
    throw new Error("Invalid or expired token");
  }
}
