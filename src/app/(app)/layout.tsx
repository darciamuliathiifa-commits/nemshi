import { TopNav } from "@/components/layout/top-nav";
import { PageTransition } from "@/components/layout/page-transition";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { PromoModals } from "@/components/shared/promo-modals";
import { AuthErrorCleaner } from "@/components/auth/auth-error-cleaner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nemsy-app min-h-screen bg-cream text-charcoal">
      <AuthErrorCleaner />
      <TopNav />
      <div className="mx-auto w-full max-w-[1400px]">
        <PageTransition>{children}</PageTransition>
      </div>
      <OnboardingModal />
      <PromoModals />
    </div>
  );
}
