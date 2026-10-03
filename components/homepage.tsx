import { LandingHeader } from '@/components/layout/landingHeader';
import { LandingPage } from '@/components/features/landingSections';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "2ndKey",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "description":
    "2ndKey keeps your USDC in a secure vault. If you stop checking in, it passes to the people you choose.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "author": {
    "@type": "Organization",
    "name": "2ndKey Team",
    "url": "https://2ndkey.example",
  },
};

export default function Homepage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingHeader />
      {/* Hero section goes directly behind the fixed header */}
      <main id="main-content" className="pt-0">
        <LandingPage />
      </main>
    </>
  );
}
