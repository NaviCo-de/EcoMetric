// Di file: app/(main)/components/Navbar.tsx

'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";


import { Link as LinkIcon, Plus, X } from 'lucide-react'; 

// Impor Form Anda
import RegisterForm from "../superadmin/components/RegisterForm";
import BuatRantaiForm from "../superadmin/components/BuatRantaiForm";

import { logout } from "@/lib/actions";
import { useTransition } from "react";

interface NavbarProps {
    role: 'ADMIN' | 'SUPERADMIN'
}

export default function Navbar({ role }: NavbarProps) {
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    
    // State untuk Modal
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isChainOpen, setIsChainOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleLogout = () => {
        startTransition(() => {
            logout();
        });
    };

    const TooltipText = ({ text }: { text: string }) => (
        <span className="absolute top-15 left-1/2 -translate-x-1/2 bg-neutral-80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {text}
        </span>
    );

    return (
        <div className="group flex items-center flex-row-reverse mb-3">

            <div className="p-4 bg-white rounded-full shadow-lg cursor-pointer z-10 hover:scale-110 transition-transform duration-200">
                <Image 
                    src='/profile_picture.png'
                    alt='Profile'
                    width={500}
                    height={500}
                    className="w-6 h-6"
                />
            </div>


            <nav
                className={cn(
                    "flex items-center gap-4 p-4 bg-white rounded-full shadow-lg",
                    "opacity-0 scale-90 translate-x-4",
                    "group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0",
                    "pointer-events-none group-hover:pointer-events-auto",
                    "transition-all duration-200 ease-in-out",
                    "mr-2"
                )}
            >

                <div className="relative group/item">
                    <Link
                        href={role === 'SUPERADMIN' ? '/superadmin' : '/dashboard'}
                        className={cn(
                            'flex items-center justify-center p-4 rounded-2xl transition-all duration-200',
                            pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin') 
                                ? 'bg-blue-base' 
                                : 'hover:bg-neutral-20'
                        )}
                    >

                         {(pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin')) ? (
                            <Image src='/home_chosen.png' alt='Dashboard' width={24} height={24} className="w-6 h-6" />
                         ) : (
                            <Image src='/home_not_chosen.png' alt='Dashboard' width={24} height={24} className="w-6 h-6" />
                         )}
                    </Link>
                    <TooltipText text="Dashboard" />
                </div>


                {role === 'ADMIN' && (
                    <div className="relative group/item">
                        <Link
                            href='/buat-laporan'
                            className={cn(
                                'flex items-center justify-center p-4 rounded-2xl transition-all duration-200',
                                pathname === '/buat-laporan' ? 'bg-blue-base' : 'hover:bg-neutral-20'
                            )}
                        >
                             {pathname === '/buat-laporan' ? (
                                <Image src='/plus_chosen.png' alt='Buat Laporan' width={24} height={24} className="w-6 h-6" />
                             ) : (
                                <Image src='/plus_not_chosen.png' alt='Buat Laporan' width={24} height={24} className="w-6 h-6" />
                             )}
                        </Link>
                        <TooltipText text="Buat Laporan" />
                    </div>
                )}


                {role === 'SUPERADMIN' && (
                    <>
                        <div className="relative group/item">
                            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                                <DialogTrigger asChild>
                                    <button className="p-4 rounded-2xl transition-all duration-200 text-black hover:bg-neutral-20">
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader><DialogTitle>Registrasi Pabrik Baru</DialogTitle></DialogHeader>
                                    <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
                                </DialogContent>
                            </Dialog>
                            <TooltipText text="Tambah Pabrik" />
                        </div>

                        <div className="relative group/item">
                            <Dialog open={isChainOpen} onOpenChange={setIsChainOpen}>
                                <DialogTrigger asChild>
                                    <button className="p-4 rounded-2xl transition-all duration-200 text-black hover:bg-neutral-20">
                                        {/* Ikon Rantai */}
                                        <LinkIcon className="w-6 h-6" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader><DialogTitle>Buat Rantai Pasok</DialogTitle></DialogHeader>
                                    <BuatRantaiForm onSuccess={() => setIsChainOpen(false)} />
                                </DialogContent>
                            </Dialog>
                            <TooltipText text="Buat Rantai" />
                        </div>
                    </>
                )}

                <div className="relative group/item">
                    <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                        <SheetTrigger asChild>
                            <button
                                className={cn(
                                    'p-4 rounded-2xl transition-all duration-200',
                                    'text-black hover:bg-neutral-20',
                                    isSettingsOpen ? 'bg-blue-base text-white' : '' // Opsional: Highlight saat terbuka
                                )}
                            >
                                <Image 
                                    src='/setting_not_chosen.png'
                                    alt="Setting"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 shrink-0"
                                />
                            </button>
                        </SheetTrigger>
                        
                        <SheetContent side='right'>
                            <SheetHeader>
                                <SheetTitle className="text-h4 font-semibold text-blue-80 text-center">Pengaturan</SheetTitle>
                            </SheetHeader>
                            
                            <div className="flex flex-col py-4 mt-4">
                                <div className="px-4 py-3 hover:bg-yellow-10 rounded-md cursor-pointer transition-colors">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sh7 font-medium">Akun Saya</p>
                                        <Image 
                                            src='/profile.png'
                                            alt="Akun"
                                            width={24}
                                            height={24}
                                            className="w-6 h-6"
                                        />
                                    </div>
                                </div>

                                <div className="px-4 py-3 hover:bg-yellow-10 rounded-md cursor-pointer transition-colors mt-2">
                                    <button
                                        onClick={handleLogout}
                                        disabled={isPending}
                                        className="flex justify-between items-center w-full"
                                    >
                                        <p className="text-sh7 font-medium text-red-600">
                                            {isPending ? 'Keluar...' : 'Keluar'}
                                        </p>
                                        <Image 
                                            src='/logout.png'
                                            alt="logout"
                                            width={24}
                                            height={24}
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <TooltipText text="Pengaturan" />
                </div>

            </nav>
        </div>
    )
}