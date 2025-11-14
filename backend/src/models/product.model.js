import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    price: { type: Number, required: true },

    mrp: { type: Number, default: 0 }, // Optional for discount display

    stock: { type: Number, default: 0 },

    weight: { type: String },

    flavor: { type: String },

    brand: { type: String, default: "Hunger Bites" },

    isFeatured: { type: Boolean, default: false },

    isBestSeller: { type: Boolean, default: false }, // ✨ added

    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    ratings: { type: Number, default: 0 },

    numOfReviews: { type: Number, default: 0 },

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        rating: Number,
        comment: String,
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
