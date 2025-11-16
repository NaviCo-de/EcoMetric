import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import BuatLaporanPage from './BuatLaporan';

type UserPayload = {
    id: string;
    role: 'ADMIN' | 'SUPERADMIN';
    tipePabrik: 'PRODUSEN' | 'DISTRIBUTOR' | 'KONSUMEN';
}

async function getPabrikId() {
    const tokenCookie = (await cookies()).get('session_token')
    if (!tokenCookie) {
        redirect('/login')
    }
    
    const token = tokenCookie.value;
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) throw new Error("JWT_SECRET_KEY kosong!");

    try {
        const payload = jwt.verify(token, SECRET_KEY) as UserPayload
        return payload.id
    } catch (err) {
        console.error("token tidak valid:", err)
        redirect('/login')
    }
}
export default async function LaporanLandingPage() {
    const userId = await getPabrikId()
    
    return (
        <div>
            <BuatLaporanPage userId={userId} />
        </div>
  );
}