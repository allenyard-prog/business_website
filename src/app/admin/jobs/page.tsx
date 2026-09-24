import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({ include: { _count: { select: { applications: true } } }, orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }] });
  return <main className="admin-main"><div className="admin-page-heading"><div><p>Recruitment</p><h1>Job posts</h1><span>Create, publish, close, and archive positions.</span></div><Link className="admin-primary" href="/admin/jobs/new">New job</Link></div><section className="admin-table"><div className="admin-table-head admin-job-grid"><span>Position</span><span>Status</span><span>Applications</span><span>Updated</span><span /></div>{jobs.length === 0 ? <div className="admin-empty"><h2>No job posts yet</h2><Link href="/admin/jobs/new">Create the first job</Link></div> : jobs.map((job) => <div className="admin-table-row admin-job-grid" key={job.id}><div><strong>{job.title}</strong><small>{job.team} · {job.location}</small></div><span className={`admin-status status-${job.status}`}>{job.status}</span><span>{job._count.applications}</span><span>{job.updatedAt.toLocaleDateString("en-US")}</span><Link href={`/admin/jobs/${job.id}`}>Edit →</Link></div>)}</section></main>;
}
