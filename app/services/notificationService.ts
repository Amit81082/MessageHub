import { adminMessaging } from "@/app/libs/firebaseAdmin";
import prisma from "@/app/libs/prismadb";

interface SendPushNotificationProps {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushNotification({
  tokens,
  title,
  body,
  data,
}: SendPushNotificationProps) {
  if (!tokens.length) return;

  try {
  const response = await adminMessaging.sendEach(
    tokens.map((token) => ({
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        fcmOptions: {
          link: `${process.env.NEXT_PUBLIC_APP_URL}/conversations/${data?.conversationId}`,
        },
      },
    })),
  );
    response.responses.forEach(async (res, index) => {
      if (!res.success) {
        console.error(res.error?.code);

        if (res.error?.code === "messaging/registration-token-not-registered") {
          await prisma.deviceToken.deleteMany({
            where: {
              token: tokens[index],
            },
          });
        }
      }
    });

    console.log("✅ Push notification sent");
  } catch (error) {
    console.error("❌ Push notification failed:", error);
  }
}
