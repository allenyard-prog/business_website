"use client";

import { FormEvent, useRef, useState } from "react";

type JobFormConfig = {
  id: string;
  title: string;
  requireResume: boolean;
  requireAddress: boolean;
  requirePhone: boolean;
  requireMessage: boolean;
  collectHostingDetails: boolean;
};

export default function CareerApplicationForm({ job }: { job: JobFormConfig }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/applications", { method: "POST", body: new FormData(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not send your application.");
      form.reset();
      setFileName("");
      setStatus("success");
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return <div className="career-success" role="status"><span>✓</span><p className="career-section-number">Application received</p><h3>Thank you for applying.</h3><p>We&apos;ve received your application for {job.title}. If there is a strong fit, we&apos;ll be in touch.</p><button type="button" onClick={() => setStatus("idle")}>Submit another application →</button></div>;
  }

  return (
    <form ref={formRef} onSubmit={submitApplication} encType="multipart/form-data">
      <input type="hidden" name="jobId" value={job.id} />
      <div className="greenhouse-heading"><div><span>Application form</span><h3>Your information</h3></div><b>Required fields *</b></div>
      <div className="greenhouse-row"><label>First name *<input name="firstName" autoComplete="given-name" required /></label><label>Last name *<input name="lastName" autoComplete="family-name" required /></label></div>
      <label>Email address *<input type="email" name="email" autoComplete="email" required /></label>
      <div className="greenhouse-row"><label>Phone number {job.requirePhone ? "*" : ""}<input type="tel" name="phone" autoComplete="tel" maxLength={30} required={job.requirePhone} /></label><label>Portfolio or LinkedIn<input type="url" name="portfolio" placeholder="https://" /></label></div>
      {job.requireAddress && <label>Full address *<input name="fullAddress" autoComplete="street-address" maxLength={300} required /></label>}
      {job.collectHostingDetails && <><div className="greenhouse-divider"><span>Your setup</span></div><label>Internet provider <span>Optional</span><input name="internetProvider" /></label><div className="greenhouse-row"><label>Download speed <span>Optional</span><div className="speed-input"><input type="number" name="downloadSpeed" min="0" /><span>Mbps</span></div></label><label>Upload speed <span>Optional</span><div className="speed-input"><input type="number" name="uploadSpeed" min="0" /><span>Mbps</span></div></label></div><fieldset><legend>Do you have a secure location with reliable power?</legend><label><input type="radio" name="secureLocation" value="Yes" /> Yes</label><label><input type="radio" name="secureLocation" value="No" /> No</label><label><input type="radio" name="secureLocation" value="Would like to discuss" /> I&apos;d like to discuss</label></fieldset><label>Availability and response time<textarea name="availability" rows={3} maxLength={1000} /></label></>}
      <label>Why are you interested in this role? {job.requireMessage ? "*" : ""}<textarea name="message" rows={4} maxLength={1500} required={job.requireMessage} /></label>
      <label className="application-upload"><input type="file" name="resume" accept=".pdf,.doc,.docx" required={job.requireResume} onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} /><span>↑</span><div><strong>{fileName || `Upload your résumé${job.requireResume ? " *" : ""}`}</strong><small>PDF, DOC, or DOCX · 5MB max</small></div><b>{fileName ? "Change" : "Browse"}</b></label>
      <div className="greenhouse-divider"><span>Confirmation</span></div><label className="greenhouse-checkbox"><input type="checkbox" name="consent" value="yes" required /><span>I agree to Wonderhow storing my information for recruitment purposes. *</span></label>
      {status === "error" && <p className="greenhouse-error" role="alert">{error}</p>}
      <button className="greenhouse-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting application…" : "Submit application →"}</button>
    </form>
  );
}
