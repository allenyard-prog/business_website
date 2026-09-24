import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JobForm from "../JobForm";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();
  const saved = (await searchParams).saved === "1";
  return <main className="admin-main"><div className="admin-page-heading"><div><p>Job posts</p><h1>Edit position</h1><span>{job.title}</span></div>{saved && <b className="admin-saved">Changes saved</b>}</div><JobForm job={job} /></main>;
}
