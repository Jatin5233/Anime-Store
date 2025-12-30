import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { User } from "@/models/User";
import { verifyAccessToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // 1️⃣ Read Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = verifyAccessToken(token);

    // 3️⃣ Fetch user from DB
    await connectDB();
    const user = await User.findById(decoded.userId).select(
      "name email role"
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Return safe user data
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
