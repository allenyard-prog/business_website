import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CareerApplicationForm from "./CareerApplicationForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function lines(value: string) { return value.split("\n").map((line) => line.trim()).filter(Boolean); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await prisma.job.findUnique({ where: { slug }, select: { title: true, summary: true, status: true } });
  if (!job || !["published", "closed"].includes(job.status)) return { title: "Position not found | Wonderhow" };
  return { title: `${job.title} | Wonderhow Careers`, description: job.summary };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({ where: { slug } });
  if (!job || !["published", "closed"].includes(job.status)) notFound();
  const isOpen = job.status === "published" && job.applicationOpen;
  return (
    <div className="career-page">
      <header className="career-header"><Link className="brand" href="/" aria-label="Wonderhow home"><span className="brand-mark" aria-hidden="true">W</span><span>Wonderhow</span></Link><nav aria-label="Careers navigation"><Link href="/careers">All positions</Link><a href="#overview">Overview</a>{isOpen && <a href="#application">Application</a>}</nav>{isOpen ? <a className="career-header-cta" href="#application">Apply now →</a> : <Link className="career-header-cta" href="/careers">Other roles →</Link>}</header>
      <main>
        <section className="career-hero"><div className="career-hero-grid" aria-hidden="true" /><div className="career-hero-copy"><Link className="career-back" href="/careers">← Back to all positions</Link><div className="career-status"><span /> {isOpen ? "Open role" : "Applications closed"} · {job.location}</div><p className="career-team">{job.team} · {job.workplaceType}</p><h1>{job.title}</h1><p className="career-subtitle">{job.summary}</p>{isOpen && <div className="career-hero-actions"><a className="career-primary-button" href="#application">Apply for this role →</a><span>{job.employmentType}<br />{job.location}</span></div>}</div><aside className="career-summary"><div className="career-summary-top"><span>Role snapshot</span><b>{job.workplaceType.slice(0, 2).toUpperCase()}</b></div><dl><div><dt>Team</dt><dd>{job.team}</dd></div><div><dt>Location</dt><dd>{job.location}</dd></div><div><dt>Work style</dt><dd>{job.workplaceType}</dd></div><div><dt>Employment</dt><dd>{job.employmentType}</dd></div></dl>{isOpen ? <a href="#application">Start your application →</a> : <Link href="/careers">Browse open roles →</Link>}</aside></section>
        <section className="career-content" id="overview"><aside className="career-sidebar"><span>On this page</span><a href="#about">About the role</a><a href="#responsibilities">Responsibilities</a><a href="#requirements">Requirements</a>{job.compensation && <a href="#compensation">Compensation</a>}{isOpen && <a href="#application">Apply</a>}</aside><div className="career-description"><article id="about"><p className="career-section-number">01 · About the role</p><h2>Make an impact with us.</h2>{lines(job.description).map((item) => <p key={item}>{item}</p>)}</article><article id="responsibilities"><p className="career-section-number">02 · Responsibilities</p><h2>What you&apos;ll take ownership of.</h2><ul className="career-check-list">{lines(job.responsibilities).map((item) => <li key={item}><span>✓</span><p>{item}</p></li>)}</ul></article><article id="requirements"><p className="career-section-number">03 · Requirements</p><h2>What will help you thrive.</h2><ul className="career-check-list">{lines(job.requirements).map((item) => <li key={item}><span>✓</span><p>{item}</p></li>)}</ul></article>{job.compensation && <article id="compensation"><p className="career-section-number">04 · Compensation</p><h2>Transparent terms.</h2><div className="career-note"><b>Compensation</b><p>{job.compensation}</p></div></article>}</div></section>
        {isOpen ? <section className="career-apply" id="application"><div className="career-apply-intro"><p className="career-section-number">Apply</p><h2>Ready to build<br /><em>with us?</em></h2><p>Tell us about your experience and why this role feels right for you.</p></div><div className="greenhouse-card"><CareerApplicationForm job={job} /></div></section> : <section className="career-closed"><h2>Applications for this role are closed.</h2><p>Explore our other open positions to find your next opportunity.</p><Link href="/careers">View open positions →</Link></section>}
      </main>
      <footer className="career-footer"><Link className="brand brand-light" href="/"><span className="brand-mark">W</span><span>Wonderhow</span></Link><p>Curious minds building useful software for what&apos;s next.</p><a href="mailto:careers@wonderhow.co">careers@wonderhow.co</a></footer>
    </div>
  );
}
