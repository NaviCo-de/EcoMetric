'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from '@/lib/prisma';

export async function logout() {
    (await cookies()).delete('session_token');
    redirect('/login')
}

export type PabrikAvailable = {
    id: string;
    nama: string;
};

export async function getAvailablePabriks() {
    try {
        const available = await prisma.admin.findMany({
            where: {
                rantaiId: null, 
                role: 'ADMIN'
            },
            select: { 
                id: true, 
                nama: true, 
                tipePabrik: true 
            }
        });

        // Pisahkan berdasarkan tipe
        return {
            produsen: available.filter(p => p.tipePabrik === 'PRODUSEN'),
            distributor: available.filter(p => p.tipePabrik === 'DISTRIBUTOR'),
            konsumen: available.filter(p => p.tipePabrik === 'KONSUMEN'),
        };
    } catch (error) {
        console.error("Gagal mengambil data pabrik:", error);
        return { produsen: [], distributor: [], konsumen: [] };
    }
}