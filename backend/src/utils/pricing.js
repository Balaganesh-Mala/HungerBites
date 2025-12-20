export const calculateProgressivePrice = (product, quantity) => {
  const basePrice = product.price;
  const slabs = product.pricingSlabs || [];

  if (slabs.length === 0) {
    return basePrice * quantity;
  }

  const sortedSlabs = [...slabs].sort(
    (a, b) => b.minQty - a.minQty
  );

  let remainingQty = quantity;
  let total = 0;

  for (const slab of sortedSlabs) {
    if (remainingQty >= slab.minQty) {
      const slabCount = Math.floor(
        remainingQty / slab.minQty
      );
      total += slabCount * slab.totalPrice;
      remainingQty -= slabCount * slab.minQty;
    }
  }

  total += remainingQty * basePrice;
  return total;
};
