import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  version: string;
  content: React.ComponentType;
}

// Custom MDX components using design system colors
const mdxComponents = {
  h1: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h1 
      id={id}
      className="scroll-mt-20 text-4xl font-bold tracking-tight text-foreground mb-8 border-b border-border pb-4"
    >
      {children}
    </h1>
  ),
  h2: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h2 
      id={id}
      className="scroll-mt-20 text-3xl font-semibold tracking-tight text-foreground mt-12 mb-6 border-b border-border pb-2"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h3 
      id={id}
      className="scroll-mt-20 text-2xl font-semibold tracking-tight text-foreground mt-8 mb-4"
    >
      {children}
    </h3>
  ),
  h4: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h4 
      id={id}
      className="scroll-mt-20 text-xl font-semibold tracking-tight text-foreground mt-6 mb-3"
    >
      {children}
    </h4>
  ),
  h5: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h5 
      id={id}
      className="scroll-mt-20 text-lg font-semibold tracking-tight text-foreground mt-4 mb-2"
    >
      {children}
    </h5>
  ),
  h6: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h6 
      id={id}
      className="scroll-mt-20 text-base font-semibold tracking-tight text-foreground mt-4 mb-2"
    >
      {children}
    </h6>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-foreground leading-7 mb-4">
      {children}
    </p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-outside space-y-2 mb-6 ml-6 text-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-outside space-y-2 mb-6 ml-6 text-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1 leading-7">
      {children}
    </li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary pl-6 pr-4 py-2 italic text-muted-foreground my-6 bg-primary/10 rounded-r-lg">
      {children}
    </blockquote>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-8 rounded-lg border border-border">
      <table className="min-w-full divide-y divide-border">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-muted">
      {children}
    </thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody className="bg-card divide-y divide-border">
      {children}
    </tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="hover:bg-accent transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-6 py-4 text-sm text-foreground">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="border-border my-8" />
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">
      {children}
    </strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="italic text-foreground">
      {children}
    </em>
  ),
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    // If it's a code block (has language class)
    if (className?.includes('language-')) {
      return (
        <code className={`${className} block bg-muted text-foreground p-4 rounded-lg overflow-x-auto text-sm font-mono`}>
          {children}
        </code>
      );
    }
    // Inline code
    return (
      <code className="bg-muted text-foreground px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted text-foreground p-4 rounded-lg overflow-x-auto my-6 text-sm font-mono border border-border">
      {children}
    </pre>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a 
      href={href} 
      className="text-primary hover:opacity-80 underline decoration-primary/40 hover:decoration-primary underline-offset-2 transition-all"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  // Custom warning/info boxes using design system colors
  div: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    if (className?.includes('warning')) {
      return (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 my-6">
          <div className="flex items-start space-x-3">
            <div className="text-destructive text-lg">⚠️</div>
            <div className="text-foreground">
              {children}
            </div>
          </div>
        </div>
      );
    }
    if (className?.includes('info')) {
      return (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 my-6">
          <div className="flex items-start space-x-3">
            <div className="text-primary text-lg">ℹ️</div>
            <div className="text-foreground">
              {children}
            </div>
          </div>
        </div>
      );
    }
    if (className?.includes('success')) {
      return (
        <div className="bg-accent border border-accent-foreground/20 rounded-lg p-4 my-6">
          <div className="flex items-start space-x-3">
            <div className="text-accent-foreground text-lg">✅</div>
            <div className="text-foreground">
              {children}
            </div>
          </div>
        </div>
      );
    }
    if (className?.includes('danger')) {
      return (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 my-6">
          <div className="flex items-start space-x-3">
            <div className="text-destructive text-lg">🚫</div>
            <div className="text-foreground">
              {children}
            </div>
          </div>
        </div>
      );
    }
    return <div className={className}>{children}</div>;
  },
};

export async function getLegalDocument(
  type: "terms" | "privacy" | "cookies" | "disclaimer" | "compliance",
  locale: string = "en"
): Promise<LegalDocument | null> {
  try {
    const docsDir = path.join(process.cwd(), "docs", "legal", locale);
    const filePath = path.join(docsDir, `${type}.mdx`);

    if (!fs.existsSync(filePath)) {
      // Fallback to English if locale doesn't exist
      const fallbackPath = path.join(
        process.cwd(),
        "docs",
        "legal",
        "en",
        `${type}.mdx`
      );
      if (!fs.existsSync(fallbackPath)) {
        return null;
      }
      return getLegalDocument(type, "en");
    }

    const source = fs.readFileSync(filePath, "utf-8");

    const { content, frontmatter } = await compileMDX({
      source,
      components: mdxComponents,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [
            remarkGfm, // GitHub Flavored Markdown support
          ],
          rehypePlugins: [
            rehypeSlug, // Add IDs to headings for anchor links
            rehypeHighlight, // Syntax highlighting for code blocks
          ],
          development: process.env.NODE_ENV === 'development',
        },
      },
    });

    // Create a wrapper component that applies proper styling
    const ContentComponent: React.ComponentType = () => (
      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20">
        {content}
      </div>
    );

    return {
      title: frontmatter.title as string,
      lastUpdated: frontmatter.lastUpdated as string,
      version: frontmatter.version as string,
      content: ContentComponent,
    };
  } catch (error) {
    console.error(
      `Error loading legal document ${type} for locale ${locale}:`,
      error
    );
    return null;
  }
}

// Helper function to get all available legal document types
export function getLegalDocumentTypes(): Array<"terms" | "privacy" | "cookies" | "disclaimer" | "compliance"> {
  return ["terms", "privacy", "cookies", "disclaimer", "compliance"];
}

// Helper function to get all available locales for legal documents
export function getLegalDocumentLocales(): string[] {
  try {
    const legalDir = path.join(process.cwd(), "docs", "legal");
    if (!fs.existsSync(legalDir)) {
      return ["en"]; // Default fallback
    }
    
    const locales = fs.readdirSync(legalDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    return locales.length > 0 ? locales : ["en"];
  } catch (error) {
    console.error("Error getting legal document locales:", error);
    return ["en"];
  }
}

// Helper function to check if a legal document exists for a specific locale
export function legalDocumentExists(
  type: "terms" | "privacy" | "cookies" | "disclaimer" | "compliance",
  locale: string = "en"
): boolean {
  try {
    const docsDir = path.join(process.cwd(), "docs", "legal", locale);
    const filePath = path.join(docsDir, `${type}.mdx`);
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(error)
    return false;
  }
}