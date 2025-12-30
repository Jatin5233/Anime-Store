import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Product } from "@/models/Product";
import { requireAuth } from "@/lib/requireAuth";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  try {
    await connectDB();
    const data = await req.json();

    const product = await Product.create(data);

    return NextResponse.json(
      { message: "Product created", product },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });

  return NextResponse.json({ products });
}

