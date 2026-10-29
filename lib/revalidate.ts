import "server-only";
import { revalidatePath } from "next/cache";

/** Pages that list case studies or posts, plus the generated files that include them. */
export function revalidateContent(kind: "case" | "post", slugs: string[] = []) {
  const base = kind === "case" ? "/case-studies" : "/blog";
  for (const p of ["/", base, "/sitemap.xml", "/llms.txt", ...slugs.map((s) => `${base}/${s}`)]) revalidatePath(p);
}
