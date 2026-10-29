import Providers from "@/components/site/Providers";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Tracker from "@/components/site/Tracker";
import WaFloat from "@/components/site/WaFloat";
import { getCaseStudies } from "@/lib/caseStudies";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cases = await getCaseStudies();
  return (
    <Providers>
      <div id="top" />
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer caseCount={cases.length} />
      <WaFloat />
      <Tracker />
    </Providers>
  );
}
