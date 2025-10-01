import { notFound } from 'next/navigation';
import { getLegalDocument } from '@/lib/legal-docs';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

interface CookiesPageProps {
  params: Promise< {
    locale: string;
  }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const document = await getLegalDocument('cookies', (await params).locale);
  
  if (!document) {
    notFound();
  }

  return (
    <LegalDocumentLayout
      title={document.title}
      lastUpdated={document.lastUpdated}
      version={document.version}
      type="cookies"
    >
      <document.content />
    </LegalDocumentLayout>
  );
}