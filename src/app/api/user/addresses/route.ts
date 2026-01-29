import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { User } from "@/models/User";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

// GET user addresses
export async function GET(req: Request) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    const user = await User.findById(userId).select("addresses");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error("GET addresses error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST add new address
export async function POST(req: Request) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = await req.json();

    // Validation
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // If this is the first address or marked as default, set it as default
    if (!user.addresses || user.addresses.length === 0 || isDefault) {
      // Reset all other addresses to non-default
      if (user.addresses) {
        user.addresses.forEach((addr: any) => {
          addr.isDefault = false;
        });
      }
    }

    const newAddress = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || "India",
      isDefault: !user.addresses || user.addresses.length === 0 || isDefault,
    };

    user.addresses = user.addresses || [];
    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        address: user.addresses[user.addresses.length - 1],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST address error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
