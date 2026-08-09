import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nemsy-app flex min-h-screen bg-cream text-charcoal font-sans antialiased">
      <AdminSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-cream">{children}</div>
    </div>
  );
}
