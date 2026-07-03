import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { conversationId } = params;

    if (!conversationId) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 404 });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

     if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
       return NextResponse.json(conversation);
     }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

   const messageForPusher = {
     id: updatedMessage.id,
     body: updatedMessage.body,
     image: updatedMessage.image,
     createdAt: updatedMessage.createdAt,
     conversationId: updatedMessage.conversationId,
     senderId: updatedMessage.senderId,
     seenIds: updatedMessage.seen.map((u) => u.id),

     sender: {
       id: updatedMessage.sender.id,
       name: updatedMessage.sender.name,
       email: updatedMessage.sender.email,
       image: updatedMessage.sender.image,
     },

     seen: updatedMessage.seen.map((u) => ({
       id: u.id,
       email: u.email,
       name: u.name, 
       image: u.image,
     })),
   };

   console.log(JSON.stringify(messageForPusher).length);

   await pusherServer.trigger(
     conversationId,
     "message:update",
     messageForPusher,
   );

    await pusherServer.trigger(conversationId!, "message:update", messageForPusher);


    return NextResponse.json(updatedMessage);

  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_SEEN");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
