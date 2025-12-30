import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Product } from "@/models/Product";
import { requireAuth } from "@/lib/requireAuth";
import { requireAdmin } from "@/lib/requireAdmin";
import {Order} from "@/models/Order";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;
  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  await connectDB();

  const orders = await Order.find({ status: "paid" });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  return NextResponse.json({
    totalOrders,
    totalRevenue,
  });
}
