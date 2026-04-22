import Sidebar from '@/components/layout/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-[280px]">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
