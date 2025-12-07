import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Resolve correct path
const serviceAccountPath = path.resolve("src/config/firebase-service.json");

// Read JSON key
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;  
