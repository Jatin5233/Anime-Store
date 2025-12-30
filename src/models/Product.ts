import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    anime: {
      type: String,
      required: true, // Naruto, One Piece, etc.
      index: true,
    },

    character: {
      type: String,
      index: true,
    },

    description: {
      type: String,
    },

    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    stock: {
      type: Number,
      default: 0,
    },

    isLimitedEdition: {
      type: Boolean,
      default: false,
    },

    isPreOrder: {
      type: Boolean,
      default: false,
    },

    releaseDate: {
      type: Date, // For pre-orders
    },

    tags: [
      {
        type: String, // Exclusive, Rare, New
      },
    ],

    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug
ProductSchema.pre("save", async function () {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/ /g, "-");
  }
});

export const Product =
  models.Product || mongoose.model("Product", ProductSchema);
