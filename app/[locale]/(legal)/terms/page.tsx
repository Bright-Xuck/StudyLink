import { notFound } from 'next/navigation';
import { getLegalDocument } from '@/lib/legal-docs';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

interface TermsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const document = await getLegalDocument('terms', (await params).locale);
  
  if (!document) {
    notFound();
  }

  return (
    <LegalDocumentLayout
      title={document.title}
      lastUpdated={document.lastUpdated}
      version={document.version}
      type="terms"
    >
      <document.content />
    </LegalDocumentLayout>
  );
}
