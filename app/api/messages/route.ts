console.time("TOTAL");
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { message, image, conversationId, clientId } = await request.json();

    if (!message && !image) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    console.time("create");
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },

      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        seen: {
          select: {
            id: true,
            name : true,
            email: true,
            image: true
          },
        },
      },
    });

    // console.timeEnd("create");

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      select: {
        id: true,
        users: {
          select: {
            email: true,
          },
        },
      },
    });

    // console.log(newMessage.sender);

    const messageForPusher = {
      id: newMessage.id,
      body: newMessage.body,
      image: newMessage.image,
      createdAt: newMessage.createdAt,
      senderId: newMessage.sender.id, // ✅ ADD
      conversationId: newMessage.conversationId, // ✅ ADD
      seenIds: newMessage.seen.map((u) => u.id), // ✅ ADD

      sender: {
        id: newMessage.sender.id,
        name: newMessage.sender.name,
        email: newMessage.sender.email,
        image: newMessage.sender.image,
      },

      seen: newMessage.seen.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image
      })),
    };
    await pusherServer.trigger(conversationId, "messages:new", {
      ...messageForPusher,
      clientId,
    });

    await Promise.all(
      updatedConversation.users.map((user) =>
        pusherServer.trigger(user.email!, "conversation:update", {
          id: conversationId,
          messages: [messageForPusher],
        }),
      ),
    );

    console.timeEnd("TOTAL");
    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

