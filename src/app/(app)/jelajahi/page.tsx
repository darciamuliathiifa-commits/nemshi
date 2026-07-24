import { AdBrowser } from "@/components/ads/ad-browser";
import { mockAds } from "@/lib/mock-ads";

export default function EksplorPage() {
  const latestAds = [...mockAds].reverse();

  return <AdBrowser title="Eksplor Iklan" ads={latestAds} />;
}
