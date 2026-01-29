import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

// GET all orders (admin only)
export async function GET(req: Request) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    // Verify user is admin
    const user = await User.findById(userId).select("role");
    if (user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const orders = await Order.find()
      .populate("user", "email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch all orders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
