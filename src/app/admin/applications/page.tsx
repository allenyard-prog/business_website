import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statuses = ["all", "unread", "reviewing", "shortlisted", "interview", "rejected", "hired", "archived"];

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string; job?: string; q?: string; page?: string }> }) {
  const query = await searchParams;
  const status = statuses.includes(query.status ?? "") ? query.status! : "unread";
  const jobId = /^[0-9a-f-]{36}$/i.test(query.job ?? "") ? query.job : undefined;
  const q = (query.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
  const pageSize = 30;
  const where = {
    ...(status !== "all" ? { status } : {}),
    ...(jobId ? { jobId } : {}),
    ...(q ? { OR: [{ firstName: { contains: q, mode: "insensitive" as const } }, { lastName: { contains: q, mode: "insensitive" as const } }, { email: { contains: q, mode: "insensitive" as const } }] } : {}),
  };
  const [applications, total, jobs, unread] = await Promise.all([
    prisma.application.findMany({ where, include: { job: { select: { title: true } } }, orderBy: { receivedAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.application.count({ where }),
    prisma.job.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    prisma.application.count({ where: { status: "unread" } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return <main className="admin-main"><div className="admin-page-heading"><div><p>Recruitment</p><h1>Applications</h1><span>Review candidates and move them through your hiring workflow.</span></div><div className="admin-heading-count"><strong>{unread}</strong><span>Unread</span></div></div><form className="admin-filters"><label>Search<input name="q" defaultValue={q} placeholder="Name or email" /></label><label>Job<select name="job" defaultValue={jobId ?? ""}><option value="">All positions</option>{jobs.map((job) => <option value={job.id} key={job.id}>{job.title}</option>)}</select></label><label>Status<select name="status" defaultValue={status}>{statuses.map((item) => <option value={item} key={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label><button type="submit">Filter</button></form><section className="admin-table"><div className="admin-table-head admin-application-grid"><span>Applicant</span><span>Position</span><span>Received</span><span>Status</span><span /></div>{applications.length === 0 ? <div className="admin-empty"><h2>No matching applications</h2><p>Try changing the search or filters.</p></div> : applications.map((application) => <div className="admin-table-row admin-application-grid" key={application.id}><div><strong>{application.firstName} {application.lastName}</strong><small>{application.email}</small></div><span>{application.job.title}</span><span>{application.receivedAt.toLocaleDateString("en-US")}</span><span className={`admin-status status-${application.status}`}>{application.status}</span><Link href={`/admin/applications/${application.id}`}>Review →</Link></div>)}</section>{pages > 1 && <nav className="admin-pagination" aria-label="Application pages"><span>Page {page} of {pages}</span>{page > 1 && <Link href={`?status=${status}&job=${jobId ?? ""}&q=${encodeURIComponent(q)}&page=${page - 1}`}>← Previous</Link>}{page < pages && <Link href={`?status=${status}&job=${jobId ?? ""}&q=${encodeURIComponent(q)}&page=${page + 1}`}>Next →</Link>}</nav>}</main>;
}
