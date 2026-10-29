import { notFound } from "next/navigation";
import { getCaseRow } from "@/lib/caseStudies";
import CaseEditor from "@/components/admin/CaseEditor";

export default async function EditCase({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const r = await getCaseRow(id);
  if (!r) notFound();
  return (
    <CaseEditor
      flash={saved}
      initial={{
        id: r.id, name: r.name, slug: r.slug, url: r.url, platform: r.platform, sector: r.sector, category: r.category,
        summary: r.summary || "", highlights: r.highlights || "", image: r.image || "", featured: Boolean(r.featured), status: r.status,
        sortOrder: r.sortOrder, overview: r.overview || "", challenge: r.challenge || "", approach: r.approach || "", outcome: r.outcome || "",
        body: r.body || "", seoTitle: r.seoTitle || "", metaDescription: r.metaDescription || "", ogImage: r.ogImage || "", noindex: Boolean(r.noindex),
      }}
    />
  );
}
