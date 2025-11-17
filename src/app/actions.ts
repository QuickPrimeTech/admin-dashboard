"use server";

// server actions.ts
import webpush, { PushSubscription as WebPushSubscription } from "web-push";

webpush.setVapidDetails(
  "mailto:quickprimetech@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

let subscription: WebPushSubscription | null = null;

export type SerializablePushSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function subscribeUser(sub: SerializablePushSubscription) {
  // Convert the plain object to the type web-push expects
  const convertedSub: WebPushSubscription = {
    endpoint: sub.endpoint,
    expirationTime: sub.expirationTime,
    keys: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  };

  subscription = convertedSub;
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) throw new Error("No subscription available");

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/icon.png",
      })
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to send notification" };
  }
}
