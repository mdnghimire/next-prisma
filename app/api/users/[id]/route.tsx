import prisma from "@/db";
import { userschema } from "@/schemas/api-schemas/user/user-schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = userschema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation?.error?.errors, { status: 400 });

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
        email: body.email,
      },
    });

    return NextResponse.json(updateUser);
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.user.delete({
      where: { id: user.id },
    });
    return NextResponse.json({});
  } catch (error) {
    console.log(error);
  }
}
