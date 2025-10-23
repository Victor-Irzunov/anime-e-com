// /app/api/user/set-password/route.js — СОЗДАТЬ НОВЫЙ ФАЙЛ
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { resetToken, password } = await req.json();
    if (!resetToken || !password) return new NextResponse("Bad request", { status: 400 });

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: resetToken,
        passwordResetTokenExp: { gt: new Date() },
      },
    });
    if (!user) return new NextResponse("Токен недействителен или истёк", { status: 400 });

    const hashed = await bcrypt.hash(password.toString(), 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        isGuest: false,
        passwordResetToken: null,
        passwordResetTokenExp: null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/user/set-password error:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
