import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="Nik — home">
      Nik<span>.</span>
    </Link>
  );
}
