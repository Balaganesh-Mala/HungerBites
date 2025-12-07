import admin from "../config/firebase-admin.js";

export const verifyFirebaseToken = async (req, res, next) => {
  // Accept token from frontend either in body or header
  const firebaseToken =
    req.body.firebaseToken || req.headers["firebase-token"];

  if (!firebaseToken) {
    return res.status(400).json({ message: "Firebase token missing" });
  }

  try {
    // Decode Firebase ID Token
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    // Optional: Check token expiration
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ message: "Invalid Firebase token" });
    }

    req.firebaseUser = decoded; // attach user for controller usage
    next();
  } catch (error) {
    console.error("Firebase verification error:", error.message);
    return res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
};
