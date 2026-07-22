import "dotenv/config";
import { db } from "./index";
import { areas, categories, listingPhotos, listings, testimonials, userQuotas, users } from "./schema";

async function seed() {
  const [titipAntar, pindahan, akademik] = await db
    .insert(categories)
    .values([
      { name: "Jasa Titip/Antar", slug: "jasa-titip-antar", icon: "📦" },
      { name: "Pindahan", slug: "pindahan", icon: "🚚" },
      { name: "Jasa Akademik/Penerjemahan", slug: "jasa-akademik-penerjemahan", icon: "📚" },
    ])
    .returning();

  const [kairo, alexandria, mansoura, tanta] = await db
    .insert(areas)
    .values([
      { name: "Kairo", slug: "kairo" },
      { name: "Alexandria", slug: "alexandria" },
      { name: "Mansoura", slug: "mansoura" },
      { name: "Tanta", slug: "tanta" },
    ])
    .returning();

  const [amina, budi, citra, dedi, eka, galih] = await db
    .insert(users)
    .values([
      {
        fullName: "Amina Zahra",
        email: "amina@example.com",
        verificationStatus: "Skill_Verified",
        avatarUrl: "/seed/avatar-az.png",
        whatsappLink: "https://wa.me/201111111111",
      },
      {
        fullName: "Budi Santoso",
        email: "budi@example.com",
        verificationStatus: "Identity_Verified",
        avatarUrl: "/seed/avatar-bs.png",
        whatsappLink: "https://wa.me/201222222222",
      },
      {
        fullName: "Citra Dewi",
        email: "citra@example.com",
        verificationStatus: "Unverified",
        avatarUrl: "/seed/avatar-cd.png",
        whatsappLink: "https://wa.me/201333333333",
      },
      {
        fullName: "Dedi Kurniawan",
        email: "dedi@example.com",
        verificationStatus: "Skill_Verified",
        avatarUrl: "/seed/avatar-dk.png",
        whatsappLink: "https://wa.me/201444444444",
      },
      {
        fullName: "Eka Fitriani",
        email: "eka@example.com",
        verificationStatus: "Skill_Verified",
        avatarUrl: "/seed/avatar-ef.png",
        whatsappLink: "https://wa.me/201666666666",
      },
      {
        fullName: "Galih Hartono",
        email: "galih@example.com",
        verificationStatus: "Identity_Verified",
        avatarUrl: "/seed/avatar-gh.png",
        whatsappLink: "https://wa.me/201777777777",
      },
    ])
    .returning();

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const offersService: (typeof listings.$inferInsert)[] = [
    // Jasa Titip/Antar
    {
      userId: amina.id,
      categoryId: titipAntar.id,
      areaId: kairo.id,
      title: "Titip Beli & Antar Barang dari Indonesia ke Kairo",
      description:
        "Melayani jasa titip beli oleh-oleh, bumbu dapur, dan kebutuhan sehari-hari dari Indonesia untuk Masisir di Kairo. Pengiriman aman dan terpercaya.",
      whatsappLink: "https://wa.me/201111111111",
      priceType: "Range",
      priceMin: 50,
      priceMax: 300,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: true,
    },
    {
      userId: budi.id,
      categoryId: titipAntar.id,
      areaId: kairo.id,
      title: "Jasa Titip Kirim & Legalisir Dokumen ke Kedutaan",
      description:
        "Bantu antar dan urus dokumen yang perlu legalisir/tanda tangan ke Kedutaan Besar RI Kairo. Cocok untuk yang lokasinya jauh atau sedang sibuk kuliah.",
      whatsappLink: "https://wa.me/201222222222",
      priceType: "Range",
      priceMin: 30,
      priceMax: 80,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: false,
    },
    {
      userId: eka.id,
      categoryId: titipAntar.id,
      areaId: alexandria.id,
      title: "Titip Beli Bumbu Dapur & Kebutuhan Masak Indonesia",
      description:
        "Stok bumbu dapur khas Indonesia (kecap, sambal, bumbu instan) selalu ready untuk dititip ke seluruh area Alexandria. Update stok tiap minggu.",
      whatsappLink: "https://wa.me/201666666666",
      priceType: "Range",
      priceMin: 40,
      priceMax: 150,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: false,
    },
    {
      userId: galih.id,
      categoryId: titipAntar.id,
      areaId: kairo.id,
      title: "Jasa Antar Jemput Bandara Kairo 24 Jam",
      description:
        "Antar jemput bandara Kairo (CAI) kapan saja, termasuk dini hari. Mobil nyaman, sopir berpengalaman rute Masisir. Booking H-1 lebih diutamakan.",
      whatsappLink: "https://wa.me/201777777777",
      priceType: "Range",
      priceMin: 100,
      priceMax: 250,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: true,
    },
    {
      userId: dedi.id,
      categoryId: titipAntar.id,
      areaId: tanta.id,
      title: "Titip Oleh-Oleh dari Indonesia ke Tanta",
      description:
        "Baru pulang kampung bulan depan, terima titipan oleh-oleh/barang kecil buat dibawa balik ke Tanta. Slot terbatas.",
      whatsappLink: "https://wa.me/201444444444",
      priceType: "Contact",
      priceMin: null,
      priceMax: null,
      status: "Pending_Moderation",
      type: "Offers_Service",
      isPriority: false,
    },
    // Pindahan
    {
      userId: budi.id,
      categoryId: pindahan.id,
      areaId: kairo.id,
      title: "Jasa Pindahan Kost Masisir Area Kairo & Sekitarnya",
      description:
        "Bantu pindahan kost/apartemen dengan mobil pickup pribadi. Cepat, hati-hati dengan barang, dan harga bersahabat untuk mahasiswa.",
      whatsappLink: "https://wa.me/201222222222",
      priceType: "Contact",
      priceMin: null,
      priceMax: null,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: false,
    },
    {
      userId: amina.id,
      categoryId: pindahan.id,
      areaId: tanta.id,
      title: "Sewa Mobil + Sopir untuk Pindahan Barang Besar",
      description:
        "Sewa mobil box untuk pindahan barang berukuran besar seperti kasur dan lemari. Tersedia sopir berpengalaman area Tanta dan sekitarnya.",
      whatsappLink: "https://wa.me/201555555555",
      priceType: "Range",
      priceMin: 150,
      priceMax: 400,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: true,
    },
    {
      userId: citra.id,
      categoryId: pindahan.id,
      areaId: alexandria.id,
      title: "Jasa Angkut Barang Pindahan Alexandria",
      description:
        "Tenaga angkut barang untuk pindahan apartemen di area Alexandria. Bisa borongan atau per jam, tim 2 orang siap bantu naik-turun tangga.",
      whatsappLink: "https://wa.me/201333333333",
      priceType: "Range",
      priceMin: 80,
      priceMax: 200,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: false,
    },
    {
      userId: galih.id,
      categoryId: pindahan.id,
      areaId: mansoura.id,
      title: "Pindahan Kilat Same-Day Area Mansoura",
      description:
        "Butuh pindah hari ini juga? Layanan pindahan same-day area Mansoura, konfirmasi pagi bisa selesai sore. Termasuk bongkar-pasang perabot ringan.",
      whatsappLink: "https://wa.me/201777777777",
      priceType: "Range",
      priceMin: 100,
      priceMax: 300,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: false,
    },
    {
      userId: eka.id,
      categoryId: pindahan.id,
      areaId: kairo.id,
      title: "Jasa Packing & Pindahan Apartemen Rapi",
      description:
        "Paket lengkap packing barang pecah belah + angkut pindahan apartemen. Dus dan bubble wrap disediakan.",
      whatsappLink: "https://wa.me/201666666666",
      priceType: "Range",
      priceMin: 120,
      priceMax: 350,
      status: "Rejected",
      moderationReason: "Deskripsi kurang jelas soal cakupan area layanan, mohon dilengkapi dan diajukan ulang.",
      type: "Offers_Service",
      isPriority: false,
    },
    // Jasa Akademik/Penerjemahan
    {
      userId: citra.id,
      categoryId: akademik.id,
      areaId: alexandria.id,
      title: "Jasa Terjemah Bahasa Arab-Indonesia untuk Tugas Kuliah",
      description:
        "Menerima jasa terjemahan dokumen akademik, muqarrar, dan makalah Bahasa Arab ke Indonesia maupun sebaliknya. Berpengalaman menerjemahkan lebih dari 100 dokumen.",
      whatsappLink: "https://wa.me/201333333333",
      priceType: "Range",
      priceMin: 20,
      priceMax: 100,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: false,
    },
    {
      userId: dedi.id,
      categoryId: akademik.id,
      areaId: mansoura.id,
      title: "Les Privat Nahwu-Shorof untuk Mahasiswa Baru",
      description:
        "Membantu adik-adik mahasiswa baru memahami dasar Nahwu-Shorof dengan metode yang mudah dipahami. Bisa online maupun tatap muka di Mansoura.",
      whatsappLink: "https://wa.me/201444444444",
      priceType: "Contact",
      priceMin: null,
      priceMax: null,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: false,
    },
    {
      userId: eka.id,
      categoryId: akademik.id,
      areaId: kairo.id,
      title: "Jasa Proofread & Edit Skripsi Bahasa Indonesia",
      description:
        "Bantu proofread, rapikan tata bahasa, dan cek konsistensi sitasi skripsi/tugas akhir berbahasa Indonesia. Pengalaman 3 tahun jadi editor jurnal kampus.",
      whatsappLink: "https://wa.me/201666666666",
      priceType: "Range",
      priceMin: 50,
      priceMax: 200,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: true,
    },
    {
      userId: galih.id,
      categoryId: akademik.id,
      areaId: tanta.id,
      title: "Terjemah Tersumpah Dokumen Akademik & Legal",
      description:
        "Jasa terjemahan dokumen akademik (ijazah, transkrip) dan legal Arab-Indonesia, hasil rapi dan bisa dipakai untuk keperluan resmi.",
      whatsappLink: "https://wa.me/201777777777",
      priceType: "Range",
      priceMin: 60,
      priceMax: 250,
      status: "Active",
      type: "Offers_Service",
      publishedAt: now,
      expiresAt: in30Days,
      isPriority: false,
    },
  ];

  const needsService: (typeof listings.$inferInsert)[] = [
    {
      userId: citra.id,
      categoryId: akademik.id,
      areaId: alexandria.id,
      title: "Dicari: Tutor Bahasa Inggris untuk Persiapan IELTS",
      description:
        "Mencari tutor Bahasa Inggris berpengalaman untuk membantu persiapan IELTS selama 1 bulan. Lebih disukai yang berpengalaman mengajar mahasiswa.",
      whatsappLink: "https://wa.me/201333333333",
      priceType: "Contact",
      priceMin: null,
      priceMax: null,
      status: "Active",
      type: "Needs_Service",
      publishedAt: now,
      expiresAt: in24Hours,
      isPriority: false,
    },
    {
      userId: budi.id,
      categoryId: pindahan.id,
      areaId: kairo.id,
      title: "Dicari: Jasa Pindahan Kilat Weekend Ini",
      description:
        "Butuh bantuan pindahan kost Sabtu ini, barang tidak terlalu banyak tapi ada kasur dan lemari kecil. Area Kairo.",
      whatsappLink: "https://wa.me/201222222222",
      priceType: "Contact",
      priceMin: null,
      priceMax: null,
      status: "Active",
      type: "Needs_Service",
      publishedAt: now,
      expiresAt: in3Days,
      isPriority: true,
    },
    {
      userId: amina.id,
      categoryId: akademik.id,
      areaId: kairo.id,
      title: "Dicari: Penerjemah Dokumen Visa Tersumpah",
      description:
        "Cari jasa penerjemah tersumpah untuk dokumen pengajuan visa, butuh cepat karena deadline minggu depan.",
      whatsappLink: "https://wa.me/201111111111",
      priceType: "Contact",
      priceMin: null,
      priceMax: null,
      status: "Active",
      type: "Needs_Service",
      publishedAt: now,
      expiresAt: in24Hours,
      isPriority: false,
    },
    {
      userId: dedi.id,
      categoryId: titipAntar.id,
      areaId: mansoura.id,
      title: "Dicari: Rekomendasi Jasa Titip Buku dari Indonesia",
      description:
        "Ada yang lagi pulang Indonesia dalam waktu dekat dan bisa titip buku pelajaran? Beratnya sekitar 3kg.",
      whatsappLink: "https://wa.me/201444444444",
      priceType: "Contact",
      priceMin: null,
      priceMax: null,
      status: "Active",
      type: "Needs_Service",
      publishedAt: now,
      expiresAt: in24Hours,
      isPriority: false,
    },
    {
      userId: galih.id,
      categoryId: pindahan.id,
      areaId: tanta.id,
      title: "Dicari: Jasa Angkut Motor ke Tanta",
      description:
        "Butuh jasa angkut motor dari Kairo ke Tanta, sudah siap bayar prioritas biar cepat dapat penyedia.",
      whatsappLink: "https://wa.me/201777777777",
      priceType: "Contact",
      priceMin: null,
      priceMax: null,
      status: "Pending_Moderation",
      type: "Needs_Service",
      isPriority: true,
      paidWithQuota: false,
    },
  ];

  const seededListings = await db
    .insert(listings)
    .values([...offersService, ...needsService])
    .returning();

  const photosByCategory: Record<string, string[]> = {
    [titipAntar.id]: ["titip-antar-1", "titip-antar-2", "titip-antar-3", "titip-antar-4"],
    [pindahan.id]: ["pindahan-1", "pindahan-2", "pindahan-3", "pindahan-4"],
    [akademik.id]: ["akademik-1", "akademik-2", "akademik-3", "akademik-4"],
  };

  for (const listing of seededListings) {
    if (listing.type !== "Offers_Service") continue;
    const variants = photosByCategory[listing.categoryId];
    const photoCount = 2 + (Math.floor(Math.random() * 2));
    for (let i = 0; i < photoCount; i++) {
      const variant = variants[(i + seededListings.indexOf(listing)) % variants.length];
      await db.insert(listingPhotos).values({
        listingId: listing.id,
        url: `/seed/${variant}.png`,
        sortOrder: i,
      });
    }
  }

  await db.insert(userQuotas).values([
    {
      userId: amina.id,
      quotaType: "Listing_Slot",
      remainingAmount: 2,
      validityEnd: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      userId: amina.id,
      quotaType: "Priority_Slot",
      remainingAmount: 1,
      validityEnd: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      userId: galih.id,
      quotaType: "Listing_Slot",
      remainingAmount: 3,
      validityEnd: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      userId: galih.id,
      quotaType: "Priority_Slot",
      remainingAmount: 2,
      validityEnd: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
    },
  ]);

  await db.insert(testimonials).values([
    {
      revieweeUserId: amina.id,
      reviewerName: "Fajar Ramadhan",
      rating: 5,
      comment: "Titipan sampai cepat dan aman, terpercaya banget. Recommended!",
    },
    {
      revieweeUserId: amina.id,
      reviewerName: "Siti Nurhaliza",
      rating: 4,
      comment: "Pelayanan ramah, barang dikemas rapi. Cuma agak lama responnya.",
    },
    {
      revieweeUserId: dedi.id,
      reviewerName: "Rangga Pratama",
      rating: 5,
      comment: "Penjelasannya mudah dipahami, jadi lebih siap ujian Nahwu-Shorof.",
    },
    {
      revieweeUserId: budi.id,
      reviewerName: "Wulan Sari",
      rating: 5,
      comment: "Pindahan jadi gampang banget, mobilnya bersih dan sopirnya sopan.",
    },
    {
      revieweeUserId: eka.id,
      reviewerName: "Bagas Wicaksono",
      rating: 4,
      comment: "Bumbu masak lengkap, tinggal pilih dan tunggu diantar. Praktis!",
    },
    {
      revieweeUserId: galih.id,
      reviewerName: "Nadia Ayu",
      rating: 5,
      comment: "Jemput bandara tepat waktu meski saya landing tengah malam. Makasih banyak!",
    },
  ]);

  console.log(`Seeded ${seededListings.length} listings.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
