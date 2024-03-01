import prisma from "@/db";
import { userschema } from "@/schemas/api-schemas/user/user-schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
    return NextResponse.json(users, {
      status: 200,
      statusText: "Users fetched successfully",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = userschema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.errors, { status: 400 });

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
      },
    });
    return NextResponse.json(newUser, {
      status: 201,
      statusText: "User created successfully",
    });
  } catch (error) {
    console.log(error);
  }
}
