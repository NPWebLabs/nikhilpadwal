"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign in failed.");
      const next = params.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1>Sign in</h1>
      <p className="muted" style={{ margin: "0 0 24px" }}>Admin access to write and publish blog posts.</p>
      {error && <div className="alert alert--error" role="alert">{error}</div>}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" className="input" type="email" autoComplete="username" required value={email}
          onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="pw">
          <input id="password" className="input" type={show ? "text" : "password"} autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!error} style={{ paddingRight: 64 }} />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <button className="btn" type="submit" disabled={loading || !email || !password} style={{ width: "100%", marginTop: 8 }}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="muted" style={{ fontSize: 13, marginTop: 18 }}>
        <a href="/">← Back to the site</a>
      </p>
    </form>
  );
}
