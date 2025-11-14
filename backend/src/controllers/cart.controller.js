import asyncHandler from "express-async-handler";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

//
// ⭐ SUPER FAST subtotal using stored price
//
const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => {
    if (!item || !item.price || !item.quantity) return sum;
    return sum + item.price * item.quantity;
  }, 0);
};

//
// 🛒 Add item to cart
//
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    res.status(400);
    throw new Error("Valid product ID and quantity are required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error("Not enough stock available");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  // If no cart exists → create one
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Check if already in cart
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price, // Store price permanently
    });
  }

  cart.subtotal = calculateSubtotal(cart.items);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    cart,
  });
});

//
// 📋 Get user cart (AUTO CLEANING)
//
export const getUserCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price images stock"
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], subtotal: 0 },
    });
  }

  // 🧹 Remove items whose product has been deleted
  const validItems = cart.items.filter((item) => item.product !== null);

  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    cart.subtotal = calculateSubtotal(validItems);
    await cart.save();
  }

  res.status(200).json({ success: true, cart });
});

//
// ✏️ Update cart item quantity
//
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  cart.subtotal = calculateSubtotal(cart.items);
  await cart.save();

  res.status(200).json({ success: true, message: "Cart updated", cart });
});

//
// ❌ Remove item
//
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.subtotal = calculateSubtotal(cart.items);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cart,
  });
});

//
// 🧹 Clear entire cart
//
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = [];
  cart.subtotal = 0;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    cart,
  });
});
