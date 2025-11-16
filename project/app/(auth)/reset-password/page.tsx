'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validation";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function resetPasswordPage() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        if(!token) {
            setMessage('Token reset tidak ditemukan. Silakan ulangi proses.');
            return;
        }
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                    token: token
                }),
            });

            if (!res.ok) {
                const errorData = await res.json()
                setMessage(errorData.message);
                return;
            }

            const result = await res.json();

            setMessage(result.message);
            
            router.push('/login');
        } catch (err) {
            console.error('Error:', err);
            setMessage('Terjadi kesalahan saat login.');
        }
    }
    return (
        <div className="flex">
            <div className="flex w-1/2 h-screen justify-center items-center bg-linear-to-b from-yellow-30 to-yellow-50">
                <div className="flex justify-center items-center gap-6">
                    <img src="/logo.png" alt="" className="w-19 h-19"/>
                    <h1 className="text-blue-base text-h1 font-bold">EcoMetric</h1>
                </div>
            </div>

            <div className="flex justify-center items-center w-1/2 h-screen">
                <div className="flex flex-col gap-7 w-fit">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-h4 text-blue-60 font-bold">Buat Password Baru</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
                        <div className="flex flex-col gap-2">
                            <div>
                                <Input {...register('password')} placeholder="Password Baru" type="password"
                                        variant="login" className="w-full"/>
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>
                            <div>
                                <Input {...register('confirmPassword')} placeholder="Password" type="password"
                                            variant="login" className="w-full"/>
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-5">
                            <Button type="submit" variant="auth" className="w-29 font-bold text-h7 text-white">Reset</Button>
                            <p className="font-bold text-b9 text-blue-base">Berubah pikiran? <a href="/login" className="text-yellow-60 hover:text-yellow-70 duration-300">Balik ke login</a></p>
                        </div>
                    </form>
                    {message && <p className="mt-3 text-center text-red-500">{message}</p>}
                </div>
            </div>

        </div>
    );
}