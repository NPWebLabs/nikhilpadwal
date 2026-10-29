import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/session";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <div className="admin">
      <AdminNav email={admin.email} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
