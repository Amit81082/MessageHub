import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationLookup = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return [];
    }

    return await prisma.conversation.findMany({
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      select: {
        id: true,
        userIds: true,
        isGroup: true,
      },
    });
  } catch {
    return [];
  }
};

export default getConversationLookup;
