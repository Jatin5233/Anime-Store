import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Product } from "@/models/Product";
import { requireAuth } from "@/lib/requireAuth";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req: Request, { params }: any) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  // defensive id extraction: prefer `params.id`, fall back to parsing the URL
  const id = params?.id ?? new URL(req.url).pathname.split('/').filter(Boolean).pop();

  await connectDB();
  const product = await Product.findById(id);

  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ product });
}
export async function PUT(req: Request, { params }: any) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  try {
    const updates = await req.json();

    // defensive id extraction
    const id = params?.id ?? new URL(req.url).pathname.split('/').filter(Boolean).pop();

    await connectDB();
    const product = await Product.findByIdAndUpdate(
      id,
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
export async function DELETE(req: Request, { params }: any) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  try {
    // defensive id extraction
    const id = params?.id ?? new URL(req.url).pathname.split('/').filter(Boolean).pop();

    await connectDB();
    const product = await Product.findByIdAndDelete(id);

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

