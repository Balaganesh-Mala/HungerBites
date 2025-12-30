export const buildShiprocketOrderPayload = (order) => {
  return {
    order_id: order._id.toString(),
    order_date: new Date(order.createdAt).toISOString().split("T")[0],

    pickup_location: "Primary", // Must match Shiprocket dashboard pickup name

    billing_customer_name: order.shippingAddress.name,
    billing_last_name: "",
    billing_address: order.shippingAddress.street,
    billing_city: order.shippingAddress.city,
    billing_state: order.shippingAddress.state,
    billing_pincode: order.shippingAddress.pincode,
    billing_country: "India",
    billing_email: "customer@email.com", // optional
    billing_phone: order.shippingAddress.phone,

    shipping_is_billing: true,

    order_items: order.orderItems.map((item) => ({
      name: item.name,
      sku: item.productId.toString(),
      units: item.quantity,
      selling_price: item.price,
    })),

    payment_method:
      order.paymentMethod === "COD" ? "COD" : "Prepaid",

    sub_total: order.itemsPrice,
    discount: order.discount || 0,

    length: 10,
    breadth: 10,
    height: 5,
    weight: 0.5, // You can later calculate from product weight
  };
};
