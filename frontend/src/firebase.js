import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCH3HWRTmPGCg8QM8y9isrvPb0RYHkAwKI",
    authDomain: "backend-e5086.firebaseapp.com",
    projectId: "backend-e5086",
    storageBucket: "backend-e5086.firebasestorage.app",
    messagingSenderId: "336557170305",
    appId: "1:336557170305:web:4890b8c7e3fae43826f780",
    measurementId: "G-FKQFYQ3KZC"
  };

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: "BN7An_CHlqSGiYeOMcYDVJyZzyE_xaLJTTp9FyWHwqonHr00XjXQhhSwpSEeeFQ5FiPmBK7rTLFt-Jum42c4PME" });
    if (currentToken) {
      console.log("Token FCM obtenido:", currentToken);
      return currentToken;
    } else {
      console.warn("No se pudo obtener el token FCM.");
    }
  } catch (error) {
    console.error("Error al obtener el token FCM:", error);
  }
};

const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Mensaje recibido:", payload);
      resolve(payload);
    });
  });

export { messaging, requestForToken, onMessageListener };
