import type { Ad } from "@/lib/types";

export function getAdById(id: string): Ad | undefined {
  return mockAds.find((ad) => ad.id === id);
}

export interface SellerProfile {
  name: string;
  joinedYear: number;
  activeAdsCount: number;
  ads: Ad[];
}

export function getSellerProfile(sellerName: string): SellerProfile | undefined {
  const ads = mockAds.filter((ad) => ad.sellerName === sellerName);
  if (ads.length === 0) return undefined;

  return {
    name: sellerName,
    joinedYear: ads[0].sellerJoinedYear,
    activeAdsCount: ads[0].sellerActiveAds,
    ads,
  };
}

export const mockAds: Ad[] = [];
