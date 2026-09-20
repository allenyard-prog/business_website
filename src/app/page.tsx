"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const services = [
  { number: "01", title: "Product strategy", description: "Turn fuzzy ideas into a focused roadmap your team can actually ship.", tags: ["Discovery", "Roadmaps", "Validation"], image: "/images/product-workflow.png" },
  { number: "02", title: "Cloud & platforms", description: "Build secure, resilient infrastructure that grows with your business.", tags: ["Cloud", "DevOps", "Security"], image: "/images/security-dashboard.png" },
  { number: "03", title: "AI & automation", description: "Put practical AI to work—without adding complexity your business does not need.", tags: ["AI agents", "Workflows", "Integrations"], image: "/images/cloud-platform.png" },
];

const process = [
  { step: "01", title: "Find the signal", body: "We get close to your business, users, and constraints to define the right problem." },
  { step: "02", title: "Make it tangible", body: "We prototype the highest-risk ideas early, building alignment before heavy investment." },
  { step: "03", title: "Ship with momentum", body: "A senior team designs, builds, and iterates in tight loops with you every week." },
];

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg aria-hidden="true" className={diagonal ? "arrow arrow-diagonal" : "arrow"} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export default function Home() {
  const page = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".site-header", { y: -24, opacity: 0, duration: 0.8 })
          .from(".hero-line > span", { yPercent: 110, duration: 1.05, stagger: 0.1 }, "-=0.45")
          .from(".hero-support", { y: 24, opacity: 0, duration: 0.75, stagger: 0.08 }, "-=0.6")
          .from(".signal-card", { y: 40, opacity: 0, rotate: 2, duration: 1 }, "-=0.65");

        gsap.to(".orb-one", { x: 18, y: -16, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(".orb-two", { x: -12, y: 20, duration: 5.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(".signal-path", { strokeDashoffset: 0, duration: 2.2, delay: 0.7, ease: "power2.inOut" });

        gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
          gsap.from(element, { y: 48, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } });
        });

        gsap.from(".service-card", { y: 70, opacity: 0, stagger: 0.12, duration: 0.95, ease: "power3.out", scrollTrigger: { trigger: ".services-grid", start: "top 78%", once: true } });
        gsap.from(".process-item", { x: -35, opacity: 0, stagger: 0.14, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: ".process-list", start: "top 78%", once: true } });
        gsap.to(".process-progress", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".process-list", start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
        gsap.to(".case-visual-inner", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".case-study", start: "top bottom", end: "bottom top", scrub: 0.8 } });
        gsap.from(".mascot-card", { y: 60, opacity: 0, rotate: 2, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".mascot-grid", start: "top 78%", once: true } });
        gsap.to(".hero-media-image", { yPercent: 7, scale: 1.04, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 } });
        gsap.to(".marquee-track", { xPercent: -50, duration: 24, repeat: -1, ease: "none" });
        gsap.to(".cta-mascot", { y: -14, rotate: 1.5, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.from(".cta-visual-card", { x: 70, opacity: 0, rotate: 4, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".cta-section", start: "top 74%", once: true } });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
          const counter = { value: 0 };
          gsap.to(counter, { value: Number(element.dataset.count), duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 88%", once: true }, onUpdate: () => { element.textContent = `${Math.round(counter.value)}${element.dataset.suffix ?? ""}`; } });
        });
      });
    }, page);

    return () => { media.revert(); context.revert(); };
  }, []);

  return (
    <div ref={page} className="page-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Wonderhow home"><span className="brand-mark" aria-hidden="true">W</span><span>Wonderhow</span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#services">What we do</a><a href="#work">Our work</a><a href="#process">Approach</a><a href="/careers">Careers</a></nav>
        <a className="nav-cta" href="mailto:hello@wonderhow.co">Start a project <Arrow /></a>
      </header>

      <main>
        <section className="hero section-pad" id="top">
          <div className="hero-grid" aria-hidden="true" /><div className="orb orb-one" aria-hidden="true" /><div className="orb orb-two" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow hero-support"><span className="status-dot" />Independent software consultancy</p>
            <h1 className="hero-title" aria-label="From wondering how to knowing what’s next.">
              <span className="hero-line"><span>From wondering how</span></span>
              <span className="hero-line hero-line-accent"><span>to knowing what&apos;s next.</span></span>
            </h1>
            <div className="hero-bottom">
              <p className="hero-intro hero-support">We help ambitious teams turn complex challenges into useful, lovable software.</p>
              <a className="primary-button hero-support" href="mailto:hello@wonderhow.co">Tell us what you&apos;re building <Arrow /></a>
            </div>
          </div>

          <div className="signal-card hero-media" aria-label="Wonderhow product and cloud software showcase">
            <Image className="hero-media-image" src="/images/product-workflow.png" alt="A bright 3D workspace showing a connected product workflow" fill priority sizes="(max-width: 980px) 90vw, 46vw" />
            <div className="hero-media-badge"><span className="live-pill"><i /> Building what&apos;s next</span><strong>01</strong></div>
          </div>
          <div className="scroll-cue" aria-hidden="true"><span>Scroll to explore</span><i /></div>
        </section>

        <section className="logo-strip" aria-label="Companies we work with">
          <p>Trusted to make the complicated clear</p><div className="logo-row"><span>MONUMENT</span><span>Fieldnote</span><span>Northstar</span><span className="logo-serif">Common&Co.</span><span>VANTAGE</span></div>
        </section>

        <section className="services section-pad" id="services">
          <div className="section-heading reveal"><p className="eyebrow">What we do</p><h2>Clarity at every stage.<br />Craft in every detail.</h2><p className="section-lede">From first sketch to scaled product, we bring senior thinking and hands-on delivery.</p></div>
          <div className="services-grid">
            {services.map((service) => <article className="service-card" key={service.number}>
              <div className="service-image"><Image src={service.image} alt="" fill sizes="(max-width: 980px) 100vw, 33vw" /></div>
              <div className="service-top"><span>{service.number}</span><span className="service-icon"><Arrow diagonal /></span></div>
              <div><h3>{service.title}</h3><p>{service.description}</p></div>
              <ul aria-label={`${service.title} capabilities`}>{service.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </article>)}
          </div>
        </section>

        <section className="case-study section-pad" id="work">
          <div className="case-content reveal">
            <p className="eyebrow eyebrow-light">Featured partnership</p><h2>Making care feel connected.</h2>
            <p>We helped a growing health network replace fragmented tools with one calm, human platform—for patients, clinicians, and the teams behind them.</p>
            <a className="text-link" href="mailto:hello@wonderhow.co?subject=Tell me about your work">Explore the work <Arrow /></a>
            <div className="case-stats"><div><strong data-count="42" data-suffix="%">42%</strong><span>faster onboarding</span></div><div><strong data-count="3" data-suffix="×">3×</strong><span>team adoption</span></div></div>
          </div>
          <div className="case-visual" aria-label="Connected cloud infrastructure"><div className="case-visual-inner"><Image src="/images/cloud-infrastructure.png" alt="Cloud platform connected to infrastructure around the world" fill sizes="(max-width: 980px) 100vw, 60vw" /></div><div className="floating-note"><span>Platform reliability</span><strong>99.9%</strong><small>Always ready to scale</small></div></div>
        </section>

        <section className="process section-pad" id="process">
          <div className="process-intro reveal"><p className="eyebrow">How we work</p><h2>Small team.<br />Big momentum.</h2><p>No black boxes or big-agency layers. You work directly with the people doing the work, from day one to launch day.</p></div>
          <div className="process-list"><span className="process-rail"><i className="process-progress" /></span>{process.map((item) => <article className="process-item" key={item.step}><span>{item.step}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
        </section>

        <section className="mascot-section section-pad">
          <div className="mascot-heading reveal"><p className="eyebrow">Meet the herd</p><h2>Different minds.<br />One curious team.</h2><p>Strategy, design, engineering, and AI expertise—all moving in the same direction.</p></div>
          <div className="mascot-grid">
            <article className="mascot-card"><Image src="/images/mascot-developer.png" alt="Wonderhow developer elephant working with code" fill sizes="(max-width: 700px) 100vw, 25vw" /><span>Engineering</span></article>
            <article className="mascot-card"><Image src="/images/mascot-cloud.png" alt="Wonderhow cloud engineer elephant" fill sizes="(max-width: 700px) 100vw, 25vw" /><span>Cloud</span></article>
            <article className="mascot-card"><Image src="/images/mascot-designer.png" alt="Wonderhow product designer elephant" fill sizes="(max-width: 700px) 100vw, 25vw" /><span>Product design</span></article>
            <article className="mascot-card"><Image src="/images/mascot-ai.png" alt="Wonderhow AI specialist elephant" fill sizes="(max-width: 700px) 100vw, 25vw" /><span>Applied AI</span></article>
          </div>
        </section>

        <section className="quote-section section-pad"><div className="quote-mark reveal">“</div><blockquote className="reveal">Wonderhow didn&apos;t just build what we asked for. They helped us see what the product could become—and then got us there faster than we thought possible.</blockquote><div className="quote-author reveal"><span>MJ</span><p><strong>Maya Jensen</strong><small>VP Product, Northstar</small></p></div></section>

        <div className="closing-marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>Strategy <i>✦</i> Design <i>✦</i> Engineering <i>✦</i> Cloud <i>✦</i> Applied AI <i>✦</i></span>
            <span>Strategy <i>✦</i> Design <i>✦</i> Engineering <i>✦</i> Cloud <i>✦</i> Applied AI <i>✦</i></span>
          </div>
        </div>

        <section className="cta-section section-pad">
          <div className="cta-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="cta-copy">
            <p className="eyebrow reveal"><span className="availability-dot" />Taking on new projects</p>
            <h2 className="reveal">Let&apos;s build the thing<br />you can&apos;t stop thinking about.</h2>
            <p className="cta-lede reveal">Bring us the knotty problem, the half-formed idea, or the product ready for its next leap. We&apos;ll help you find the clearest way forward.</p>
            <div className="cta-actions reveal">
              <a className="cta-button" href="mailto:hello@wonderhow.co?subject=Let&apos;s build something">Start a conversation <Arrow /></a>
              <span>Usually replies<br />within one business day</span>
            </div>
          </div>
          <div className="cta-visual-card">
            <div className="cta-card-top"><span>Your idea</span><span>Wonderhow</span></div>
            <div className="cta-mascot"><Image src="/images/mascot-ai.png" alt="Wonderhow elephant holding an AI network" fill sizes="(max-width: 800px) 80vw, 38vw" /></div>
            <div className="cta-float cta-float-one"><i>01</i><span>Share<br />the challenge</span></div>
            <div className="cta-float cta-float-two"><i>02</i><span>Find the<br />possibility</span></div>
          </div>
        </section>

      </main>

      <footer className="footer section-pad">
        <div className="footer-main">
          <div className="footer-brand"><a className="brand brand-light" href="#top"><span className="brand-mark">W</span><span>Wonderhow</span></a><p>Curious minds building useful software for what&apos;s next.</p><a className="footer-email" href="mailto:hello@wonderhow.co">hello@wonderhow.co <Arrow /></a></div>
          <nav className="footer-links" aria-label="Footer navigation">
            <div><span>Explore</span><a href="#services">What we do</a><a href="#work">Our work</a><a href="#process">Our approach</a></div>
            <div><span>Expertise</span><a href="#services">Product strategy</a><a href="#services">Cloud platforms</a><a href="#services">Applied AI</a></div>
            <div><span>Say hello</span><a href="mailto:hello@wonderhow.co?subject=Project enquiry">Start a project</a><a href="mailto:hello@wonderhow.co?subject=Coffee with Wonderhow">Grab a coffee</a><a href="#top">Back to top ↑</a></div>
          </nav>
        </div>
        <div className="footer-wordmark" aria-hidden="true">Wonderhow</div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Wonderhow Studio</span><span>Made with curiosity</span><span>Privacy · Terms</span></div>
      </footer>
    </div>
  );
}
