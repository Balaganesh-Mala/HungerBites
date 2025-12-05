import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzIDpPH3q9Q3JZhaLPWapl5Ty4oYLa5tk",
  authDomain: "wonew-f7e49.firebaseapp.com",
  projectId: "wonew-f7e49",
  storageBucket: "wonew-f7e49.appspot.com",
  messagingSenderId: "833112336792",
  appId: "1:833112336792:web:1185ee50ac3e7ea2ffa3ed",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    window.recaptchaVerifier.render();
  }
};
