// app/api/register/route.ts

import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 👉 Validation
    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", {
        status: 400,
      });
    }

    // 👉 Check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("Email already exists", {
        status: 409,
      });
    }

    // 👉 Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 👉 Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
