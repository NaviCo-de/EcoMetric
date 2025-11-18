'use client';

import { useState } from 'react';
import type { Admin, Laporan } from '@prisma/client';
import { Accordion } from "@/components/ui/accordion";
import PabrikCard from '../../dashboard/components/PabrikCard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RegisterForm from './RegisterForm';

type PabrikWithLaporan = Admin & {
  laporan: Laporan[];
  deskripsi?: string | null;
  lokasiKontak?: string | null;
}

type SuperAdminClientUIProps = {
  produsenList: PabrikWithLaporan[];
  distributorList: PabrikWithLaporan[];
  konsumenList: PabrikWithLaporan[];
};

export default function SuperAdminClientUI({ 
  produsenList, 
  distributorList, 
  konsumenList 
}: SuperAdminClientUIProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const renderPabrikList = (list: PabrikWithLaporan[]) => {
    const filteredList = list.filter(pabrik =>
      pabrik.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Accordion type="single" collapsible className="w-full">
        {filteredList.length > 0 ? (
          filteredList.map(pabrik => (
            <PabrikCard 
              key={pabrik.id}
              pabrik={pabrik}
              isPabrikAnda={true} 
            />
          ))
        ) : (
          <p className="text-neutral-500 p-4 bg-white rounded-lg shadow-sm border text-center">
            Tidak ada pabrik yang cocok.
          </p>
        )}
      </Accordion>
    );
  };

  return (
    <div className="w-full relative">
      <Tabs defaultValue="produsen" className="w-full flex flex-col">
        <div className="flex flex-col justify-between items-center mb-4 gap-7">
          <TabsList>
            <TabsTrigger value="produsen" className='text-neutral-70 text-b6'>Produsen</TabsTrigger>
            <TabsTrigger value="distributor" className='text-neutral-70 text-b6'>Distributor</TabsTrigger>
            <TabsTrigger value="konsumen" className='text-neutral-70 text-b6'>Konsumen</TabsTrigger>
          </TabsList>
          
          <div className="w-full flex justify-center items-center">
            <Input 
              placeholder="Cari Pabrik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-20 border border-blue-20 text-blue-40 text-b9 placeholder:text-blue-40 w-166 h-8 rounded-2xl"
            />
          </div>
        </div>

        <div className='grid grid-cols-12 items-center w-full text-left pl-10 py-4 pr-4 bg-yellow-40 border border-yellow-base font-bold text-sh8 text-neutral-90 h-full'>
          <div className='col-span-4'>Nama Perusahaan</div>
          <div className='col-span-1 border-l border-yellow-base text-center'>Score</div>
          <div className='col-span-2 border-l border-yellow-base text-center'>Flag</div>
          <div className='col-span-3 border-l border-yellow-base text-center'>Deskripsi</div>
          <div className='col-span-2 border-l border-yellow-base text-center'>Lokasi</div>
        </div>

        <TabsContent value="produsen">
          {renderPabrikList(produsenList)}
        </TabsContent>

        <TabsContent value="distributor">
          {renderPabrikList(distributorList)}
        </TabsContent>

        <TabsContent value="konsumen">
          {renderPabrikList(konsumenList)}
        </TabsContent>
      </Tabs>
    </div>
  );
}