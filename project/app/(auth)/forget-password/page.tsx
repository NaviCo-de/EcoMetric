'use client';

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetPasswordSchema, loginSchema } from "@/lib/validation";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm<ForgetPasswordInput>({
        resolver: zodResolver(forgetPasswordSchema)
    });

    const onSubmit = async (data: ForgetPasswordInput) => {
        try {
            const { email } = data;
            const res = await fetch('/api/auth/forget-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json()
                setMessage(errorData.message);
                return;
            }

            const result = await res.json();

            setMessage(result.message);
            
            router.push(`/verify-otp?email=${email}`);
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
                        <h1 className="text-h4 text-blue-60 font-bold">Lupa Password</h1>
                        <h1 className="text-b9 text-blue-60">Masukkan email Anda untuk mendapatkan kode konfirmasi akun</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
                        <div className="flex flex-col gap-2">
                            <div>
                                <Input {...register('email')} placeholder="E-mail"
                                        variant="login" className="w-full"/>
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-5">
                            <Button type="submit" variant="auth" className="w-fit font-bold text-h7 text-white">Kirim ke e-mail</Button>
                            <p className="font-bold text-b9 text-blue-base">Belum Punya Akun? <a href="/register" className="text-yellow-60 hover:text-yellow-70 duration-300">Daftar Disini</a></p>
                        </div>
                    </form>
                    {message && <p className="mt-3 text-center text-red-500">{message}</p>}
                </div>
            </div>

        </div>
    );
}