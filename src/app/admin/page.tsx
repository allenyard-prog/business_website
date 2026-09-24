import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const [openJobs, unreadApplications, resourceTypes, resources] = await Promise.all([
    prisma.job.count({ where: { status: "published", applicationOpen: true } }),
    prisma.application.count({ where: { status: "unread" } }),
    prisma.resourceType.count({ where: { status: "active" } }),
    prisma.resource.count({ where: { status: "published" } }),
  ]);
  const cards = [
    ["Open jobs", openJobs, "/admin/jobs", "Create and publish positions"],
    ["Unread applications", unreadApplications, "/admin/applications", "Review new candidates"],
    ["Resource types", resourceTypes, "/admin/resource-types", "Organize your library"],
    ["Published resources", resources, "/admin/resources", "Manage useful content"],
  ] as const;
  return <main className="admin-main"><div className="admin-page-heading"><div><p>Overview</p><h1>Good to see you.</h1><span>Manage careers, candidates, and resources from one place.</span></div></div><section className="admin-stat-grid">{cards.map(([label, value, href, note]) => <Link href={href} key={href}><span>{label}</span><strong>{value}</strong><p>{note}</p><b>Open →</b></Link>)}</section></main>;
}
