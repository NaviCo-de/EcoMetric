'use client';
import type { Admin, Laporan } from '@prisma/client';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Kualitas } from '@/components/ui/Kualitas';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { id as localeID } from 'date-fns/locale/id';

type PabrikWithLaporan = Admin & {
    laporan: Laporan[]
}

type PabrikCardProps = {
    pabrik: PabrikWithLaporan;
    isPabrikAnda?: boolean;
}

function PabrikDetailContent({ pabrik, histori, isPabrikAnda }: { pabrik: PabrikWithLaporan, histori: Laporan[], isPabrikAnda?: boolean}) {
    type KualitasVariant = "GOOD" | "MODERATE" | "POOR" | null;
    const skorRataRata = histori.length > 0
        ? (histori.reduce((acc, lap) => acc + lap.skor, 0) / histori.length).toFixed(0)
        : 'N/A';
    
    let statusRataRata: KualitasVariant = null;
    if (skorRataRata !== 'N/A') {
        const rataRata = parseFloat(skorRataRata);
        if (rataRata >= 70) {
            statusRataRata = "GOOD";

        } else if (rataRata >= 35) {
            statusRataRata = "MODERATE";

        } else {
            statusRataRata = "POOR";

        }
    }
    return (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6'>
            <div className='md:col-span-1'>
                <h3 className='text-h9 text-neutral-90 font-semibold'>Histori</h3>
                <div className="space-y-2">
                    {histori.length > 0 ? (
                        histori.map((laporan) => {
                            const tanggalLaporan = new Date(laporan.createdAt);
                            let waktuRelatif: string;

                            if (isToday(tanggalLaporan)) {
                                waktuRelatif = "Hari ini";
                            } else if (isYesterday(tanggalLaporan)) {
                                waktuRelatif = "Kemarin";
                            } else {
                                waktuRelatif = formatDistanceToNow(tanggalLaporan, { 
                                    addSuffix: true, 
                                    locale: localeID 
                                });
                            }
                            return (
                                <div 
                                    key={laporan.id} 
                                    className="flex justify-between items-center text-sm p-2 bg-neutral-10"
                                >
                                    <span className="text-neutral-90">
                                        {waktuRelatif}
                                    </span>
                                    <span className="text-neutral-90 font-medium">{laporan.skor}</span>
                                    <Kualitas 
                                        variant={laporan.status}
                                    />
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-sm text-neutral-500">Belum ada histori laporan.</p>
                    )}
                </div>
            </div>

            <div className='md:col-span-1 flex flex-col items-center justify-center border-neutral-base border-l'>
                <h3 className='text-h9 text-neutral-90 font-semibold'>Rata-rata Kualitas</h3>
                <h3 className='text-h5 text-neutral-90 font-bold'>{skorRataRata}</h3>
                <Kualitas 
                    variant={statusRataRata}
                />
            </div>

            <div className='md:col-span-1 border-neutral-base border-l px-7'>
                <h3 className='text-h9 text-neutral-90 font-semibold text-center'>Deskripsi Selengkapnya</h3>
                <h3 className='text-h9 text-neutral-90'>{pabrik.laporan[0].deskripsiAI}</h3>
            </div>

            <div className='md:col-span-1 border-neutral-base border-l px-7'>
                <h3 className='text-h9 text-neutral-90 font-semibold text-center'>Lokasi & Kontak</h3>
                <h3 className='text-h9 text-neutral-90'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h3>
            </div>
        </div>
    )
}

export default function PabrikCard({ pabrik, isPabrikAnda = false }: PabrikCardProps) {
    const skorTerbaru = pabrik.laporan[0]?.skor || 'N/A';
    const statusTerbaru = pabrik.laporan[0]?.status || 'N/A';

    return (
        <AccordionItem
            value={pabrik.id}
            className="border border-t border-b border-l-0 border-r-0"
        >
            <AccordionTrigger className='p-0 bg-neutral-20'>
                <div className='grid grid-cols-12 items-center justify-center w-full text-left'>
                    <div className='col-span-4 p-4 font-bold text-sh7 text-neutral-80'>
                        {pabrik.nama}
                    </div>
                    <div className='col-span-1 flex justify-center items-center p-4 border-l text-sh7 text-neutral-80 h-full'>
                        {skorTerbaru}
                    </div>
                    <div className='col-span-2 p-4 border-l flex justify-center h-full'>
                        <Kualitas variant={statusTerbaru}/>
                    </div>
                    <div className='col-span-3 p-4 border-l text-sh7 text-neutral-90 h-full flex justify-center items-center whitespace-nowrap overflow-hidden text-ellipsis'>
                        <p>Lorem Ipsum Dolor Sit Amet</p>
                    </div>
                    <div className='col-span-2 p-4 border-l text-sh7 text-neutral-90 h-full flex justify-center items-center whitespace-nowrap overflow-hidden text-ellipsis'>
                        <p>Lorem Ipsum Dolor Sit Amet</p>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent className='mx-11 border border-neutral-70 rounded-[10px]'>
                <PabrikDetailContent 
                    pabrik={pabrik}
                    histori={pabrik.laporan}
                />
            </AccordionContent>
        </AccordionItem>
    )
}