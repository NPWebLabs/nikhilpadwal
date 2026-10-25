import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="login">
      <div className="login__art">
        <Logo />
        <h2>Write it down.<br />Ship it to the blog.</h2>
        <span className="eyebrow" style={{ color: "rgba(243,243,241,.55)" }}>Nik. admin · posts & media</span>
      </div>
      <div className="login__form">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
