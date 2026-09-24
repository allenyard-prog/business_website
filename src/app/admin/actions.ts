"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const jobStatuses = new Set(["draft", "published", "closed", "archived"]);
const applicationStatuses = new Set(["unread", "reviewing", "shortlisted", "interview", "rejected", "hired", "archived"]);
const resourceStatuses = new Set(["draft", "published", "archived"]);
const typeStatuses = new Set(["active", "archived"]);

function value(form: FormData, field: string) { return String(form.get(field) ?? "").trim(); }
function checked(form: FormData, field: string) { return form.get(field) === "on"; }
function order(form: FormData) { const parsed = Number.parseInt(value(form, "displayOrder"), 10); return Number.isFinite(parsed) ? parsed : 0; }
function slug(input: string) { return input.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function optional(form: FormData, field: string) { return value(form, field) || null; }
function validUrl(input: string | null) { if (!input) return null; const parsed = new URL(input); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only HTTP and HTTPS URLs are allowed."); return parsed.toString(); }

function jobData(form: FormData) {
  const title = value(form, "title");
  const jobSlug = slug(value(form, "slug") || title);
  const status = value(form, "status");
  if (!title || !jobSlug || !value(form, "team") || !value(form, "summary") || !value(form, "description") || !value(form, "responsibilities") || !value(form, "requirements") || !value(form, "location") || !value(form, "employmentType")) throw new Error("Complete all required job fields.");
  if (!jobStatuses.has(status)) throw new Error("Invalid job status.");
  const workplaceType = value(form, "workplaceType");
  if (!["remote", "hybrid", "on-site"].includes(workplaceType)) throw new Error("Invalid workplace type.");
  return { title, slug: jobSlug, team: value(form, "team"), summary: value(form, "summary"), description: value(form, "description"), responsibilities: value(form, "responsibilities"), requirements: value(form, "requirements"), location: value(form, "location"), workplaceType, employmentType: value(form, "employmentType"), compensation: optional(form, "compensation"), status, applicationOpen: status === "published" && checked(form, "applicationOpen"), displayOrder: order(form), requireResume: checked(form, "requireResume"), requireAddress: checked(form, "requireAddress"), requirePhone: checked(form, "requirePhone"), requireMessage: checked(form, "requireMessage"), collectHostingDetails: checked(form, "collectHostingDetails"), publishedAt: status === "published" ? new Date() : null };
}

export async function createJob(form: FormData) { const job = await prisma.job.create({ data: jobData(form) }); revalidatePath("/careers"); redirect(`/admin/jobs/${job.id}`); }
export async function updateJob(form: FormData) { const id = value(form, "id"); if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid job."); await prisma.job.update({ where: { id }, data: jobData(form) }); revalidatePath("/careers"); revalidatePath("/admin/jobs"); redirect(`/admin/jobs/${id}?saved=1`); }

export async function updateApplicationStatus(form: FormData) { const id = value(form, "id"); const status = value(form, "status"); if (!/^[0-9a-f-]{36}$/i.test(id) || !applicationStatuses.has(status)) throw new Error("Invalid application update."); await prisma.application.update({ where: { id }, data: { status, archivedAt: status === "archived" ? new Date() : null } }); revalidatePath("/admin/applications"); }
export async function addApplicationNote(form: FormData) { const applicationId = value(form, "applicationId"); const body = value(form, "body"); if (!/^[0-9a-f-]{36}$/i.test(applicationId) || !body || body.length > 3000) throw new Error("Enter a valid note."); await prisma.applicationNote.create({ data: { applicationId, body } }); revalidatePath("/admin/applications"); }

export async function saveResourceType(form: FormData) { const id = value(form, "id"); const name = value(form, "name"); const typeSlug = slug(value(form, "slug") || name); const status = value(form, "status") || "active"; if (!name || !typeSlug || !typeStatuses.has(status)) throw new Error("Enter a valid resource type."); const data = { name, slug: typeSlug, description: optional(form, "description"), displayOrder: order(form), status }; if (id) await prisma.resourceType.update({ where: { id }, data }); else await prisma.resourceType.create({ data }); revalidatePath("/admin/resource-types"); revalidatePath("/admin/resources"); }

export async function saveResource(form: FormData) { const id = value(form, "id"); const title = value(form, "title"); const resourceSlug = slug(value(form, "slug") || title); const resourceTypeId = value(form, "resourceTypeId"); const status = value(form, "status") || "draft"; if (!title || !resourceSlug || !value(form, "summary") || !value(form, "body") || !/^[0-9a-f-]{36}$/i.test(resourceTypeId) || !resourceStatuses.has(status)) throw new Error("Complete all required resource fields."); const data = { resourceTypeId, title, slug: resourceSlug, summary: value(form, "summary"), body: value(form, "body"), externalUrl: validUrl(optional(form, "externalUrl")), coverImageUrl: validUrl(optional(form, "coverImageUrl")), status, displayOrder: order(form), publishedAt: status === "published" ? new Date() : null }; let resourceId = id; if (id) await prisma.resource.update({ where: { id }, data }); else resourceId = (await prisma.resource.create({ data })).id; revalidatePath("/admin/resources"); redirect(`/admin/resources/${resourceId}?saved=1`); }
