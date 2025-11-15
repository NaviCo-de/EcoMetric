import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const { password, confirmPassword, token } = await req.json();

        const SECRET_KEY = process.env.JWT_SECRET_KEY;
        if (!SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY kosong!");
        }

        let decoded;

        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            console.error('JWT Verify Error:', err);
            return NextResponse.json(
                { message: 'Token tidak valid atau kedaluwarsa.' }, 
                { status: 401 }
            );
        }
        
        const { email } = decoded as { email: string };
    
        if (password != confirmPassword) {
            return NextResponse.json({ message: 'Password tidak sama!'}, { status: 400 })
        }
        const hashedPassword  = await bcrypt.hash(password, 10);

        const user = await prisma.admin.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword,
            }
        })

        return NextResponse.json({ message: 'Registrasi Berhasil!', user })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: 'Registrasi Gagal!!'}, { status: 500 })
    }
}