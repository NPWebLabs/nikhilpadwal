import { getSetting } from "@/lib/settings";
import { listFiles } from "@/lib/filesRepo";
import { autoLlms, autoRobots, autoSitemap } from "@/lib/siteFiles";
import { CustomFiles, GeneratedFileEditor } from "@/components/admin/SiteFileEditors";

export default async function FilesAdmin() {
  try {
    const [robotsMode, robotsCustom, smMode, smCustom, smExtra, smExclude, llmsMode, llmsCustom, files, sitemap, llms] = await Promise.all([
      getSetting("robots_mode"), getSetting("robots_custom"), getSetting("sitemap_mode"), getSetting("sitemap_custom"),
      getSetting("sitemap_extra"), getSetting("sitemap_exclude"), getSetting("llms_mode"), getSetting("llms_custom"),
      listFiles(), autoSitemap(), autoLlms(),
    ]);
    const m = (v: string | null) => (v === "custom" ? "custom" : "auto");

    return (
      <>
        <div className="admin-top">
          <div>
            <h1>Site files</h1>
            <p>The files search engines and AI assistants read. Auto versions update themselves when you publish a post or case study.</p>
          </div>
        </div>
        <div className="stack">
          <GeneratedFileEditor file="sitemap" publicPath="/sitemap.xml" mode={m(smMode)} custom={smCustom || ""} auto={sitemap} extra={smExtra || ""} exclude={smExclude || ""}
            hint="Lists every published page, post and case study (noindex items are left out). Submit it in Google Search Console." />
          <GeneratedFileEditor file="robots" publicPath="/robots.txt" mode={m(robotsMode)} custom={robotsCustom || ""} auto={autoRobots()}
            hint="Tells crawlers what they may index. The auto version blocks /admin and /api and points to the sitemap." />
          <GeneratedFileEditor file="llms" publicPath="/llms.txt" mode={m(llmsMode)} custom={llmsCustom || ""} auto={llms}
            hint="A plain-Markdown summary of the site for AI assistants (llmstxt.org)." />
          <CustomFiles files={files.map((f) => ({ id: f.id, name: f.name, content: f.content }))} />
        </div>
      </>
    );
  } catch (e) {
    return (
      <>
        <div className="admin-top"><h1>Site files</h1></div>
        <div className="alert alert--error" role="alert">Can&apos;t load site files. Check DATABASE_URL. ({(e as Error).message.slice(0, 200)})</div>
      </>
    );
  }
}
