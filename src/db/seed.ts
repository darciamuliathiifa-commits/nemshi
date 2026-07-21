import "dotenv/config";
import { db } from "./index";
import { areas, categories, listingPhotos, listings, users } from "./schema";

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

  const [amina, budi, citra, dedi] = await db
    .insert(users)
    .values([
      { fullName: "Amina Zahra", email: "amina@example.com", verificationStatus: "Skill_Verified" },
      { fullName: "Budi Santoso", email: "budi@example.com", verificationStatus: "Identity_Verified" },
      { fullName: "Citra Dewi", email: "citra@example.com", verificationStatus: "Unverified" },
      { fullName: "Dedi Kurniawan", email: "dedi@example.com", verificationStatus: "Skill_Verified" },
    ])
    .returning();

  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const seededListings = await db
    .insert(listings)
    .values([
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
    ])
    .returning();

  const photoCount = 10;
  let photoSeedIndex = 0;

  for (const listing of seededListings) {
    const count = 2 + (photoSeedIndex % 3);
    for (let i = 0; i < count; i++) {
      const seedId = photoSeedIndex % photoCount;
      photoSeedIndex += 1;
      await db.insert(listingPhotos).values({
        listingId: listing.id,
        url: `/seed/photo-${seedId}.png`,
        sortOrder: i,
      });
    }
  }

  console.log(`Seeded ${seededListings.length} listings.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
