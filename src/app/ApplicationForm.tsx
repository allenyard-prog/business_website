"use client";

import { FormEvent, useRef, useState } from "react";

const Arrow = () => (
  <svg aria-hidden="true" className="arrow" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export default function ApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: new FormData(form),
      });
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

  function startAnother() {
    setStatus("idle");
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>("input")?.focus());
  }

  return (
    <section className="application-section section-pad" id="apply">
      <div className="application-intro">
        <p className="eyebrow"><span className="application-dot" />Join the herd</p>
        <h2>Do work that makes<br /><em>people wonder how.</em></h2>
        <p>We&apos;re always looking for thoughtful people who care about useful technology and beautifully made work. Tell us where you shine.</p>
        <div className="application-steps" aria-label="Hiring process">
          <span><i>01</i>Apply</span><b>→</b><span><i>02</i>Meet</span><b>→</b><span><i>03</i>Make</span>
        </div>
      </div>

      <div className="application-card">
        {status === "success" ? (
          <div className="application-success" role="status">
            <span className="success-check">✓</span>
            <p className="eyebrow">Application received</p>
            <h3>Thanks for saying hello.</h3>
            <p>We&apos;ll review your application and get in touch if there&apos;s a strong fit.</p>
            <button type="button" className="application-submit" onClick={startAnother}>Send another <Arrow /></button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="application-card-heading"><div><span>Application</span><h3>Tell us about you</h3></div><b>✦</b></div>
            <div className="application-row">
              <label>First name<input name="firstName" autoComplete="given-name" placeholder="Alex" required /></label>
              <label>Last name<input name="lastName" autoComplete="family-name" placeholder="Morgan" required /></label>
            </div>
            <label>Email address<input type="email" name="email" autoComplete="email" placeholder="alex@example.com" required /></label>
            <label>What kind of role interests you?
              <select name="role" defaultValue="" required>
                <option value="" disabled>Select a discipline</option>
                <option>Product strategy</option><option>Product design</option><option>Software engineering</option><option>Cloud &amp; DevOps</option><option>Applied AI</option><option>Something else</option>
              </select>
            </label>
            <label>Portfolio or LinkedIn<input type="url" name="portfolio" placeholder="https://" required /></label>
            <label>Why Wonderhow?<textarea name="message" rows={4} maxLength={1500} placeholder="A few honest sentences is perfect." required /></label>
            <label className="application-upload">
              <input type="file" name="resume" accept=".pdf,.doc,.docx" required onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} />
              <span>↑</span><div><strong>{fileName || "Upload your résumé"}</strong><small>PDF, DOC, or DOCX · 5MB max</small></div><b>{fileName ? "Change" : "Browse"}</b>
            </label>
            <label className="application-consent"><input type="checkbox" name="consent" value="yes" required /><span>I agree to Wonderhow storing my information for recruitment purposes.</span></label>
            {status === "error" && <p className="application-error" role="alert">{error}</p>}
            <button className="application-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : <>Send application <Arrow /></>}</button>
          </form>
        )}
      </div>
    </section>
  );
}
