import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        const resetRequest = await prisma.passwordResetToken.findFirst({
            where: {
                email: email,
                expiresAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                expiresAt: 'desc'
            }
        });

        if (!resetRequest) {
            return NextResponse.json({ message: 'Kode OTP tidak valid atau kedaluwarsa' }, { status: 400 });
        }

        const isOtpValid = await bcrypt.compare(otp, resetRequest.token);

        if (!isOtpValid) {
            return NextResponse.json({ message: 'Kode OTP salah' }, { status: 400 });
        }

        const SECRET_KEY = process.env.JWT_SECRET_KEY;
        if (!SECRET_KEY) throw new Error("JWT_SECRET_KEY kosong!");

        const payload = {
            email: resetRequest.email,
            purpose: 'reset-password'
        };

        const resetToken = jwt.sign(payload, SECRET_KEY, {
            expiresIn: '10m'
        });

        await prisma.passwordResetToken.delete({
            where: { id: resetRequest.id }
        })

        return NextResponse.json({
            message: 'OTP terverifikasi',
            resetToken: resetToken
        })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 });
    }
}