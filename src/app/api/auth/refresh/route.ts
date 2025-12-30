import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/MongoDB";
import { User } from "@/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST() {
  try {
    await connectDB();
const cookieStore = await cookies();
    // ✅ READ FROM COOKIE (NOT BODY)
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token missing" },
        { status: 401 }
      );
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken,
    }).select("+refreshToken +refreshTokenExpiresAt");

    if (!user) {
      return NextResponse.json(
        { message: "Refresh token reused or invalidated" },
        { status: 401 }
      );
    }

    // Expiry check
    if (
      !user.refreshTokenExpiresAt ||
      user.refreshTokenExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: "Refresh token expired" },
        { status: 401 }
      );
    }

    // 🔁 ROTATE TOKENS
    const newAccessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const newRefreshToken = signRefreshToken({
      userId: user._id.toString(),
    });

    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await user.save();

    // ✅ SET NEW REFRESH TOKEN COOKIE
    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
