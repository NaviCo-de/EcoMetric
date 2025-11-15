import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { nama, email, password, confirmPassword } = await req.json();

        const existingUser = await prisma.admin.findUnique({ where: { email } });

        if (existingUser)
            return NextResponse.json({ message: 'Email sudah terdaftar!' }, { status: 400});
        if (password != confirmPassword) {
            return NextResponse.json({ message: 'Password tidak sama!'}, { status: 400 })
        }
        const hashedPassword  = await bcrypt.hash(password, 10);

        const user = await prisma.admin.create({
            data: {nama, email, password: hashedPassword}
        })

        return NextResponse.json({ message: 'Registrasi Berhasil!', user })
    } catch (err) {
        return NextResponse.json({ message: 'Registrasi Gagal!!'}, { status: 500 })
    }
}