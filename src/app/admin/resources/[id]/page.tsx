import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResourceForm from "../ResourceForm";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const [resource, types] = await Promise.all([prisma.resource.findUnique({ where: { id } }), prisma.resourceType.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } })]);
  if (!resource) notFound();
  return <main className="admin-main"><div className="admin-page-heading"><div><p>Resources</p><h1>Edit resource</h1><span>{resource.title}</span></div>{(await searchParams).saved === "1" && <b className="admin-saved">Changes saved</b>}</div><ResourceForm types={types} resource={resource} /></main>;
}
