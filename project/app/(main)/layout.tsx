import Navbar from './components/Navbar'; 
import Image from 'next/image';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Navbar />
      </div>
    {children}
    </div>
  );
}