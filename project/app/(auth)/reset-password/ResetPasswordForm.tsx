'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validation"; // Pastikan path ini benar
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Ikon loading

// Ambil tipe dari schema Zod
type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('');
    
    const token = searchParams.get('token');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        // Validasi token sebelum kirim
        if (!token) {
            setMessage('Token tidak ditemukan. Silakan ulangi proses lupa password.');
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: data.password,
                    token: token // Kirim token bersama password baru
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage(result.message || 'Terjadi kesalahan');
                return;
            }

            setMessage('Berhasil! Mengarahkan ke login...');
            
            // Tunggu sebentar agar user bisa baca pesan sukses
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err) {
            console.error('Error:', err);
            setMessage('Terjadi kesalahan jaringan.');
        }
    }

    return (
        <div className="flex flex-col gap-7 w-fit items-center">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-h4 text-blue-60 font-bold">Buat Password Baru</h1>
                <h1 className="text-b9 text-blue-60 text-center mt-2">
                    Silakan masukkan password baru Anda
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-[300px]">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Input 
                            {...register('password')} 
                            placeholder="Password Baru" 
                            type="password"
                            variant="login" 
                            className="w-full"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>
                    
                    <div className="space-y-1">
                        <Input 
                            {...register('confirmPassword')} 
                            placeholder="Konfirmasi Password" 
                            type="password"
                            variant="login" 
                            className="w-full"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-5">
                    <Button 
                        type="submit" 
                        variant="auth" 
                        className="w-full font-bold text-h7 text-white flex items-center justify-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                    
                    <a href="/login" className="font-bold text-b9 text-blue-base hover:text-yellow-60 duration-300">
                        Kembali ke Login
                    </a>
                </div>
            </form>
            
            {message && (
                <div className={`p-3 rounded-md text-sm text-center ${message.includes('Berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
        </div>
    );
}