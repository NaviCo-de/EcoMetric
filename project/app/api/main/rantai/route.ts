import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { namaRantai, produsenId, distributorId, konsumenId } = await req.json();

    // Validasi sederhana
    if (!produsenId || !distributorId || !konsumenId) {
      return NextResponse.json({ message: "Semua pihak harus dipilih" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const newRantai = await tx.rantai.create({
        data: {
          nama: namaRantai
        }
      });

      await tx.admin.update({
        where: { id: produsenId },
        data: { rantaiId: newRantai.id }
      });

      await tx.admin.update({
        where: { id: distributorId },
        data: { rantaiId: newRantai.id }
      });

      await tx.admin.update({
        where: { id: konsumenId },
        data: { rantaiId: newRantai.id }
      });

      return newRantai;
    });

    return NextResponse.json({ message: "Rantai berhasil dibuat" }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal membuat rantai" }, { status: 500 });
  }
}