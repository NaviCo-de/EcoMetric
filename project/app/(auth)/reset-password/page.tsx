import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm"; // Impor form yang baru dibuat

export default function ResetPasswordPage() {
    return (
        // Layout kuning & putih sudah diatur oleh (auth)/layout.tsx
        // Di sini kita hanya mengatur konten sisi kanan (putih)
        
        <div className="flex justify-center items-center w-full h-full">
            {/* Suspense wajib ada karena ResetPasswordForm menggunakan useSearchParams */}
            <Suspense fallback={<div className="text-blue-60">Memuat form...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}