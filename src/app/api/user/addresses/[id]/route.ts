import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { User } from "@/models/User";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

// DELETE address by ID
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const addressId = resolvedParams.id;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.addresses || user.addresses.length === 0) {
      return NextResponse.json(
        { success: false, message: "No addresses found" },
        { status: 404 }
      );
    }

    // Find address index
    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id?.toString() === addressId
    );

    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // Check if deleting default address
    const isDefault = user.addresses[addressIndex].isDefault;

    // Remove address
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default and there are other addresses, set first as default
    if (isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("DELETE address error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update address by ID
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const addressId = resolvedParams.id;
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

    if (!user.addresses || user.addresses.length === 0) {
      return NextResponse.json(
        { success: false, message: "No addresses found" },
        { status: 404 }
      );
    }

    // Find address
    const address = user.addresses.find(
      (addr: any) => addr._id?.toString() === addressId
    );

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // If setting as default, reset others
    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    // Update address
    address.fullName = fullName;
    address.phone = phone;
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2;
    address.city = city;
    address.state = state;
    address.postalCode = postalCode;
    address.country = country || "India";
    address.isDefault = isDefault || address.isDefault;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("PUT address error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
