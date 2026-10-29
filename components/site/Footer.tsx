import Image from "next/image";
import Link from "next/link";
import { profile, sectors, whatsappUrl } from "@/lib/data";
import ContactForm from "./ContactForm";
import { Clock, CopyEmail } from "./FooterBits";
import Reveal from "./Reveal";

export default function Footer({ caseCount }: { caseCount: number }) {
  const s = profile.socials;
  return (
    <footer className="contact band" id="contact">
      <div className="wrap">
        <Reveal className="cta-big">
          <span className="label dot">Contact</span>
          <h2 className="serif" style={{ marginTop: 20 }}>Have a site that should be faster, or a store that <em>should exist?</em></h2>
        </Reveal>
        <div className="c-grid">
          <div>
            <div className="me">
              <Image src="/images/nik-headshot.webp" alt="" width={56} height={56} />
              <div><b>Nikhil Padwal</b><span>{profile.role} · Navi Mumbai &amp; Pune</span></div>
            </div>
            <div className="reach">
              <div className="row"><div><small>Email</small><div className="v" id="mail">{profile.email}</div></div><CopyEmail email={profile.email} /></div>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><div><small>WhatsApp</small><div className="v">{profile.phone}</div></div><span aria-hidden="true">↗</span></a>
              <div className="row"><div><small>Call</small><div className="v">{profile.phone}</div></div><a className="copy" href={`tel:${profile.phone.replace(/\s/g, "")}`} style={{ display: "inline-flex", alignItems: "center", minHeight: 40, borderBottom: "1px solid var(--line)" }}>CALL</a></div>
              <a href={s.instagram.url} target="_blank" rel="noopener noreferrer"><div><small>Instagram</small><div className="v">{s.instagram.handle}</div></div><span aria-hidden="true">↗</span></a>
              <a href={s.linkedin.url} target="_blank" rel="noopener noreferrer"><div><small>LinkedIn</small><div className="v">{s.linkedin.handle}</div></div><span aria-hidden="true">↗</span></a>
              <a href={s.github.url} target="_blank" rel="noopener noreferrer"><div><small>GitHub</small><div className="v">{s.github.handle}</div></div><span aria-hidden="true">↗</span></a>
              <a href="/nikhil-padwal-resume.pdf" target="_blank" rel="noopener"><div><small>Résumé</small><div className="v">PDF</div></div><span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <ContactForm />
        </div>

        <div className="foot">
          <div><h4>NAVIGATE</h4><ul>
            <li><Link href="/#numbers">The numbers</Link></li><li><Link href="/case-studies">Work</Link></li><li><Link href="/#services">Services</Link></li>
            <li><Link href="/#experience">Experience</Link></li><li><Link href="/#education">Education</Link></li><li><Link href="/blog">Blog</Link></li>
          </ul></div>
          <div><h4>WORK</h4><ul>
            <li><Link href="/case-studies">All {caseCount} case studies</Link></li>
            {sectors.map((x) => <li key={x}><Link href={`/case-studies?sector=${encodeURIComponent(x)}`}>{x}</Link></li>)}
          </ul></div>
          <div><h4>ELSEWHERE</h4><ul>
            {Object.values(s).map((x) => <li key={x.url}><a href={x.url} target="_blank" rel="noopener noreferrer">{x.label} ↗</a></li>)}
          </ul></div>
          <div><h4>LOCAL TIME · INDIA</h4><ul><li><Clock /></li><li style={{ marginTop: 8 }}>Navi Mumbai &amp; Pune, Maharashtra</li></ul></div>
        </div>
        <div className="wordmark" aria-hidden="true">Nik<i>.</i></div>
        <div className="legal"><span>© {new Date().getFullYear()} Nikhil Padwal</span><span>Web · SaaS · AI</span><a href="#top">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
