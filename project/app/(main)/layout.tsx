import Navbar from './components/Navbar'; 
import Image from 'next/image';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

type UserPayload = {
    id: string;
    role: 'ADMIN' | 'SUPERADMIN';
    tipePabrik: 'PRODUSEN' | 'DISTRIBUTOR' | 'KONSUMEN';
}

async function getUserRole() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('session_token');

    if (!tokenCookie) return null;

    try {
        const SECRET_KEY = process.env.JWT_SECRET_KEY;
        if (!SECRET_KEY) throw new Error("JWT_SECRET_KEY kosong");

        const payload = jwt.verify(tokenCookie.value, SECRET_KEY) as UserPayload;
        return payload.role;
    } catch (error) {
        console.error("Token error:", error);
        return null;
    }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  if (!role) {
      redirect('/login');
  }

  return (
    <div className='mx-20 my-4'>
      <div className="flex justify-between items-center">
        <Image 
            src="/logo.png"
            alt='Logo'
            width={500}
            height={500}
            className='w-10 h-10'
        />
        
        <Navbar role={role} />
        
      </div>
      {children}
    </div>
  );
}