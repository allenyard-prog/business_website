import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({ include: { resourceType: { select: { name: true } } }, orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }] });
  return <main className="admin-main"><div className="admin-page-heading"><div><p>Content library</p><h1>Resources</h1><span>Manage categorized content and external resource links.</span></div><Link className="admin-primary" href="/admin/resources/new">New resource</Link></div><section className="admin-table"><div className="admin-table-head admin-resource-grid"><span>Resource</span><span>Type</span><span>Status</span><span>Updated</span><span /></div>{resources.length === 0 ? <div className="admin-empty"><h2>No resources yet</h2><p>Create a resource type first, then add the first resource.</p></div> : resources.map((resource) => <div className="admin-table-row admin-resource-grid" key={resource.id}><div><strong>{resource.title}</strong><small>{resource.summary}</small></div><span>{resource.resourceType.name}</span><span className={`admin-status status-${resource.status}`}>{resource.status}</span><span>{resource.updatedAt.toLocaleDateString("en-US")}</span><Link href={`/admin/resources/${resource.id}`}>Edit →</Link></div>)}</section></main>;
}
