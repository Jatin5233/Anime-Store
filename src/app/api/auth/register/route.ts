import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { User } from "@/models/User";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ?.split(",")
  .map((e) => e.trim().toLowerCase());

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 🔐 Assign role securely
    const role =
      ADMIN_EMAILS?.includes(email.toLowerCase()) ? "admin" : "user";

    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
