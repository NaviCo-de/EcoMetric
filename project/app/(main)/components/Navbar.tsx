'use client';

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
} from "@/components/ui/sheet";
import { logout } from "@/lib/actions";
import { useTransition } from "react";
const navLink = [
    { href: '/dashboard', label: 'Dashboard', imgPathChosen: '/home_chosen.png', imgPathNotChosen: '/home_not_chosen.png'},
    { href: '/buat-laporan', label: 'Buat Laporan', imgPathChosen: '/plus_chosen.png', imgPathNotChosen: '/plus_not_chosen.png'}
]



export default function Navbar() {
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    const handleLogout = () => {
        startTransition(() => {
            logout();
        });
    };

    return (
        <div className="group flex items-center flex-row-reverse mb-3">
            <div className="p-4 bg-white rounded-full shadow-lg cursor-pointer z-10">
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
                {navLink.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'p-4 rounded-2xl transition-all duration-200',
                                {
                                    'bg-blue-base text-white': isActive,
                                    'text-black hover:bg-neutral-20': !isActive
                                }
                            )}
                        >
                            {isActive && 
                                <Image 
                                    src={link.imgPathChosen}
                                    alt={link.label}
                                    width={500}
                                    height={500}
                                    className="w-6 h-6"
                                />
                            }

                            {!isActive &&
                                <Image 
                                    src={link.imgPathNotChosen}
                                    alt={link.label}
                                    width={500}
                                    height={500}
                                    className="w-6 h-6"
                                />
                            }
                        </Link>
                    )
                })}

                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            className={cn(
                                'p-4 rounded-2xl transition-all duration-200',
                                'text-black hover:bg-neutral-20'
                            )}
                        >
                            <Image 
                                src='/setting_not_chosen.png'
                                alt="Setting"
                                width={500}
                                height={500}
                                className="w-6 h-6 shrink-0"
                            />
                        </button>
                    </SheetTrigger>
                    <SheetContent side='right'>
                        <SheetHeader>
                            <SheetTitle className="text-h4 font-semibold text-blue-80">Pengaturan</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col py-4">
                            <div className="px-9 py-4 hover:bg-yellow-10">
                                <div className="flex justify-between items-center">
                                    <p className="text-sh7">Akun Saya</p>
                                    <Image 
                                        src='/profile.png'
                                        alt="Akun"
                                        width={500}
                                        height={500}
                                        className="w-8 h-8"
                                    />
                                </div>
                            </div>

                            <div className="px-9 py-4 hover:bg-yellow-10">

                                <div className="w-full">
                                    <button
                                        onClick={handleLogout}
                                        disabled={isPending}
                                        className="flex justify-between items-center w-full"
                                    >
                                        <p className="text-sh7">{isPending ? 'Keluar...' : 'Keluar'}</p>
                                        <Image 
                                            src='/logout.png'
                                            alt="logout"
                                            width={500}
                                            height={500}
                                            className="w-8 h-8"
                                        />
                                    </button>
                                </div>

                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

            </nav>
        </div>
    )
}