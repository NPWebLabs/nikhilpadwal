import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RevealObserver from "@/components/RevealObserver";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <RevealObserver />
    </>
  );
}
