import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { Kualitas } from '@/components/ui/Kualitas';
import PabrikCard from './PabrikCard';
import type { Admin, Laporan } from '@prisma/client';
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

type AdminWithLaporan = Admin & {
  laporan: Laporan[]
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

  let produsen: AdminWithLaporan | null = null;
  let distributor: AdminWithLaporan | null = null;
  let konsumen: AdminWithLaporan | null = null;

  if (pabrikSaya.rantaiId) {
    const rekanSatuRantai = await prisma.admin.findMany({
      where: {
        rantaiId: pabrikSaya.rantaiId,
        NOT: { id: id }
      },
      include: {
        laporan: {
          orderBy: { createdAt: 'desc'},
          take: 1
        }
      }
    })

    produsen = rekanSatuRantai.find(p => p.tipePabrik === 'PRODUSEN') || null;
    distributor = rekanSatuRantai.find(p => p.tipePabrik === 'DISTRIBUTOR') || null;
    konsumen = rekanSatuRantai.find(p => p.tipePabrik === 'KONSUMEN') || null;
  }

  return { produsen, distributor, konsumen, pabrikSaya }
}
export default async function AdminDashboard() {
  const { produsen, distributor, konsumen, pabrikSaya } = await getAdminDashboardData()

  return (
    <div className='flex flex-col items-center w-full gap-10'>
      <div>
        <h1 className='text-sh5'>
          Anda sebagai <span className='text-h3 text-blue-base font-bold'>{pabrikSaya.tipePabrik}</span>
        </h1>
      </div>

      {pabrikSaya.tipePabrik === 'DISTRIBUTOR' &&
        <div className='flex justify-between gap-10 w-full'>
          <div className='flex flex-col items-center justify-center w-1/2 h-fit'>
            <h1 className='text-h4 text-blue-base font-bold'>Produsen <span className='text-sh5 text-black font-normal'>Anda</span></h1>
            <div className='flex flex-col gap-5 w-full'>
              <Accordion type="single" collapsible className="w-full">
                <PabrikCard 
                  pabrik={produsen!}
                  isPabrikAnda={false}
                />
              </Accordion>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Deskripsi:</p>
                <p>{produsen?.laporan[0] ? produsen?.laporan[0].deskripsiAI : 'Belum ada deskripsi'}</p>
              </div>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Lokasi & Kontak:</p>
                <p>{produsen?.lokasi}</p>
                <p>{produsen?.kontak}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center w-1/2 h-fit'>
            <h1 className='text-h4 text-blue-base font-bold'>Konsumen <span className='text-sh5 text-black font-normal'>Anda</span></h1>
            <div className='flex flex-col gap-5 w-full'>
              <Accordion type="single" collapsible className="w-full">
                <PabrikCard 
                  pabrik={konsumen!}
                />
              </Accordion>
              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Deskripsi:</p>
                <p>{konsumen?.laporan[0] ? konsumen?.laporan[0].deskripsiAI : 'Belum ada deskripsi'}</p>
              </div>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Lokasi & Kontak:</p>
                <p>{konsumen?.lokasi}</p>
                <p>{konsumen?.kontak}</p>
              </div>
            </div>
          </div>
        </div>
      }

      {pabrikSaya.tipePabrik === 'KONSUMEN' &&
        <div className='flex justify-between gap-10 w-full'>
          <div className='flex flex-col items-center justify-center w-1/2 h-fit'>
            <h1 className='text-h4 text-blue-base font-bold'>Produsen <span className='text-sh5 text-black font-normal'>Anda</span></h1>
            <div className='flex flex-col gap-5 w-full'>
              <Accordion type="single" collapsible className="w-full">
                <PabrikCard 
                  pabrik={produsen!}
                  isPabrikAnda={false}
                />
              </Accordion>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Deskripsi:</p>
                <p>{produsen?.laporan[0] ? produsen?.laporan[0].deskripsiAI : 'Belum ada deskripsi'}</p>
              </div>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Lokasi & Kontak:</p>
                <p>{produsen?.lokasi}</p>
                <p>{produsen?.kontak}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center w-1/2 h-fit'>
            <h1 className='text-h4 text-blue-base font-bold'>Distributor <span className='text-sh5 text-black font-normal'>Anda</span></h1>
            <div className='flex flex-col gap-5 w-full'>
              <Accordion type="single" collapsible className="w-full">
                <PabrikCard 
                  pabrik={distributor!}
                />
              </Accordion>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Deskripsi:</p>
                <p>{distributor?.laporan[0] ? distributor?.laporan[0].deskripsiAI : 'Belum ada deskripsi'}</p>
              </div>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Lokasi & Kontak:</p>
                <p>{distributor?.lokasi}</p>
                <p>{distributor?.kontak}</p>
              </div>
            </div>
          </div>
        </div>
      }

      {pabrikSaya.tipePabrik === 'PRODUSEN' &&
        <div className='flex justify-between gap-10 w-full'>
          <div className='flex flex-col items-center justify-center w-1/2 h-fit'>
            <h1 className='text-h4 text-blue-base font-bold'>Distributor <span className='text-sh5 text-black font-normal'>Anda</span></h1>
            <div className='flex flex-col gap-5 w-full'>
              <Accordion type="single" collapsible className="w-full">
                <PabrikCard 
                  pabrik={distributor!}
                  isPabrikAnda={false}
                />
              </Accordion>
              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Deskripsi:</p>
                <p>{distributor?.laporan[0] ? distributor?.laporan[0].deskripsiAI : 'Belum ada deskripsi'}</p>
              </div>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Lokasi & Kontak:</p>
                <p>{distributor?.lokasi}</p>
                <p>{distributor?.kontak}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center w-1/2 h-fit'>
            <h1 className='text-h4 text-blue-base font-bold'>Konsumen <span className='text-sh5 text-black font-normal'>Anda</span></h1>
            <div className='flex flex-col gap-5 w-full'>
              <Accordion type="single" collapsible className="w-full">
                <PabrikCard 
                  pabrik={konsumen!}
                />
              </Accordion>
              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Deskripsi:</p>
                <p>{konsumen?.laporan[0] ? konsumen?.laporan[0].deskripsiAI : 'Belum ada deskripsi'}</p>
              </div>

              <div className='w-full border border-neutral-base  px-7 py-4'>
                <p>Lokasi & Kontak:</p>
                <p>{konsumen?.lokasi}</p>
                <p>{konsumen?.kontak}</p>
              </div>
            </div>
          </div>
        </div>
      }


      <div className='w-full flex flex-col justify-center items-center gap-7'>
        <h1 className='text-h4 text-blue-base font-bold'>Pabrik <span className='text-sh5 text-black font-normal'>Anda</span></h1>
        <Accordion type="single" collapsible className="w-full">
          <PabrikCard 
            pabrik={pabrikSaya}
            isPabrikAnda={true}
          />
        </Accordion>
      </div>
    </div>
  )
}