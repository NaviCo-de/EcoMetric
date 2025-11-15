import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const existingUser = await prisma.admin.findUnique({ where: { email } });

        if (!existingUser) {
            return NextResponse.json({ message: 'Jika email terdaftar, Anda akan menerima email reset.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        
        const hashedOtp = await bcrypt.hash(otp, 10);

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await prisma.passwordResetToken.create({
            data: {
                email: email,
                token: hashedOtp,
                expiresAt: expiresAt,
            }
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_SERVER_USER,
            to: email,
            subject: 'Kode Reset Password EcoMetric',
            html: `
                <h1>Reset Password</h1>
                <p>Gunakan kode OTP ini untuk me-reset password Anda. Kode ini hanya berlaku 5 menit.</p>
                <h2 style="font-size: 2.5rem; letter-spacing: 5px;"><b>${otp}</b></h2>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email reset password telah dikirim' })
    } catch (err) {
        return NextResponse.json({ message: 'Terjadi kesalahan!'}, { status: 500 })
    }
}