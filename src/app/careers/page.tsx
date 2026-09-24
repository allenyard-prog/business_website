import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Open positions | Wonderhow Careers",
  description: "Explore open roles at Wonderhow and find the next place to do work that matters.",
};

export default async function CareersPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "published", applicationOpen: true },
    orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="career-page careers-index-page">
      <header className="career-header">
        <Link className="brand" href="/" aria-label="Wonderhow home"><span className="brand-mark" aria-hidden="true">W</span><span>Wonderhow</span></Link>
        <nav aria-label="Careers navigation"><Link href="/">Company</Link><a href="#positions">Open positions</a></nav>
        <a className="career-header-cta" href="#positions">View roles <span aria-hidden="true">↓</span></a>
      </header>
      <main>
        <section className="careers-index-hero">
          <p className="career-team">Careers at Wonderhow</p>
          <h1>Do work that makes<br /><em>people wonder how.</em></h1>
          <p>Join a thoughtful team building useful software for ambitious organizations. Explore our open positions and find the role where you can make your mark.</p>
        </section>
        <section className="careers-openings" id="positions">
          <div className="careers-openings-heading"><div><p className="career-section-number">Open positions</p><h2>Find your next role.</h2></div><span>{jobs.length} {jobs.length === 1 ? "opening" : "openings"}</span></div>
          <div className="job-list">
            {jobs.length === 0 ? <div className="job-empty"><h3>No open positions right now.</h3><p>Check back soon—we are always thinking about what comes next.</p></div> : jobs.map((job) => (
              <Link className="job-card" href={`/careers/${job.slug}`} key={job.id}>
                <div><span>{job.team}</span><h3>{job.title}</h3><p>{job.summary}</p></div>
                <dl><div><dt>Location</dt><dd>{job.location}</dd></div><div><dt>Workplace</dt><dd>{job.workplaceType}</dd></div><div><dt>Type</dt><dd>{job.employmentType}</dd></div></dl>
                <strong>View position <span aria-hidden="true">→</span></strong>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <footer className="career-footer"><Link className="brand brand-light" href="/"><span className="brand-mark">W</span><span>Wonderhow</span></Link><p>Curious minds building useful software for what&apos;s next.</p><a href="mailto:careers@wonderhow.co">careers@wonderhow.co</a></footer>
    </div>
  );
}
