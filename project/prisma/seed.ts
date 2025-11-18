// Di file: prisma/seed.ts

import { PrismaClient, TipePabrik, Role, Kualitas } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Fungsi helper untuk membuat tanggal di masa lalu
function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log('Memulai proses seeding...');

  // 1. Hapus data lama (sesuai urutan dependensi)
  await prisma.passwordResetToken.deleteMany({});
  await prisma.laporan.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.rantai.deleteMany({});
  
  // 2. Buat password
  const passwordProdusen = await bcrypt.hash('password123', 10);
  const passwordDistributor = await bcrypt.hash('password123', 10);
  const passwordKonsumen = await bcrypt.hash('password123', 10);
  const passwordSuperAdmin = await bcrypt.hash('superadmin123', 10);

  // 3. Buat Rantai & 3 Admin Pabrik
  const rantaiUtama = await prisma.rantai.create({
    data: {
      nama: 'Rantai Pasok Utama',
      members: {
        create: [
          {
            email: 'produsen@email.com',
            nama: 'Pabrik Produsen A',
            password: passwordProdusen,
            role: Role.ADMIN,
            tipePabrik: TipePabrik.PRODUSEN,
            lokasi: 'Jl. Industri No. 1, Jakarta',
            kontak: '0812-1111-1111',

          },
          {
            email: 'distributor@email.com',
            nama: 'Pabrik Distributor B',
            password: passwordDistributor,
            role: Role.ADMIN,
            tipePabrik: TipePabrik.DISTRIBUTOR,
            lokasi: 'Jl. Logistik No. 2, Bandung',
            kontak: '0812-2222-2222',

          },
          {
            email: 'konsumen@email.com',
            nama: 'Pabrik Konsumen C',
            password: passwordKonsumen,
            role: Role.ADMIN,
            tipePabrik: TipePabrik.KONSUMEN,
            lokasi: 'Jl. Konsumsi No. 3, Surabaya',
            kontak: '0812-3333-3333',

          },
        ],
      },
    },
    include: {
      members: true, // Ambil 'members' agar kita dapat ID-nya
    },
  });

  // 4. Buat Super Admin (Terpisah)
  const superAdmin = await prisma.admin.create({
    data: {
      email: 'superadmin@email.com',
      nama: 'Super Admin',
      password: passwordSuperAdmin,
      role: Role.SUPERADMIN,
      tipePabrik: TipePabrik.PRODUSEN, // Default (tidak terlalu penting untuk Super Admin)
      lokasi: 'Kantor Pusat',
      kontak: '0812-9999-9999',
    }
  });

  console.log('Admin dan Rantai berhasil dibuat.');
  console.log('--- MEMBUAT LAPORAN ---');

  // 5. Ambil ID Admin yang baru dibuat
  const produsenId = rantaiUtama.members.find(m => m.tipePabrik === 'PRODUSEN')!.id;
  const distributorId = rantaiUtama.members.find(m => m.tipePabrik === 'DISTRIBUTOR')!.id;
  const konsumenId = rantaiUtama.members.find(m => m.tipePabrik === 'KONSUMEN')!.id;
  const superAdminId = superAdmin.id;

  // 6. Buat Laporan untuk PRODUSEN
  await prisma.laporan.createMany({
    data: [
      {
        skor: 92,
        deskripsiAI: "Kualitas lingkungan sangat baik.",
        status: Kualitas.GOOD,

        pabrikId: produsenId,
        createdAt: daysAgo(1) // Kemarin
      },
      {
        skor: 88,
        deskripsiAI: "Kualitas masih baik, sedikit penurunan.",
        status: Kualitas.GOOD,

        pabrikId: produsenId,
        createdAt: daysAgo(5) // 5 hari lalu
      },
    ]
  });

  // 7. Buat Laporan untuk DISTRIBUTOR
  await prisma.laporan.createMany({
    data: [
      {
        skor: 65,
        deskripsiAI: "Kualitas sedang, perlu monitoring.",
        status: Kualitas.MODERATE,

        pabrikId: distributorId,
        createdAt: daysAgo(0) // Hari ini
      },
      {
        skor: 75,
        deskripsiAI: "Kualitas lebih baik 5 hari lalu.",
        status: Kualitas.GOOD,

        pabrikId: distributorId,
        createdAt: daysAgo(7) // 1 minggu lalu
      },
    ]
  });

  // 8. Buat Laporan untuk KONSUMEN
  await prisma.laporan.createMany({
    data: [
      {
        skor: 30,
        deskripsiAI: "Kualitas buruk. Perlu perbaikan serius.",
        status: Kualitas.POOR,
        
        pabrikId: konsumenId,
        createdAt: daysAgo(2) // 2 hari lalu
      },
    ]
  });

  // 9. Buat Laporan untuk SUPER ADMIN
  await prisma.laporan.createMany({
    data: [
      {
        skor: 99,
        deskripsiAI: "Laporan dari Super Admin.",
        status: Kualitas.GOOD,

        pabrikId: superAdminId,
        createdAt: daysAgo(0) // Hari ini
      },
    ]
  });

  console.log('Seeding selesai. Laporan berhasil dibuat.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });