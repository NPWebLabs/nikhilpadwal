import { FILE_NAME_RE, getFileByName } from "@/lib/filesRepo";

// Custom root files (admin → Site files). middleware.ts rewrites /<name>.<ext> here.
export const revalidate = 300;

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!FILE_NAME_RE.test(name)) return new Response("Not found", { status: 404 });
  const file = await getFileByName(name);
  if (!file) return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(file.content, { headers: { "Content-Type": file.mime, "Cache-Control": "public, max-age=300" } });
}
