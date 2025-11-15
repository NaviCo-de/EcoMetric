'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EQSSchema } from '@/lib/validation';
import type { z } from 'zod';
import { useState } from 'react';

type EQSInput = z.infer<typeof EQSSchema>;

export default function AiModelPage() {
    const [message, setMessage] = useState('0');
    const { register, handleSubmit } = useForm<EQSInput>({
        resolver: zodResolver(EQSSchema),
    });

    const onSubmit = async (data: EQSInput) => {
        try {
            const res = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                headers: { "COntent-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await res.json();
            setMessage(result.EQS || result.detail);
        } catch (err) {

        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Air Data</h2>
                <input type="number" step="any" {...register('air.CO_GT', { valueAsNumber: true })} placeholder='CO_GT'/>
                <input type="number" step="any" {...register('air.NO2_GT', { valueAsNumber: true })} placeholder='NO2_GT'/>
                <input type="number" step="any" {...register('air.PT08_S5_O3', { valueAsNumber: true })} placeholder='PT08_S5_03'/>
                <input type="number" step="any" {...register('air.T', { valueAsNumber: true })} placeholder='T'/>
                <input type="number" step="any" {...register('air.RH', { valueAsNumber: true })} placeholder='RH'/>
                <input type="number" step="any" {...register('air.AH', { valueAsNumber: true })} placeholder='AH'/>

                <h2>Water Data</h2>
                <input type="number" step="any" {...register('water.Temp', { valueAsNumber: true })} placeholder='Temp'/>
                <input type="number" step="any" {...register('water.Turbidity_cm', { valueAsNumber: true })} placeholder='Turbidity_cm'/>
                <input type="number" step="any" {...register('water.DO_mg_L', { valueAsNumber: true })} placeholder='DO_mg_L'/>
                <input type="number" step="any" {...register('water.BOD_mg_L', { valueAsNumber: true })} placeholder='BOD_mg_L'/>
                <input type="number" step="any" {...register('water.CO2', { valueAsNumber: true })} placeholder='CO2'/>
                <input type="number" step="any" {...register('water.pH', { valueAsNumber: true })} placeholder='pH'/>
                <input type="number" step="any" {...register('water.Alkalinity_mg_L', { valueAsNumber: true })} placeholder='Ahalinity_mg_L'/>
                <input type="number" step="any" {...register('water.Hardness_mg_L', { valueAsNumber: true })} placeholder='Hardness_mg_L'/>
                <input type="number" step="any" {...register('water.Calcium_mg_L', { valueAsNumber: true })} placeholder='Calcium_mg_L'/>
                <input type="number" step="any" {...register('water.Ammonia_mg_L', { valueAsNumber: true })} placeholder='Ammonia_mg_L'/>
                <input type="number" step="any" {...register('water.Nitrite_mg_L', { valueAsNumber: true })} placeholder='Nitrite_mg_L'/>
                <input type="number" step="any" {...register('water.Phosphorus_mg_L', { valueAsNumber: true })} placeholder='Phosphorus_mg_L'/>
                <input type="number" step="any" {...register('water.H2S_mg_L', { valueAsNumber: true })} placeholder='H2S_mg_L'/>
                <input type="number" step="any" {...register('water.Plankton_No_L', { valueAsNumber: true })} placeholder='Plankton_No_L'/>

                <h2>Soil Data</h2>
                <input type="number" step="any" {...register('soil.N', { valueAsNumber: true })} placeholder='N'/>
                <input type="number" step="any" {...register('soil.P', { valueAsNumber: true })} placeholder='P'/>
                <input type="number" step="any" {...register('soil.K', { valueAsNumber: true })} placeholder='K'/>
                <input type="number" step="any" {...register('soil.ph', { valueAsNumber: true })} placeholder='ph'/>
                <input type="number" step="any" {...register('soil.EC', { valueAsNumber: true })} placeholder='EC'/>
                <input type="number" step="any" {...register('soil.S', { valueAsNumber: true })} placeholder='S'/>
                <input type="number" step="any" {...register('soil.Cu', { valueAsNumber: true })} placeholder='Cu'/>
                <input type="number" step="any" {...register('soil.Fe', { valueAsNumber: true })} placeholder='Fe'/>
                <input type="number" step="any" {...register('soil.Mn', { valueAsNumber: true })} placeholder='Mn'/>
                <input type="number" step="any" {...register('soil.Zn', { valueAsNumber: true })} placeholder='Zn'/>
                <input type="number" step="any" {...register('soil.B', { valueAsNumber: true })} placeholder='B'/>

                <button type="submit" className='border-amber-400 border-2'>Submit</button>
            </form>
            <p className="mt-3 text-center">EQS: {message}</p>
        </div>
  );
}