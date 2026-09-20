import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const allowedResumeTypes = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);

function optionalString(form: FormData, field: string) {
  const value = String(form.get(field) ?? "").trim();
  return value || null;
}

function optionalInteger(form: FormData, field: string) {
  const value = String(form.get(field) ?? "").trim();
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    for (const field of ["firstName", "lastName", "email", "consent"]) {
      if (!String(form.get(field) ?? "").trim()) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    const role = String(form.get("role") || "General application");
    const isHostingRole = role.startsWith("U.S.-Based Hosting");
    if (!isHostingRole && !String(form.get("message") ?? "").trim()) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    const resume = form.get("resume");
    const hasResume = resume instanceof File && resume.size > 0;
    if (!isHostingRole && !hasResume) return NextResponse.json({ error: "Please attach your résumé." }, { status: 400 });
    if (hasResume && resume.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Your résumé must be smaller than 5MB." }, { status: 413 });
    if (hasResume && !allowedResumeTypes.has(resume.type)) return NextResponse.json({ error: "Please upload a PDF, DOC, or DOCX file." }, { status: 415 });

    const application = await prisma.application.create({
      data: {
        role,
        firstName: String(form.get("firstName")).trim(),
        lastName: String(form.get("lastName")).trim(),
        email: String(form.get("email")).trim().toLowerCase(),
        portfolio: optionalString(form, "portfolio"),
        linkedin: optionalString(form, "linkedin"),
        message: optionalString(form, "message"),
        cityState: optionalString(form, "cityState"),
        internetProvider: optionalString(form, "internetProvider"),
        downloadSpeed: optionalInteger(form, "downloadSpeed"),
        uploadSpeed: optionalInteger(form, "uploadSpeed"),
        secureLocation: optionalString(form, "secureLocation"),
        availability: optionalString(form, "availability"),
        resumeOriginalName: hasResume ? resume.name : null,
        consent: true,
        status: "unread",
      },
    });

    return NextResponse.json({ ok: true, applicationId: application.id }, { status: 201 });
  } catch (error) {
    console.error("Application submission failed", error);
    return NextResponse.json({ error: "We could not receive your application. Please try again." }, { status: 500 });
  }
}
