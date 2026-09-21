import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateApplicationStatus } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Applications | Wonderhow",
  description: "Review submitted job applications.",
  robots: { index: false, follow: false },
};

type ApplicationRecord = {
  id: string;
  receivedAt: Date;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  fullAddress: string | null;
  phone: string | null;
  internetProvider: string | null;
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  secureLocation: string | null;
  availability: string | null;
  portfolio: string | null;
  linkedin: string | null;
  message: string | null;
  resumeOriginalName: string | null;
  status: string;
};

type StatusFilter = "all" | "unread" | "read";

async function getApplications(status: StatusFilter): Promise<ApplicationRecord[]> {
  return prisma.application.findMany({
    where: status === "all" ? undefined : { status },
    orderBy: { receivedAt: "desc" },
  });
}

function formatDate(value: Date | string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(date);
}

function DetailRow({ label, value, href }: { label: string; value?: string | number | null; href?: string }) {
  if (value === null || value === undefined || value === "") return null;
  return <div className="application-detail-row"><dt>{label}</dt><dd>{href ? <a href={href}>{value}</a> : value}</dd></div>;
}

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const requestedStatus = (await searchParams).status;
  const activeStatus: StatusFilter = requestedStatus === "all" || requestedStatus === "read" ? requestedStatus : "unread";
  const [applications, totalCount, unreadCount, readCount] = await Promise.all([
    getApplications(activeStatus),
    prisma.application.count(),
    prisma.application.count({ where: { status: "unread" } }),
    prisma.application.count({ where: { status: "read" } }),
  ]);
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
          <div><p>Recruitment · Submissions</p><h1>Applications</h1><span>Review the application data received through the careers form.</span></div>
          <div className="applications-summary"><div><span>Total applications</span><strong>{totalCount.toString().padStart(2, "0")}</strong></div><div><span>Latest in view</span><strong>{latestDate}</strong></div></div>
        </section>

        <nav className="application-tabs" aria-label="Application status filters">
          <Link className={`unread-tab${activeStatus === "unread" ? " active" : ""}`} href="/applications"><span>Unread</span>{unreadCount > 0 && <b aria-label={`${unreadCount} unread applications`}>{unreadCount}</b>}</Link>
          <Link className={activeStatus === "all" ? "active" : ""} href="/applications?status=all"><span>All</span><b>{totalCount}</b></Link>
          <Link className={activeStatus === "read" ? "active" : ""} href="/applications?status=read"><span>Marked as read</span><b>{readCount}</b></Link>
        </nav>

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
                  <span>{application.fullAddress || "Not provided"}</span>
                  <span>{formatDate(application.receivedAt)}</span>
                  <span><b className={`status-flag status-${application.status}`}>{application.status === "read" ? "Read" : "Unread"}</b></span>
                  <span className="application-chevron">⌄</span>
                </summary>
                <div className="application-detail">
                  <div className="application-detail-top">
                    <div><span>Application details</span><h2>{fullName}</h2></div>
                    <div className="application-detail-actions">
                      <form action={updateApplicationStatus}>
                        <input type="hidden" name="id" value={application.id} />
                        <input type="hidden" name="status" value={application.status === "read" ? "unread" : "read"} />
                        <button type="submit">Mark as {application.status === "read" ? "unread" : "read"}</button>
                      </form>
                      <a href={`mailto:${application.email}`}>Contact applicant ↗</a>
                    </div>
                  </div>
                  <dl>
                    <DetailRow label="Email" value={application.email} href={`mailto:${application.email}`} />
                    <DetailRow label="Role" value={application.role} />
                    <DetailRow label="Full address" value={application.fullAddress} />
                    <DetailRow label="Phone number" value={application.phone} href={application.phone ? `tel:${application.phone}` : undefined} />
                    <DetailRow label="Internet provider" value={application.internetProvider} />
                    <DetailRow label="Download speed" value={application.downloadSpeed ? `${application.downloadSpeed} Mbps` : ""} />
                    <DetailRow label="Upload speed" value={application.uploadSpeed ? `${application.uploadSpeed} Mbps` : ""} />
                    <DetailRow label="Secure location" value={application.secureLocation} />
                    <DetailRow label="Availability" value={application.availability} />
                    <DetailRow label="Portfolio" value={application.portfolio} href={application.portfolio?.startsWith("http") ? application.portfolio : undefined} />
                    <DetailRow label="LinkedIn" value={application.linkedin} href={application.linkedin?.startsWith("http") ? application.linkedin : undefined} />
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
