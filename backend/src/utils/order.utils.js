import Product from "../models/product.model.js";

/**
 * Build validated order items
 * - ensures product exists
 * - ensures stock is enough
 * - calculates itemsPrice
 */
export const buildFinalOrderItems = async (orderItems) => {
  const productIds = orderItems.map((it) => it.productId);

  const products = await Product.find({
    _id: { $in: productIds },
  }).lean();

  const productMap = new Map();
  for (const p of products) {
    productMap.set(String(p._id), p);
  }

  const finalOrderItems = [];
  let itemsPrice = 0;

  for (const item of orderItems) {
    const product = productMap.get(String(item.productId));

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    const price = Number(product.price);

    finalOrderItems.push({
      productId: product._id,
      name: product.name,
      quantity: item.quantity,
      price,
    });

    itemsPrice += price * item.quantity;
  }

  return { finalOrderItems, itemsPrice };
};
