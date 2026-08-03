"use client";

import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import axios from "axios";

import { getFirebaseMessaging } from "@/app/libs/firebase";

const NotificationProvider = () => {
  useEffect(() => {
    const initNotifications = async () => {
      try {
        if (!("Notification" in window)) {
          return;
        }


        const permission = await Notification.requestPermission();


        if (permission !== "granted") {
          return;
        }

        const messaging = await getFirebaseMessaging();

        if (!messaging) return;

       await navigator.serviceWorker.register("/firebase-messaging-sw.js");

       const registration = await navigator.serviceWorker.ready;

       const token = await getToken(messaging, {
         vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
         serviceWorkerRegistration: registration,
       });

        console.log("FCM token:", token);
        await axios.post("/api/fcm-token", {
          token,
        });

        console.log("FCM token saved");
      } catch (error) {
        console.error(error);
      }
    };

    initNotifications();
  }, []);

  return null;
};

export default NotificationProvider;
