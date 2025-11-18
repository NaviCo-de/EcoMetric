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
import { cn } from '@/lib/utils';

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
    if (isPabrikAnda) {

        return (
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6'>
                <div className='md:col-span-1'>
                    <h3 className='text-h7 text-neutral-90 font-semibold'>Histori</h3>
                    <div>
                        {histori.length > 0 ? (
                            histori.map((laporan, index) => {
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
                                        className={cn(
                                            "grid grid-cols-4 gap-2 items-center text-sm p-2",
                                            index % 2 === 0 ? "bg-blue-new" : "bg-neutral-20" 
                                        )}
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
                    <h3 className='text-h7 text-neutral-90 font-semibold'>Rata-rata Kualitas</h3>
                    <h3 className='text-h5 text-neutral-90 font-bold'>{skorRataRata}</h3>
                    <Kualitas 
                        variant={statusRataRata}
                    />
                </div>
    
                <div className='md:col-span-1 border-neutral-base border-l px-7'>
                    <h3 className='text-h7 text-neutral-90 font-semibold text-center mb-2'>Deskripsi Selengkapnya</h3>
                    <h3 className='text-h9 text-neutral-90'>{pabrik.laporan[0] ? pabrik.laporan[0].deskripsiAI : "Belum ada deskripsi"}</h3>
                </div>
    
                <div className='md:col-span-1 border-neutral-base border-l px-7'>
                    <h3 className='text-h7 text-neutral-90 font-semibold text-center mb-2'>Lokasi & Kontak</h3>
                    <h3 className='text-h9 text-neutral-90'>Lokasi: {pabrik.lokasi}</h3>
                    <h3 className='text-h9 text-neutral-90'>Kontak: {pabrik.kontak}</h3>
                </div>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 gap-6 p-6'>
            <div className='col-span-1'>
                <h3 className='text-h7 text-neutral-90 font-semibold'>Histori</h3>
                <div>
                    {histori.length > 0 ? (
                        histori.map((laporan, index) => {
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
                                    className={cn(
                                        "grid grid-cols-4 gap-2 items-center text-sm p-2",
                                        index % 2 === 0 ? "bg-blue-new" : "bg-neutral-20" 
                                    )}
                                >
                                    <span className="text-neutral-90">
                                        {waktuRelatif}
                                    </span>
                                    <span className="text-neutral-90 font-medium">{laporan.skor}</span>
                                    <Kualitas 
                                        variant={laporan.status}
                                        className=''
                                    />
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-sm text-neutral-500">Belum ada histori laporan.</p>
                    )}
                </div>
            </div>

            <div className='col-span-1 flex flex-col items-center justify-center border-neutral-base border-l'>
                <h3 className='text-h7 text-neutral-90 font-semibold'>Rata-rata Kualitas</h3>
                <h3 className='text-h5 text-neutral-90 font-bold'>{skorRataRata}</h3>
                <Kualitas 
                    variant={statusRataRata}
                />
            </div>
        </div>
    );
}

export default function PabrikCard({ pabrik, isPabrikAnda }: PabrikCardProps) {
    const skorTerbaru = pabrik.laporan[0]?.skor || 'N/A';
    const statusTerbaru = pabrik.laporan[0]?.status || 'N/A';

    return (
        <AccordionItem
            value={pabrik.id}
            className="border border-t border-b data-[state=open]:border-b-0 border-l-0 border-r-0"
        >
            <AccordionTrigger className='bg-neutral-20'>
                {isPabrikAnda ? (

                    <div className='grid grid-cols-12 items-center justify-center w-full text-left'>
                        <div className='col-span-4 px-4 font-bold text-sh7 text-neutral-80'>
                            {pabrik.nama}
                        </div>
                        <div className='col-span-1 flex justify-center items-center px-4 border-l text-sh7 text-neutral-80 h-full'>
                            {skorTerbaru}
                        </div>
                        <div className='col-span-2 px-4 border-l flex justify-center h-full'>
                            <Kualitas variant={statusTerbaru}/>
                        </div>
                        <div className='col-span-3 px-4 border-l text-sh7 text-neutral-90 h-full items-center whitespace-nowrap overflow-hidden text-ellipsis'>
                            {pabrik.laporan[0] ? pabrik.laporan[0].deskripsiAI : "Belum ada deskripsi"}
                        </div>
                        <div className='col-span-2 px-4 border-l text-sh7 text-neutral-90 h-full items-center whitespace-nowrap overflow-hidden text-ellipsis'>
                            {pabrik.lokasi}
                        </div>
                    </div> ): (
                        <div className='flex justify-between items-center w-full px-4'>
                            <div className='font-bold text-sh7 text-neutral-80'>
                                {pabrik.nama}
                            </div>
                            <div className='flex items-center gap-4'>
                                <span className='text-sh7 text-neutral-80 h-full'>
                                    {skorTerbaru}
                                </span>
                                {statusTerbaru && (
                                    <Kualitas variant={statusTerbaru}/>
                                )}
                            </div>
                        </div>
                    )
                }
            </AccordionTrigger>

            <AccordionContent className='mx-11 mb-3 border border-neutral-70 rounded-[10px]'>
                <PabrikDetailContent 
                    pabrik={pabrik}
                    histori={pabrik.laporan}
                    isPabrikAnda={isPabrikAnda}
                />
            </AccordionContent>
        </AccordionItem>
    )
}