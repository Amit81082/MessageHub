import { getServerSession } from "next-auth";

import authOptions from "@/app/libs/auth";
import prisma from "@/app/libs/prismadb";

const getUsers = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return [];
    }

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch {
    return [];
  }
};

export default getUsers;
