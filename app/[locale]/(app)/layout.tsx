import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LegalLayoutProps {
  children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 bg-muted/30">
        {children}
      </section>
      <Footer />
    </div>
  );
}