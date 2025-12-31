export const buildShiprocketOrderPayload = (order) => ({
  is_manual_order: 1,
  inventory_sync: false,

  order_id: order._id.toString(),
  order_date: new Date().toISOString().split("T")[0],

  pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,

  billing_customer_name: order.shippingAddress.name,
  billing_last_name: "",
  billing_address: order.shippingAddress.street,
  billing_city: order.shippingAddress.city,
  billing_state: order.shippingAddress.state,
  billing_pincode: order.shippingAddress.pincode,
  billing_country: "India",
  billing_email: order.user?.email || "support@hungerbites.store",
  billing_phone: order.shippingAddress.phone,

  shipping_is_billing: true,
  shipping_customer_name: order.shippingAddress.name,
  shipping_phone: order.shippingAddress.phone,

  order_items: order.orderItems.map((item, i) => ({
    name: item.name,
    sku: `${item.productId}-${i}`, // MUST be unique string
    units: item.quantity,
    selling_price: item.price,
  })),

  payment_method: "COD",
  sub_total: order.itemsPrice,
  discount: order.discount || 0,

  length: 10,
  breadth: 10,
  height: 5,
  weight: 0.5,
});
