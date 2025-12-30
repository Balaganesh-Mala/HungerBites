import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    public_id: String,
    url: String,
  },
  { _id: false }
);

const heroSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    buttonText: { type: String, required: true, trim: true },

    image: heroImageSchema,

    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// 🔥 Performance index (homepage loads)
heroSchema.index({ isActive: 1, order: 1 });

const HeroSlide = mongoose.model("HeroSlide", heroSchema);
export default HeroSlide;
