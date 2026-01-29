import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

// GET order overview stats (admin only)
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

    // Get all orders
    const orders = await Order.find();

    // Calculate stats
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      paidOrders: orders.filter(order => order.paymentStatus === 'paid').length,
      pendingOrders: orders.filter(order => order.paymentStatus === 'pending').length,
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
      processingOrders: orders.filter(order => order.orderStatus === 'processing').length,
      shippedOrders: orders.filter(order => order.orderStatus === 'shipped').length,
      deliveredOrders: orders.filter(order => order.orderStatus === 'delivered').length,
      cancelledOrders: orders.filter(order => order.orderStatus === 'cancelled').length,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Fetch order stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
