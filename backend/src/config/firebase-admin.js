import admin from "firebase-admin";



// Ensure .env loaded
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.FIREBASE_CLIENT_EMAIL
) {
  console.error("❌ Missing Firebase service account env values");
  throw new Error("Firebase env variables missing");
}

// Build service account
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  token_uri: process.env.FIREBASE_TOKEN_URI
};

// Initialize
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("🔥 Firebase Admin Initialized Successfully");
}

export default admin;
