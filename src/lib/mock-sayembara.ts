import type { AdCategory, AdStatus } from "@/lib/types";

export function getSayembaraById(id: string): Sayembara | undefined {
  return mockSayembara.find((item) => item.id === id);
}

export interface SayembaraApplicant {
  name: string;
  contact: string;
  appliedAt: string;
}

export interface Sayembara {
  id: string;
  title: string;
  description: string;
  category: AdCategory;
  location: string;
  status: AdStatus;
  postedAt: string;
  ownerName: string;
  applicantCount: number;
  applicants: SayembaraApplicant[];
}

export const mockSayembara: Sayembara[] = [
  {
    id: "sy-001",
    title: "Butuh Bantuan Pindahan Kos Akhir Bulan",
    description:
      "Cari 2 orang untuk bantu angkut barang dari Hay Asyir ke Nasr City. Barang tidak terlalu banyak, estimasi 2-3 jam. Ongkos nego di tempat.",
    category: "Bantuan & Layanan Harian",
    location: "Hay Asyir, Kairo",
    status: "Aktif",
    postedAt: "3 jam lalu",
    ownerName: "Dimas Prakoso",
    applicantCount: 2,
    applicants: [
      { name: "Budi Santoso", contact: "20 12 3456 7890", appliedAt: "2 jam lalu" },
      { name: "Rian Firmansyah", contact: "20 11 2233 4455", appliedAt: "1 jam lalu" },
    ],
  },
  {
    id: "sy-002",
    title: "Cari Tutor Bahasa Arab untuk Ujian Masuk",
    description:
      "Butuh tutor Bahasa Arab intensif selama 2 minggu untuk persiapan ujian masuk fakultas. Lebih disukai yang berpengalaman mengajar mahasiswa baru.",
    category: "Pendidikan",
    location: "Online",
    status: "Aktif",
    postedAt: "1 hari lalu",
    ownerName: "Nadia Ayu",
    applicantCount: 4,
    applicants: [
      { name: "Hasan Albana", contact: "20 10 1111 2222", appliedAt: "20 jam lalu" },
      { name: "Muhammad Ridho", contact: "20 12 3333 4444", appliedAt: "18 jam lalu" },
      { name: "Fajar Nugraha", contact: "20 11 5555 6666", appliedAt: "10 jam lalu" },
      { name: "Ahmad Fauzan", contact: "20 10 7777 8888", appliedAt: "4 jam lalu" },
    ],
  },
  {
    id: "sy-003",
    title: "Butuh Desainer untuk Logo Organisasi",
    description:
      "Organisasi kemahasiswaan kami butuh desain logo baru. Sudah ada moodboard, tinggal eksekusi. Budget terbatas tapi worth it untuk portofolio.",
    category: "Kreatif & Digital",
    location: "Online",
    status: "Aktif",
    postedAt: "2 hari lalu",
    ownerName: "Rizky Pratama",
    applicantCount: 1,
    applicants: [
      { name: "Bayu Kreatif", contact: "20 12 9988 7766", appliedAt: "1 hari lalu" },
    ],
  },
  {
    id: "sy-004",
    title: "Cari Katering untuk Acara Halal bi Halal",
    description:
      "Butuh katering nasi kotak untuk sekitar 40 orang, menu bebas asal enak dan porsi cukup. Pengiriman ke Madinat Nasr.",
    category: "Makanan & Minuman",
    location: "Madinat Nasr, Kairo",
    status: "Selesai",
    postedAt: "1 minggu lalu",
    ownerName: "Siti Nur Aini",
    applicantCount: 6,
    applicants: [
      { name: "Dapur Rindu Kampung", contact: "20 10 1212 3434", appliedAt: "6 hari lalu" },
      { name: "Toko Rempah Ibu", contact: "20 11 4545 6767", appliedAt: "6 hari lalu" },
      { name: "Kalam Studio", contact: "20 12 8989 1010", appliedAt: "5 hari lalu" },
      { name: "Barbershop Abu", contact: "20 10 2323 4545", appliedAt: "5 hari lalu" },
      { name: "Hasan Albana", contact: "20 11 6767 8989", appliedAt: "4 hari lalu" },
      { name: "Rizky Pratama", contact: "20 12 3232 5454", appliedAt: "3 hari lalu" },
    ],
  },
  {
    id: "sy-005",
    title: "Butuh Bantuan Servis Laptop Ringan",
    description:
      "Laptop lemot dan baterai boros, kemungkinan perlu bersih-bersih atau ganti pasta termal. Cari yang paham dan bisa datang ke kos.",
    category: "Bantuan & Layanan Harian",
    location: "Hay Sabi', Kairo",
    status: "Kedaluwarsa",
    postedAt: "2 minggu lalu",
    ownerName: "Fajar Nugraha",
    applicantCount: 0,
    applicants: [],
  },
];
