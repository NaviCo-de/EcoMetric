'use client';
import { Suspense } from "react";
import { useRouter,  useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema } from "@/lib/validation";
import { z } from "zod";
import { useState } from "react";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export default function VerifyOtpForm() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const searchParams = useSearchParams();
    const email = searchParams.get('email')

    const form = useForm<VerifyOtpInput>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            token: "",
        },
    });

    const onSubmit = async (data: VerifyOtpInput) => {
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    otp: data.token
                }),
            });

            if (!res.ok) {
                const errorData = await res.json()
                setMessage(errorData.message);
                return;
            }

            const result = await res.json();
            const { resetToken } = result;
            setMessage(result.message);
            
            router.push(`/reset-password?token=${resetToken}`); 
        } catch (err) {
            console.error('Error:', err);
            setMessage('Terjadi kesalahan');
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
                        <h1 className="text-h4 text-blue-60 font-bold">Konfirmasi Akun</h1>
                        <h1 className="text-b9 text-blue-60">Masukkan kode yang terkirim pada e-mail Anda</h1>
                    </div>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-12">
                            
                            <FormField
                                control={form.control}
                                name="token"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="flex flex-col items-center justify-center gap-5">
                                <Button type="submit" variant="auth" className="w-29 font-bold text-h7 text-white">Confirm</Button>
                                <p className="font-bold text-b9 text-blue-base">Salah e-mail? <a href="/forget-password" className="text-yellow-60 hover:text-yellow-70 duration-300">Tulis e-mail ulang</a></p>
                            </div>
                        </form>
                    </Form>
                    {message && <p className="mt-3 text-center text-red-500">{message}</p>} 
                </div>
            </div>

        </div>
    );
}