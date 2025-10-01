import { notFound } from 'next/navigation';
import { getLegalDocument } from '@/lib/legal-docs';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

interface PrivacyPageProps {
  params: Promise< {
    locale: string;
  }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const document = await getLegalDocument('privacy', (await params).locale);
  
  if (!document) {
    notFound();
  }

  return (
    <LegalDocumentLayout
      title={document.title}
      lastUpdated={document.lastUpdated}
      version={document.version}
      type="privacy"
    >
      <document.content />
    </LegalDocumentLayout>
  );
}