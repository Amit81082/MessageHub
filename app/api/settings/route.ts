// app/api/settings/route.ts

import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
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

    // ==================================================
    // REQUEST DATA
    // ==================================================

    const { name, image } = await request.json();

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!name?.trim()) {
      return new NextResponse("Name is required", {
        status: 400,
      });
    }

    // ==================================================
    // UPDATE USER
    // ==================================================

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: name.trim(),
        image,
      },
    });

    // ==================================================
    // RESPONSE
    // ==================================================

    return NextResponse.json(updatedUser);
  } catch (error : any) {
    console.log( "Settings error: ", error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
