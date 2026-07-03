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

    const { userId, isGroup, members, name } = await request.json();

    // ==================================================
    // GROUP CONVERSATION
    // ==================================================

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: currentUser.id },
            ],
          },
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const conversationForPusher = {
        ...newConversation,
        messages: [],
      };

      await Promise.all(
        newConversation.users.map((user) =>
          user.email
            ? pusherServer.trigger(
                user.email,
                "conversation:new",
                conversationForPusher,
              )
            : Promise.resolve(),
        ),
      );

      return NextResponse.json(newConversation);
    }

    // ==================================================
    // SINGLE CONVERSATION
    // ==================================================

    const existingConversations = await prisma.conversation.findMany({
      where: {
        isGroup: false,
        AND: [
          {
            userIds: {
              has: currentUser.id,
            },
          },
          {
            userIds: {
              has: userId,
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const conversationForPusher = {
      ...newConversation,
      messages: [],
    };

   await Promise.all(
     newConversation.users.map((user) =>
       user.email
         ? pusherServer.trigger(
             user.email,
             "conversation:new",
             conversationForPusher,
           )
         : Promise.resolve(),
     ),
   );


    return NextResponse.json(conversationForPusher, { status: 201 });
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
