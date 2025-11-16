import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import { cookies } from "next/headers";
import { TipePabrik } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.admin.findUnique({ where: { email }});
        if (!user) {
            return NextResponse.json({ message: 'User tidak ditemukan!'}, { status: 400});
        }

        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return NextResponse.json({ message: 'Password Salah!'}, { status: 400 });
        }

        const SECRET_KEY = process.env.JWT_SECRET_KEY
        if (!SECRET_KEY) throw new Error("JWT_SECRET_KEY kosong!");

        const payload = {
            id: user.id,
            role: user.role,
            tipePabrik: user.tipePabrik
        }

        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: '1d'
        });

        (await cookies()).set('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/'
        })

        return NextResponse.json({
            message: 'Login berhasil',
        });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}