// Di file: app/(auth)/register/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validation';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterForm({ onSuccess }: { onSuccess?: () => void}) {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterInput) => {
        try {
            const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setMessage(errorData.message);
                return;
            }

            const result = await res.json();

            setMessage(result.message);
            if (onSuccess) {
                onSuccess();
            }
            router.refresh();
            
        } catch (err) {
            console.error('Error:', err);
            setMessage('Terjadi kesalahan saat registrasi.');
        }
    }

    return (
        <div className="flex">
            <div className="flex justify-center items-center w-full h-screen overflow-y-auto py-10">
                <div className="flex flex-col gap-7 w-fit">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-h4 text-blue-60 font-bold">Buat Akun Admin</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-[350px]">
                        
                        <div className="space-y-2">
                            <Input {...register('nama')} placeholder="Nama" variant="login" className="w-full"/>
                            {errors.nama && <p className="text-red-500 text-sm">{errors.nama.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <Input {...register('email')} placeholder="Email" variant="login" className="w-full"/>
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Select onValueChange={(val) => setValue('tipePabrik', val as any)}>
                                <SelectTrigger className="w-full bg-neutral-40 border border-blue-50 text-neutral-80 h-10 rounded-md">
                                    <SelectValue placeholder="Pilih Tipe Pabrik" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRODUSEN">Produsen</SelectItem>
                                    <SelectItem value="DISTRIBUTOR">Distributor</SelectItem>
                                    <SelectItem value="KONSUMEN">Konsumen</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tipePabrik && <p className="text-red-500 text-sm">{errors.tipePabrik.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Input {...register('lokasi')} placeholder="Lokasi" variant="login" className="w-full"/>
                            {errors.lokasi && <p className="text-red-500 text-sm">{errors.lokasi.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Input {...register('kontak')} placeholder="Kontak" variant="login" className="w-full"/>
                            {errors.kontak && <p className="text-red-500 text-sm">{errors.kontak.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Input {...register('password')} placeholder="Password" type='password' variant="login" className="w-full"/>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <Input {...register('confirmPassword')} placeholder="Confirm Password" type='password' variant="login" className="w-full"/>
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="flex flex-col items-center justify-center gap-5 mt-4">
                            <Button type="submit" variant="auth" className="w-31 font-bold text-h7 text-white">Tambah Pabrik</Button>                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}