import { profile } from "@/lib/data";

export const whatsappUrl = (text = "Hi Nikhil, I'd like to talk about a project.") =>
  `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(text)}`;

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/icons/whatsapp-white.svg" alt="" width={size} height={size} aria-hidden="true" />
  );
}

// Floating chat button, shown on every public page.
export default function WhatsAppButton() {
  return (
    <a className="wa-float" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label={`Chat on WhatsApp, ${profile.phone}`}>
      <WhatsAppIcon size={26} />
    </a>
  );
}
