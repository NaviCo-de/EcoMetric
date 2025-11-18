// Di file: app/(main)/superadmin/components/BuatRantaiForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { getAvailablePabriks, type PabrikAvailable } from '@/lib/actions';

export default function BuatRantaiForm({ onSuccess }: { onSuccess: () => void }) {
    const router = useRouter();
    

    const [listProdusen, setListProdusen] = useState<PabrikAvailable[]>([]);
    const [listDistributor, setListDistributor] = useState<PabrikAvailable[]>([]);
    const [listKonsumen, setListKonsumen] = useState<PabrikAvailable[]>([]);


    const [selectedProdusen, setSelectedProdusen] = useState('');
    const [selectedDistributor, setSelectedDistributor] = useState('');
    const [selectedKonsumen, setSelectedKonsumen] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 1. Fetch data saat komponen muncul (mount)
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAvailablePabriks();
            setListProdusen(data.produsen);
            setListDistributor(data.distributor);
            setListKonsumen(data.konsumen);
        };
        fetchData();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validasi sederhana
        if (!selectedProdusen || !selectedDistributor || !selectedKonsumen) {
            setError("Harap pilih semua pihak (Produsen, Distributor, dan Konsumen).");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/main/rantai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    produsenId: selectedProdusen,
                    distributorId: selectedDistributor,
                    konsumenId: selectedKonsumen
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Gagal membuat rantai");
            }

            router.refresh();
            onSuccess();
            
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Terjadi kesalahan server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label>Pilih Produsen</Label>
                <Select onValueChange={setSelectedProdusen} value={selectedProdusen}>
                    <SelectTrigger className="w-full bg-white border border-gray-300">
                        <SelectValue placeholder="Pilih Produsen..." />
                    </SelectTrigger>
                    <SelectContent>
                        {listProdusen.length > 0 ? (
                            listProdusen.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.nama}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-2 text-sm text-gray-500">Tidak ada produsen tersedia</div>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Pilih Distributor</Label>
                <Select onValueChange={setSelectedDistributor} value={selectedDistributor}>
                    <SelectTrigger className="w-full bg-white border border-gray-300">
                        <SelectValue placeholder="Pilih Distributor..." />
                    </SelectTrigger>
                    <SelectContent>
                        {listDistributor.length > 0 ? (
                            listDistributor.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    {d.nama}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-2 text-sm text-gray-500">Tidak ada distributor tersedia</div>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Pilih Konsumen</Label>
                <Select onValueChange={setSelectedKonsumen} value={selectedKonsumen}>
                    <SelectTrigger className="w-full bg-white border border-gray-300">
                        <SelectValue placeholder="Pilih Konsumen..." />
                    </SelectTrigger>
                    <SelectContent>
                        {listKonsumen.length > 0 ? (
                            listKonsumen.map((k) => (
                                <SelectItem key={k.id} value={k.id}>
                                    {k.nama}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-2 text-sm text-gray-500">Tidak ada konsumen tersedia</div>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="pt-4">
                <Button 
                    type="submit" 
                    variant="auth"
                    className="w-full bg-blue-base hover:bg-blue-70 text-white"
                    disabled={loading}
                >
                    {loading ? 'Memproses...' : 'Buat Rantai Pasok'}
                </Button>
            </div>
        </form>
    );
}