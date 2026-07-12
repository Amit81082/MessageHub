import prisma from "@/app/libs/prismadb";

const getConversationById = async (conversationId: string) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch {
    return null;
  }
};

export default getConversationById;
