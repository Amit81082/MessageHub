import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: params.conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
