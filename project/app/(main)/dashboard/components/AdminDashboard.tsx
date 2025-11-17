import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { Kualitas } from '@/components/ui/Kualitas';
import PabrikCard from './PabrikCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion" 


type UserPayload = {
    id: string;
    tipePabrik: 'PRODUSEN' | 'DISTRIBUTOR' | 'KONSUMEN';
    role: 'ADMIN' | 'SUPERADMIN';
}

async function getAdminDashboardData() {
  const tokenCookie = (await cookies()).get('session_token');
  if (!tokenCookie) redirect('/login')
  let payload: UserPayload;

  try {
    payload =  jwt.verify(tokenCookie.value, process.env.JWT_SECRET_KEY!) as UserPayload
  } catch (err){
    console.log("Token tidak valid:", err)
    redirect('/login')
  }

  const { id } = payload

  const firstRelation = await prisma.rantaiPasok.findMany({
    where: { pabrikRelasi2Id: id},
    include: { pabrikRelasi1: true }
  });
  
  const pabrikRelasi1 = firstRelation.map(rel => rel.pabrikRelasi1)

  const secondRelation = await prisma.rantaiPasok.findMany({
    where: { pabrikRelasi1Id: id},
    include: { pabrikRelasi2: true }
  });

  const pabrikRelasi2 = secondRelation.map(rel => rel.pabrikRelasi2)

  const pabrikSaya = await prisma.admin.findUnique({
    where: { id },
    include: {
      laporan: {
        orderBy: { createdAt: 'desc'},
        take: 5
      }
    }
  })

  if (!pabrikSaya) {
    throw new Error("Data pabrik tidak ditemukan")
  }

  return { pabrikRelasi1, pabrikRelasi2, pabrikSaya }
}
export default async function AdminDashboard() {
  const { pabrikRelasi1, pabrikRelasi2, pabrikSaya } = await getAdminDashboardData()

  return (
    <div className='flex flex-col items-center w-full'>
      <div>
        <h1 className='text-sh5'>
          Anda sebagai <span className='text-h3 text-blue-base font-bold'>{pabrikSaya.tipePabrik}</span>
        </h1>
      </div>

      <div>

      </div>

      <div className='w-full'>
        <Accordion type="single" collapsible className="w-full">
          <PabrikCard 
            pabrik={pabrikSaya}
          />
        </Accordion>
        <Kualitas variant='GOOD'/>
        <Kualitas variant='MODERATE'/>
        <Kualitas variant='POOR'/>
      </div>
    </div>
  )
}