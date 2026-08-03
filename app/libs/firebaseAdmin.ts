import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

import serviceAccount from "../../firebase-adminsdk.json";

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
  });
}

export const adminMessaging = getMessaging();
