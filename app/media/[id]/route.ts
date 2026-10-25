import { getMedia } from "@/lib/postsRepo";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) return new Response("Not found", { status: 404 });
  const media = await getMedia(id).catch(() => null);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mime,
      "Content-Length": String(media.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(media.mime === "image/svg+xml" ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'" } : {}),
    },
  });
}
