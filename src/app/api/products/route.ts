import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Product } from "@/models/Product";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? 100000);
  const inStock = searchParams.get("inStock") === "true";
  const isLimitedEdition = searchParams.get("isLimitedEdition") === "true";
  const isPreOrder = searchParams.get("isPreOrder") === "true";

  const query: any = {
    $and: [
      { $or: [{ isActive: true }, { isActive: { $exists: false } }] }
    ]
  };

  const anime = searchParams.get("anime");
  if (anime) {
    const list = anime.split(",").filter(Boolean);
    if (list.length) query.anime = { $in: list };
  }

  const tags = searchParams.get("tags");
  if (tags) {
    const list = tags.split(",").filter(Boolean);
    if (list.length) query.tags = { $in: list };
  }

  if (inStock) query.stock = { $gt: 0 };
  if (isLimitedEdition) query.isLimitedEdition = true;
  if (isPreOrder) query.isPreOrder = true;

  query.$and.push({
    $or: [
      { price: { $gte: minPrice, $lte: maxPrice } },
      { discountPrice: { $gte: minPrice, $lte: maxPrice } },
    ],
  });

  const products = await Product.find(query).sort({ createdAt: -1 });

  return NextResponse.json({
    products,
    filterOptions: {
      anime: await Product.distinct("anime"),
      tags: await Product.distinct("tags"),
      maxPrice: await Product.findOne()
        .sort({ price: -1 })
        .then(p => p?.price ?? 1000),
    },
  });
}
