"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";

const Arrow = ({ back = false }: { back?: boolean }) => (
  <svg className={back ? "career-arrow career-arrow-back" : "career-arrow"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="m4 9.5 3.1 3L14 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const responsibilities = [
  "Receive and securely set up company-provided laptops and related hosting equipment.",
  "Connect each device to a stable, reliable internet connection.",
  "Keep equipment powered on, connected, secure, and accessible for authorized remote management.",
  "Monitor equipment and promptly report connectivity, power, or hardware issues.",
  "Provide hands-on troubleshooting when an issue cannot be resolved remotely.",
  "Respond to urgent issues, ideally within one to two hours.",
  "Follow all agreed security, privacy, and operating procedures.",
];

const requirements = [
  "You are physically located in the United States.",
  "You have a secure location for company equipment.",
  "You have reliable electricity and high-speed internet.",
  "You understand laptops, networking, routers, remote-access tools, and basic troubleshooting.",
  "You communicate clearly and can offer dependable, real-time availability.",
  "You are interested in a trustworthy, long-term working relationship.",
];

export default function CareersPage() {
  const formRef = useRef<HTMLFormElement>(null);
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
      setStatus("success");
      document.getElementById("application")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="career-page">
      <header className="career-header">
        <Link className="brand" href="/" aria-label="Wonderhow home"><span className="brand-mark" aria-hidden="true">W</span><span>Wonderhow</span></Link>
        <nav aria-label="Careers navigation"><a href="#overview">Overview</a><a href="#compensation">Compensation</a><a href="#application">Application</a></nav>
        <a className="career-header-cta" href="#application">Apply now <Arrow /></a>
      </header>

      <main>
        <section className="career-hero">
          <div className="career-hero-grid" aria-hidden="true" />
          <div className="career-hero-copy">
            <Link className="career-back" href="/"><Arrow back /> Back to Wonderhow</Link>
            <div className="career-status"><span /> Open role · United States</div>
            <p className="career-team">Operations · Remote</p>
            <h1>U.S.-Based Hosting<br /><em>Equipment Manager</em></h1>
            <p className="career-subtitle">A reliable, long-term technical support partner helping us expand our U.S. hosting network—one secure location at a time.</p>
            <div className="career-hero-actions"><a className="career-primary-button" href="#application">Apply for this role <Arrow /></a><span>Long-term partnership<br />Flexible, on-call work</span></div>
          </div>
          <aside className="career-summary">
            <div className="career-summary-top"><span>Role snapshot</span><b>US</b></div>
            <dl>
              <div><dt>Location</dt><dd>United States</dd></div>
              <div><dt>Work style</dt><dd>Remote / On-site equipment</dd></div>
              <div><dt>Response time</dt><dd>1–2 hours for urgent issues</dd></div>
              <div><dt>Commitment</dt><dd>Long-term collaboration</dd></div>
            </dl>
            <a href="#application">Start your application <Arrow /></a>
          </aside>
        </section>

        <section className="career-content" id="overview">
          <aside className="career-sidebar">
            <span>On this page</span>
            <a href="#about">About the role</a><a href="#responsibilities">Responsibilities</a><a href="#requirements">Requirements</a><a href="#compensation">Compensation</a><a href="#application">Apply</a>
          </aside>
          <div className="career-description">
            <article id="about"><p className="career-section-number">01 · About the role</p><h2>Help keep our growing U.S. network online.</h2><p>Wonderhow began operations in the Philippines and has since expanded into the U.S. market. We currently operate approximately 10 hosting devices in Texas and plan to expand into additional locations across the country to improve availability and reliability.</p><p>We&apos;re looking for someone dependable and technically capable who can securely host company-owned equipment, support authorized remote access, and step in with hands-on help when needed.</p></article>

            <article id="responsibilities"><p className="career-section-number">02 · Responsibilities</p><h2>What you&apos;ll take ownership of.</h2><ul className="career-check-list">{responsibilities.map((item) => <li key={item}><span><Check /></span><p>{item}</p></li>)}</ul></article>

            <article id="requirements"><p className="career-section-number">03 · Requirements</p><h2>What will help you thrive.</h2><ul className="career-check-list">{requirements.map((item) => <li key={item}><span><Check /></span><p>{item}</p></li>)}</ul><div className="career-note"><b>Internet costs</b><p>If an upgraded or dedicated connection is needed, we can discuss covering the cost.</p></div></article>

            <article id="compensation"><p className="career-section-number">04 · Compensation</p><h2>Simple, transparent terms.</h2><div className="compensation-grid"><div><span>Setup</span><strong>$100</strong><p>One-time payment per laptop after it is received, configured, and confirmed operational.</p></div><div><span>Monthly hosting</span><strong>$200</strong><p>Per month for each laptop actively hosted and maintained.</p></div></div><div className="revenue-card"><span>Growth opportunity</span><div><strong>3%–5%</strong><p>For mutually agreed expanded responsibilities, a revenue-sharing opportunity may be offered. Scope, calculation, and payment terms will be documented separately.</p></div></div><p className="career-fine-print">Additional work may become available as the business grows.</p></article>
          </div>
        </section>

        <section className="career-apply" id="application">
          <div className="career-apply-intro"><p className="career-section-number">05 · Apply</p><h2>Ready to build<br /><em>with us?</em></h2><p>Tell us about your location, setup, and experience. We review every complete application.</p><div className="application-process"><span><b>1</b>Apply</span><i>→</i><span><b>2</b>Intro call</span><i>→</i><span><b>3</b>Setup review</span></div></div>

          <div className="greenhouse-card">
            {status === "success" ? (
              <div className="career-success" role="status"><span><Check /></span><p className="career-section-number">Application received</p><h3>Thank you for applying.</h3><p>We&apos;ve received your details. If your location and setup match our current expansion needs, we&apos;ll be in touch.</p><button type="button" onClick={() => { setStatus("idle"); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>("input")?.focus()); }}>Submit another application <Arrow /></button></div>
            ) : (
              <form ref={formRef} onSubmit={submitApplication} encType="multipart/form-data">
                <input type="hidden" name="role" value="U.S.-Based Hosting Equipment Manager and Real-Time Technical Support Partner" />
                <div className="greenhouse-heading"><div><span>Application form</span><h3>Your information</h3></div><b>Required fields *</b></div>
                <div className="greenhouse-row"><label>First name *<input name="firstName" autoComplete="given-name" required /></label><label>Last name *<input name="lastName" autoComplete="family-name" required /></label></div>
                <label>Email address *<input type="email" name="email" autoComplete="email" required /></label>
                <label>City and state <span>Optional</span><input name="cityState" placeholder="Austin, Texas" /></label>
                <div className="greenhouse-divider"><span>Your setup</span></div>
                <label>Internet provider <span>Optional</span><input name="internetProvider" placeholder="Provider name" /></label>
                <div className="greenhouse-row"><label>Typical download speed <span>Optional</span><div className="speed-input"><input type="number" name="downloadSpeed" min="0" /><span>Mbps</span></div></label><label>Typical upload speed <span>Optional</span><div className="speed-input"><input type="number" name="uploadSpeed" min="0" /><span>Mbps</span></div></label></div>
                <fieldset><legend>Do you have a secure location with reliable power? <span>Optional</span></legend><label><input type="radio" name="secureLocation" value="Yes" /> Yes</label><label><input type="radio" name="secureLocation" value="No" /> No</label><label><input type="radio" name="secureLocation" value="Would like to discuss" /> I&apos;d like to discuss</label></fieldset>
                <label>Availability and response time <span>Optional</span><textarea name="availability" rows={3} maxLength={1000} placeholder="Share your typical schedule and ability to respond within one to two hours." /></label>
                <div className="greenhouse-divider"><span>Confirmation</span></div>
                <label className="greenhouse-checkbox"><input type="checkbox" name="consent" value="yes" required /><span>I am comfortable hosting company-owned equipment, providing authorized remote access and timely hands-on support, and agree to Wonderhow storing my information for recruitment purposes. *</span></label>
                {status === "error" && <p className="greenhouse-error" role="alert">{error}</p>}
                <button className="greenhouse-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting application…" : <>Submit application <Arrow /></>}</button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="career-footer"><Link className="brand brand-light" href="/"><span className="brand-mark">W</span><span>Wonderhow</span></Link><p>Curious minds building useful software for what&apos;s next.</p><a href="mailto:careers@wonderhow.co">careers@wonderhow.co</a></footer>
    </div>
  );
}
