import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { token } = await request.json();

    if (!token) {
      return new NextResponse("Token required", { status: 400 });
    }

    const existingToken = await prisma.deviceToken.findUnique({
      where: {
        token,
      },
    });

    if (existingToken) {
      return NextResponse.json(existingToken);
    }

    const deviceToken = await prisma.deviceToken.create({
      data: {
        token,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(deviceToken);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
