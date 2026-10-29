import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="login">
      <div className="login__art">
        <Link href="/" className="logo" aria-label="Nik. home">Nik<i>.</i></Link>
        <h2>Write, publish<br />and <em>measure</em>.</h2>
        <span className="eyebrow" style={{ color: "rgba(247,243,234,.55)" }}>Posts · Case studies · Analytics · SEO</span>
      </div>
      <div className="login__form">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
