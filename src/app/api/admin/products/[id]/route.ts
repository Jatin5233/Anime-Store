import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Product } from "@/models/Product";
import { requireAuth } from "@/lib/requireAuth";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  await connectDB();
  const product = await Product.findById(params.id);

  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ product });
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  try {
    const updates = await req.json();

    await connectDB();
    const product = await Product.findByIdAndUpdate(
      params.id,
      updates,
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product updated",
      product,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}

