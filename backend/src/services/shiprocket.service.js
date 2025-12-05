import axios from "axios";

const SR_LOGIN = "https://apiv2.shiprocket.in/v1/external/auth/login";
const SR_ORDER = "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc";
const SR_TRACK = "https://apiv2.shiprocket.in/v1/external/courier/track/awb/";

export const shiprocketLogin = async () => {
  try {
    const res = await axios.post(SR_LOGIN, {
      email: process.env.SR_EMAIL,
      password: process.env.SR_PASSWORD,
    });

    return res.data.token;
  } catch (error) {
    console.log("Shiprocket login error:", error.response.data);
    throw new Error("Shiprocket login failed: " + error.response.data.message);
  }
};

export const createShipment = async (order, token) => {
  const payload = {
    order_id: order._id.toString(),
    order_date: new Date().toISOString(),

    pickup_location: process.env.SR_PICKUP_NAME,

    billing_customer_name: order.shippingAddress.name,
    billing_last_name: "",
    billing_address: order.shippingAddress.street,
    billing_city: order.shippingAddress.city,
    billing_pincode: order.shippingAddress.pincode,
    billing_state: order.shippingAddress.state,
    billing_country: "India",
    billing_email: "customer@mail.com",
    billing_phone: order.shippingAddress.phone,

    shipping_is_billing: true,

    order_items: order.orderItems.map((item) => ({
      name: item.name,
      sku: item.productId.toString(),
      units: item.quantity,
      selling_price: item.price,
      tax: 0,
      hsn: "6109", // Generic garment HSN (change if needed)
    })),

    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",

    sub_total: order.totalPrice,
    length: 5,  // Change accordingly
    breadth: 5,
    height: 5,
    weight: 0.5, // Change as per item weight

    // REQUIRED FIELD YOU MISSED
    pickup_phone: process.env.SR_PICKUP_PHONE,
    pickup_address: process.env.SR_PICKUP_ADDRESS,
  };

  const res = await axios.post(SR_ORDER, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};


export const trackShipment = async (awb, token) => {
  const res = await axios.get(`${SR_TRACK}${awb}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
