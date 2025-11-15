import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import { cookies } from 'next/headers'; // Import cookies (Server-side)
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

type UserPayload = {
    id: string;
    role: 'ADMIN' | 'SUPERADMIN'
}

async function getUserRole() {
    const tokenCookie = (await cookies()).get('session_token')

    if (!tokenCookie) {
        redirect('/login')
    }

    const token = tokenCookie.value;
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) throw new Error("JWT_SECRET_KEY kosong!");

    try {
        const payload = jwt.verify(token, SECRET_KEY) as UserPayload
        return payload.role
    } catch (err) {
        console.error("token tidak valid:", err)
        redirect('/login')
    }
}

export default async function DashboardPage() {
    const role = await getUserRole();

    if (role === 'ADMIN') {
        return <AdminDashboard />
    }

    if (role === 'SUPERADMIN') {
        return <SuperAdminDashboard />;
    }

    return <div>Role tidak dikenali.</div>;
}