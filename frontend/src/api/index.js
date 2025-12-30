import api from "./axios";
export const getHeroSlides = () => api.get("/hero");

/* ================= COUPONS ================= */
export const validateCoupon = (data) => api.post("/coupons/validate", data);
