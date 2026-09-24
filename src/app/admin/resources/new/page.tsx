import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ResourceForm from "../ResourceForm";

export const dynamic = "force-dynamic";

export default async function NewResourcePage() {
  const types = await prisma.resourceType.findMany({ where: { status: "active" }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } });
  return <main className="admin-main"><div className="admin-page-heading"><div><p>Resources</p><h1>Create a resource</h1><span>Add content or point visitors to a trusted external link.</span></div></div>{types.length === 0 ? <div className="admin-empty"><h2>Create a resource type first</h2><Link href="/admin/resource-types">Manage resource types</Link></div> : <ResourceForm types={types} />}</main>;
}
