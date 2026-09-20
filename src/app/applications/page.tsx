import type { Metadata } from "next";
import Link from "next/link";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Applications | Wonderhow",
  description: "Review submitted job applications.",
  robots: { index: false, follow: false },
};

type ApplicationRecord = {
  id: string;
  receivedAt: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  cityState?: string;
  internetProvider?: string;
  downloadSpeed?: string;
  uploadSpeed?: string;
  secureLocation?: string;
  availability?: string;
  portfolio?: string;
  linkedin?: string;
  message?: string;
  resumeOriginalName?: string;
};

async function getApplications(): Promise<ApplicationRecord[]> {
  const directory = path.join(process.cwd(), ".data", "applications");

  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const applications = await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
      try {
        const content = await readFile(path.join(directory, entry.name, "application.json"), "utf8");
        return JSON.parse(content) as ApplicationRecord;
      } catch {
        return null;
      }
    }));

    return applications
      .filter((application): application is ApplicationRecord => application !== null)
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  } catch {
    return [];
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(date);
}

function DetailRow({ label, value, href }: { label: string; value?: string; href?: string }) {
  if (!value) return null;
  return <div className="application-detail-row"><dt>{label}</dt><dd>{href ? <a href={href}>{value}</a> : value}</dd></div>;
}

export default async function ApplicationsPage() {
  const applications = await getApplications();
  const latestDate = applications[0]?.receivedAt ? formatDate(applications[0].receivedAt) : "No submissions yet";

  return (
    <div className="applications-page">
      <header className="applications-header">
        <Link className="brand" href="/" aria-label="Wonderhow home"><span className="brand-mark" aria-hidden="true">W</span><span>Wonderhow</span></Link>
        <span>Application manager</span>
        <Link href="/careers">View careers page ↗</Link>
      </header>

      <main className="applications-main">
        <section className="applications-heading">
          <div><p>Recruitment · Submissions</p><h1>Applications</h1><span>Review the application metadata received through the careers form.</span></div>
          <div className="applications-summary"><div><span>Total applications</span><strong>{applications.length.toString().padStart(2, "0")}</strong></div><div><span>Latest submission</span><strong>{latestDate}</strong></div></div>
        </section>

        <section className="applications-list" aria-label="Submitted applications">
          <div className="applications-list-head"><span>Applicant</span><span>Location</span><span>Received</span><span>Status</span><span aria-hidden="true" /></div>
          {applications.length === 0 ? (
            <div className="applications-empty"><span>✦</span><h2>No applications yet</h2><p>New submissions from the careers form will appear here automatically.</p><Link href="/careers">Open careers page</Link></div>
          ) : applications.map((application, index) => {
            const fullName = `${application.firstName} ${application.lastName}`.trim() || "Unnamed applicant";
            return (
              <details className="application-list-item" key={application.id} open={index === 0}>
                <summary>
                  <span className="applicant-cell"><i>{application.firstName?.[0]}{application.lastName?.[0]}</i><span><strong>{fullName}</strong><small>{application.email}</small></span></span>
                  <span>{application.cityState || "Not provided"}</span>
                  <span>{formatDate(application.receivedAt)}</span>
                  <span><b>New</b></span>
                  <span className="application-chevron">⌄</span>
                </summary>
                <div className="application-detail">
                  <div className="application-detail-top"><div><span>Application details</span><h2>{fullName}</h2></div><a href={`mailto:${application.email}`}>Contact applicant ↗</a></div>
                  <dl>
                    <DetailRow label="Email" value={application.email} href={`mailto:${application.email}`} />
                    <DetailRow label="Role" value={application.role} />
                    <DetailRow label="City and state" value={application.cityState} />
                    <DetailRow label="Internet provider" value={application.internetProvider} />
                    <DetailRow label="Download speed" value={application.downloadSpeed ? `${application.downloadSpeed} Mbps` : ""} />
                    <DetailRow label="Upload speed" value={application.uploadSpeed ? `${application.uploadSpeed} Mbps` : ""} />
                    <DetailRow label="Secure location" value={application.secureLocation} />
                    <DetailRow label="Availability" value={application.availability} />
                    <DetailRow label="Portfolio" value={application.portfolio} href={application.portfolio} />
                    <DetailRow label="LinkedIn" value={application.linkedin} href={application.linkedin} />
                    <DetailRow label="Message" value={application.message} />
                    <DetailRow label="Résumé" value={application.resumeOriginalName} />
                    <DetailRow label="Application ID" value={application.id} />
                  </dl>
                </div>
              </details>
            );
          })}
        </section>
      </main>
    </div>
  );
}
