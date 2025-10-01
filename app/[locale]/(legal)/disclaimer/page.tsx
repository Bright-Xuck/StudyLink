import { notFound } from 'next/navigation';
import { getLegalDocument } from '@/lib/legal-docs';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

interface DisclaimerPageProps {
  params: Promise< {
    locale: string;
  }>;
}

export default async function DisclaimerPage({ params }: DisclaimerPageProps) {
  const document = await getLegalDocument('disclaimer', (await params).locale);
  
  if (!document) {
    notFound();
  }

  return (
    <LegalDocumentLayout
      title={document.title}
      lastUpdated={document.lastUpdated}
      version={document.version}
      type="disclaimer"
    >
      <document.content />
    </LegalDocumentLayout>
  );
}