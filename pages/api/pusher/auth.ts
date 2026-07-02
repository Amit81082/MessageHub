import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { pusherServer } from "@/app/libs/pusher";
import authOptions from "@/app/libs/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  console.log("session", session);

  if (!session?.user?.email) {
    return res.status(401).send("Unauthorized");
  }

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  const data = {
    user_id: session.user.email,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  return res.send(authResponse);
}
