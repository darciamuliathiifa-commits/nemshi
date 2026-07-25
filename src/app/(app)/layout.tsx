import { TopNav } from "@/components/layout/top-nav";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <TopNav />
      <div className="mx-auto w-full max-w-[1400px]">{children}</div>
      <OnboardingModal />
    </div>
  );
}
