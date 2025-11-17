import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { EQSSchema } from '@/lib/validation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Kualitas } from '@prisma/client';

type UserPayload = {
    id: string;
    role: 'ADMIN' | 'SUPERADMIN';
    tipePabrik: 'PRODUSEN' | 'DISTRIBUTOR' | 'KONSUMEN';
}

function getKualitasEnum(statusFromAI: string): Kualitas {
  const upperStatus = statusFromAI.toUpperCase();
  
  if (upperStatus === 'GOOD') return Kualitas.GOOD;
  if (upperStatus === 'MODERATE') return Kualitas.MODERATE;
  if (upperStatus === 'POOR') return Kualitas.POOR;
  

  console.warn(`Status AI tidak dikenal: ${statusFromAI}, di-default ke MODERATE`);
  return Kualitas.MODERATE;
}

export async function POST(req: Request) {
    try {
        const tokenCookie = (await cookies()).get('session_token');
        if (!tokenCookie) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const SECRET_KEY = process.env.JWT_SECRET_KEY;
        if (!SECRET_KEY) throw new Error("JWT_SECRET_KEY kosong!");

        const payload = jwt.verify(tokenCookie.value, SECRET_KEY) as UserPayload;
        const pabrikId = payload.id;

        const body = await req.json();
        const validInput = EQSSchema.parse(body);

        const aiBody = validInput
        const aiRes = await fetch("http://127.0.0.1:8000/predict", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aiBody)
        });

        if (!aiRes.ok) {
            const aiError = await aiRes.json();
            console.log(aiError.detail)
            return NextResponse.json({ message: 'Gagal memproses data AI', detail: aiError.detail }, { status: 502 });
        }

        const aiResult = await aiRes.json();

        const skor = aiResult.EQS;
        const deskripsiAI = aiResult.Description || "Analisis AI selesai.";

        const statusString = aiResult.Category; 
        const statusEnum = getKualitasEnum(statusString);

        const laporanBaru = await prisma.laporan.create({
            data: {
                skor: skor,
                deskripsiAI: deskripsiAI,
                status: statusEnum,
                pabrikId: pabrikId
            }
        });

        return NextResponse.json(laporanBaru, { status: 201 });
    } catch (err) {
        console.error("Error di /api/laporan:", err);
    
        if (err instanceof z.ZodError) {
            return NextResponse.json({ message: 'Input tidak valid' }, { status: 400 });
        }
        
        return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
    }
}