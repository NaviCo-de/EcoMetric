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
import NoPabrikCard from './NoPabrikCard';


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
function InfoBox({ title, content }: { title: string, content?: string | null }) {
  return (
    <div className='w-full border border-neutral-20 px-7 py-4 bg-white rounded-lg mt-4 shadow-sm'>
      <p className="font-semibold text-neutral-80 mb-2">{title}</p>
      <p className="text-neutral-60 text-sm">
        {content || 'Data tidak tersedia'}
      </p>
    </div>
  );
}

export default async function AdminDashboard() {
  const { produsen, distributor, konsumen, pabrikSaya } = await getAdminDashboardData()
  const hasRantai = !!pabrikSaya.rantaiId;

  return (
    <div className='flex flex-col items-center w-full gap-12'>
      
      {/* Header Judul */}
      <div>
        <h1 className='text-sh5'>
          Anda sebagai <span className='text-h3 text-blue-base font-bold'>{pabrikSaya.tipePabrik}</span>
        </h1>
      </div>

      {hasRantai ? (
        <div className='flex justify-between gap-10 w-full'>
          
          <div className='flex flex-col items-center justify-start w-1/2 h-fit'>
            
            {pabrikSaya.tipePabrik === 'DISTRIBUTOR' && <h1 className='text-h4 text-blue-base font-bold mb-4'>Produsen Anda</h1>}
            {pabrikSaya.tipePabrik === 'KONSUMEN' && <h1 className='text-h4 text-blue-base font-bold mb-4'>Produsen Anda</h1>}
            {pabrikSaya.tipePabrik === 'PRODUSEN' && <h1 className='text-h4 text-blue-base font-bold mb-4'>Distributor Anda</h1>}

            {(() => {
               let partner = null;
               if (pabrikSaya.tipePabrik !== 'PRODUSEN') partner = produsen;
               else partner = distributor;

               if (!partner) return <p className="text-center text-neutral-50">Menunggu Partner...</p>;

               return (
                 <div className="w-full flex flex-col gap-2">
                    <Accordion type="single" collapsible className="w-full">
                      <PabrikCard pabrik={partner} isPabrikAnda={false} />
                    </Accordion>

                    <InfoBox 
                      title="Deskripsi:" 
                      content={partner.laporan[0]?.deskripsiAI || "Belum ada deskripsi."} 
                    />

                    <InfoBox 
                      title="Lokasi & Kontak:" 
                      content={`${partner.lokasi || '-'} | ${partner.kontak || '-'}`} 
                    />
                 </div>
               );
            })()}
          </div>



          <div className='flex flex-col items-center justify-start w-1/2 h-fit'>
            
            {pabrikSaya.tipePabrik === 'DISTRIBUTOR' && <h1 className='text-h4 text-blue-base font-bold mb-4'>Konsumen Anda</h1>}
            {pabrikSaya.tipePabrik === 'PRODUSEN' && <h1 className='text-h4 text-blue-base font-bold mb-4'>Konsumen Anda</h1>}
            {pabrikSaya.tipePabrik === 'KONSUMEN' && <h1 className='text-h4 text-blue-base font-bold mb-4'>Distributor Anda</h1>}


            {(() => {
               let partner = null;
               if (pabrikSaya.tipePabrik !== 'KONSUMEN') partner = konsumen;
               else partner = distributor;

               if (!partner) return <p className="text-center text-neutral-50">Menunggu Partner...</p>;

               return (
                 <div className="w-full flex flex-col gap-2">
                    <Accordion type="single" collapsible className="w-full">
                       <PabrikCard pabrik={partner} isPabrikAnda={false} />
                    </Accordion>

                    <InfoBox 
                      title="Deskripsi:" 
                      content={partner.laporan[0]?.deskripsiAI || "Belum ada deskripsi."} 
                    />

                    <InfoBox 
                      title="Lokasi & Kontak:" 
                      content={`${partner.lokasi || '-'} | ${partner.kontak || '-'}`} 
                    />
                 </div>
               );
            })()}
          </div>
          
        </div>
      ) : (
        <NoPabrikCard />
      )}


      {/* --- BAGIAN PABRIK SAYA (TETAP SAMA - Tanpa Kotak Info Tambahan) --- */}
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