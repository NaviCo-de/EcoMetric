'use client';
import { useRouter, redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EQSSchema } from '@/lib/validation';
import type { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type EQSInput = z.infer<typeof EQSSchema>;

export default function BuatLaporanPage({ userId }: { userId: string }) {
    const [message, setMessage] = useState('0');
    const { register, handleSubmit } = useForm<EQSInput>({
        resolver: zodResolver(EQSSchema),
    });

    const onSubmit = async (data: EQSInput) => {
        try {
            const res = await fetch("http://localhost:3000/api/main/buat-laporan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await res.json();
            setMessage(result.EQS || result.detail);
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className='flex flex-col items-center gap-15'>
            <h1 className='text-h3 text-blue-90 font-bold'>Buat Laporan</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center justify-center gap-15 w-full'>
                <div className='flex justify-evenly w-full'>
                    <div className='flex flex-col gap-6'>
                        <h2 className='text-sh6 font-semibold'>Kualitas Tanah</h2>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <Label>Nitrogen (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.N', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Fosfor (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.P', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Kalium (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.K', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>pH tanah</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.ph', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Electrical Conductivity</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.EC', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Sulfur (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.S', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Tembaga (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.Cu', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Besi (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.Fe', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Mangan (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.Mn', { valueAsNumber: true })} />
                            </div>
                            
                            <div className='flex flex-col gap-1'>
                                <Label>Seng (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.Zn', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Boron (mg/kg)</Label>
                                <Input variant='data' type="number" step="any" {...register('soil.B', { valueAsNumber: true })} />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <h2 className='text-sh6 font-semibold'>Kualitas Air</h2>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <Label>Suhu air (°C)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Temp', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Kekeruhan (cm)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Turbidity_cm', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Dissolved Oxygen (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.DO_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Biological Oxygen Demand (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.BOD_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Konsentrasi karbon dioksida (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.CO2', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>pH air</Label>
                                <Input variant='data' type="number" step="any" {...register('water.pH', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Alkalinitas (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Alkalinity_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Kesadahan (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Hardness_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Kandungan kalsium (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Calcium_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Amonia (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Ammonia_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Nitrit (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Nitrite_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Fosfor (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Phosphorus_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Hidrogen sulfida (mg/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.H2S_mg_L', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Jumlah plankton (No/L)</Label>
                                <Input variant='data' type="number" step="any" {...register('water.Plankton_No_L', { valueAsNumber: true })} />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <h2 className='text-sh6 font-semibold'>Kualitas Udara</h2>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <Label>Konsentrasi karbon monoksida (mg/m³)</Label>
                                <Input variant='data' type="number" step="any" {...register('air.CO_GT', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Konsentrasi nitrogen dioksida (μg/m³)</Label>
                                <Input variant='data' type="number" step="any" {...register('air.NO2_GT', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Sensor ozon PT08 (resistansi)</Label>
                                <Input variant='data' type="number" step="any" {...register('air.PT08_S5_O3', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Suhu udara (°C)</Label>
                                <Input variant='data' type="number" step="any" {...register('air.T', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Kelembapan relatif (%)</Label>
                                <Input variant='data' type="number" step="any" {...register('air.RH', { valueAsNumber: true })} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label>Absolute humidity</Label>
                                <Input variant='data' type="number" step="any" {...register('air.AH', { valueAsNumber: true })} />
                            </div>
                        </div>
                    </div>
                </div>
                <Button type="submit" variant="auth" className="w-29 font-bold text-h7 text-white">Kirim</Button>
            </form>
        </div>
  );
}