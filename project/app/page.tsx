import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  // Cek apakah ada token
  const cookieStore = cookies();
  const token = (await cookieStore).get('session_token');

  if (token) {
    // Jika ada token, lempar ke dashboard
    redirect('/dashboard');
  } else {
    // Jika tidak ada, lempar ke login
    redirect('/login');
  }
}