// Di file: app/(main)/superadmin/page.tsx

import prisma from "@/lib/prisma";
import type { Admin, Laporan } from "@prisma/client"; // Impor Tipe

// 1. Impor Komponen Klien yang akan menampilkan UI
import SuperAdminClientUI from "./components/SuperAdminClientUI";

// 2. Definisikan tipe data yang akan kita oper
// (Ini harus cocok dengan tipe di skema Prisma Anda)
type PabrikWithLaporan = Admin & {
  laporan: Laporan[];
  deskripsi?: string | null;
  lokasiKontak?: string | null;
};

/**
 * 3. Fungsi ini berjalan di server untuk mengambil semua data pabrik.
 * Tidak perlu logika search di sini, kita ambil semua.
 */
async function getAllPabrik() {
  const allPabrik = await prisma.admin.findMany({
    where: {
      role: "ADMIN", // Hanya ambil Admin, bukan Superadmin lain
    },
    include: {
      laporan: {
        orderBy: { createdAt: "desc" },
        take: 5, // Ambil 5 laporan (untuk detail) & 1 (untuk skor terbaru)
      },
      // Pastikan Anda sudah 'migrate' skema untuk 'deskripsi' dan 'lokasiKontak'
    },
  });

  // Filter menjadi 3 list berdasarkan tipe pabrik
  const produsenList = allPabrik.filter((p) => p.tipePabrik === "PRODUSEN");
  const distributorList = allPabrik.filter(
    (p) => p.tipePabrik === "DISTRIBUTOR"
  );
  const konsumenList = allPabrik.filter((p) => p.tipePabrik === "KONSUMEN");

  // Pastikan tipe datanya cocok saat dikirim
  return {
    produsenList: produsenList as PabrikWithLaporan[],
    distributorList: distributorList as PabrikWithLaporan[],
    konsumenList: konsumenList as PabrikWithLaporan[],
  };
}

/**
 * 4. Ini adalah Halaman Server Anda
 */
export default async function SuperAdminPage() {
  // 5. Ambil semua data dari server saat halaman di-load
  const { produsenList, distributorList, konsumenList } = await getAllPabrik();

  // 6. Render Komponen Klien dan 'oper' semua datanya sebagai props
  //    Komponen Klien yang akan menangani state (search) dan UI (Tabs)
  return (
    <SuperAdminClientUI
      produsenList={produsenList}
      distributorList={distributorList}
      konsumenList={konsumenList}
    />
  );
}
