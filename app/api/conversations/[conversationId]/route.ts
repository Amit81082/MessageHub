import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  try {
    const currentUser = await getCurrentUser();

    // ==================================================
    // USER VALIDATION
    // ==================================================

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const { conversationId } = params;

    if (!conversationId) {
      return new NextResponse("Invalid ID", {
        status: 400,
      });
    }

    // ==================================================
    // FIND CONVERSATION
    // ==================================================

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Conversation not found", {
        status: 404,
      });
    }

    if (!existingConversation.userIds.includes(currentUser.id)) {
      return new NextResponse("Forbidden", {
        status: 403,
      });
    }

    // ==================================================
    // DELETE CONVERSATION
    // ==================================================

    const deletedConversation = await prisma.$transaction([
      prisma.message.deleteMany({
        where: {
          conversationId,
        },
      }),
      prisma.conversation.delete({
        where: {
          id: conversationId,
        },
      }),
    ]);

    await Promise.all(
      existingConversation.users.map((user) => {
        if (!user.email) return;

        return pusherServer.trigger(user.email, "conversation:remove", {
          id: existingConversation.id,
        });
      }),
    );

    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
