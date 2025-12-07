import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // allows null values without conflict
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      minlength: 6,
      select: false, // never returned unless manually selected
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // allows phone to be optional
      trim: true,
    },

    authProvider: {
      type: String,
      enum: ["email", "phone"],
      default: "email",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      public_id: String,
      url: String,
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    addresses: [
      {
        street: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
      },
    ],
  },
  { timestamps: true }
);

//
// 🔐 Ensure either email OR phone exists
//
userSchema.pre("save", function (next) {
  if (!this.email && !this.phone) {
    return next(new Error("Either email or phone must be provided"));
  }
  next();
});

//
// 🔑 Hash password before saving / resetting
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//
// 🔍 Compare entered password with stored hashed password
//
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//
// 🔐 Generate JWT auth token
//
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
