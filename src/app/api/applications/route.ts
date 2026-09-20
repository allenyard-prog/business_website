import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const allowedResumeTypes = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);

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

    const id = randomUUID();
    const storageDirectory = path.join(process.cwd(), ".data", "applications", id);
    await mkdir(storageDirectory, { recursive: true });
    if (hasResume) {
      const extension = path.extname(resume.name).toLowerCase();
      await writeFile(path.join(storageDirectory, `resume${extension}`), Buffer.from(await resume.arrayBuffer()));
    }
    const application = {
      id, receivedAt: new Date().toISOString(), role,
      firstName: String(form.get("firstName")), lastName: String(form.get("lastName")), email: String(form.get("email")),
      portfolio: String(form.get("portfolio") ?? ""), linkedin: String(form.get("linkedin") ?? ""), message: String(form.get("message") ?? ""),
      cityState: String(form.get("cityState") ?? ""), internetProvider: String(form.get("internetProvider") ?? ""),
      downloadSpeed: String(form.get("downloadSpeed") ?? ""), uploadSpeed: String(form.get("uploadSpeed") ?? ""),
      secureLocation: String(form.get("secureLocation") ?? ""), availability: String(form.get("availability") ?? ""),
      remoteAccessConsent: String(form.get("remoteAccessConsent") ?? ""), resumeOriginalName: hasResume ? resume.name : "",
    };
    await writeFile(path.join(storageDirectory, "application.json"), JSON.stringify(application, null, 2));

    return NextResponse.json({ ok: true, applicationId: id }, { status: 201 });
  } catch (error) {
    console.error("Application submission failed", error);
    return NextResponse.json({ error: "We could not receive your application. Please try again." }, { status: 500 });
  }
}
