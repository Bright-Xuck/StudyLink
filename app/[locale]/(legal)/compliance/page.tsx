import { notFound } from 'next/navigation';
import { getLegalDocument } from '@/lib/legal-docs';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

interface CompliancePageProps {
  params: Promise< {
    locale: string;
  }>;
}

export default async function CompliancePage({ params }: CompliancePageProps) {
  const document = await getLegalDocument('compliance', (await params).locale);
  
  if (!document) {
    notFound();
  }

  return (
    <LegalDocumentLayout
      title={document.title}
      lastUpdated={document.lastUpdated}
      version={document.version}
      type="compliance"
    >
      <document.content />
    </LegalDocumentLayout>
  );
}