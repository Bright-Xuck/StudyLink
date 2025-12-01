import DashboardNav from "@/components/layout/DashboardNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {

  return (
    <section>
      <DashboardNav />
      <div className="pt-20">
        {children}
      </div>
    </section>
  );
}
