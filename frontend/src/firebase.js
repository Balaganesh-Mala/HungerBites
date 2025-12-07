import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHws3R27my3Y06kZWPzCt7o4J9mbrDylw",
  authDomain: "flutter-ai-playground-29a3d.firebaseapp.com",
  projectId: "flutter-ai-playground-29a3d",
  storageBucket: "flutter-ai-playground-29a3d.firebasestorage.app",
  messagingSenderId: "124672282726",
  appId: "1:124672282726:web:e922d7f19a0fb385439da7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
