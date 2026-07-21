import { Suspense } from "react";
import { JelajahiGallery } from "./jelajahi-gallery";

export default function Home() {
  return (
    <Suspense>
      <JelajahiGallery />
    </Suspense>
  );
}
