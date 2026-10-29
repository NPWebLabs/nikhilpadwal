"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ id, title, redirectTo }: { id: number; title: string; redirectTo?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function del() {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) return window.alert("Couldn't delete the post. Try again.");
    router.push(redirectTo || "/admin/posts?deleted=1");
    router.refresh();
  }
  return (
    <button type="button" className="icon-btn icon-btn--danger" onClick={del} disabled={busy}>
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
