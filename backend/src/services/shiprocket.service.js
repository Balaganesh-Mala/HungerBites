import axios from "axios";

let shiprocketToken = null;
let tokenExpiry = null;

const SHIPROCKET_URL = process.env.SHIPROCKET_BASE_URL;

/* ================= LOGIN ================= */
const loginShiprocket = async () => {
  try {
    const res = await axios.post(
      `${SHIPROCKET_URL}/auth/login`,
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      },
      { timeout: 10000 }
    );

    shiprocketToken = res.data.token;
    tokenExpiry = Date.now() + 8 * 60 * 60 * 1000; // 8 hours

    return shiprocketToken;
  } catch (err) {
    console.error("❌ Shiprocket Login Failed", err.response?.data || err.message);
    throw new Error("Unable to authenticate Shiprocket");
  }
};

/* ================= TOKEN HANDLER ================= */
const getShiprocketToken = async () => {
  if (shiprocketToken && tokenExpiry && tokenExpiry > Date.now()) {
    return shiprocketToken;
  }

  return await loginShiprocket();
};

/* ================= API REQUEST WRAPPER ================= */
const shiprocketRequest = async (method, url, data = {}) => {
  try {
    const token = await getShiprocketToken();

    return await axios({
      method,
      url: `${SHIPROCKET_URL}${url}`,
      data,
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    // 🔁 Retry once if token expired
    if (err.response?.status === 401) {
      shiprocketToken = null;
      const token = await loginShiprocket();

      return axios({
        method,
        url: `${SHIPROCKET_URL}${url}`,
        data,
        timeout: 15000,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    console.error(
      "🚚 Shiprocket API Error:",
      err.response?.data || err.message
    );

    throw new Error("Shiprocket service unavailable");
  }
};

/* ================= EXPORT ================= */
export const ShiprocketService = {
  request: shiprocketRequest,
};

export const generateAWB = async (shipmentId) => {
  return ShiprocketService.request(
    "post",
    "/courier/assign/awb",
    {
      shipment_id: shipmentId,
    }
  );
};

export const requestPickup = async (shipmentId) => {
  return ShiprocketService.request(
    "post",
    "/courier/generate/pickup",
    {
      shipment_id: [shipmentId],
    }
  );
};

