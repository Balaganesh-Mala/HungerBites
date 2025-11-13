import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Hunger Bites" },
    logo: { type: String, default: "" },
    supportEmail: { type: String, default: "" },
    supportPhone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
