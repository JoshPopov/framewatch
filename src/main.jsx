import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const MATRIX_SNIPPETS = [
  'NODE_AUTH_BEARER_v2', 'if (match.score > 0.98)', 'payload: { status: "OK" }',
  'stream.pipe(analyzer).on("match", alert)', 'await sync_authority()', 'while (active) monitor()',
  'SCAN_STREAMS_ACTIVE', 'const hash = sha256(bio)', 'ERROR: ACCESS_DENIED',
  'await takedown.send("PLATFORM_A")', 'X: 124.5 Y: 88.2', 'biometric.verify(face_sample)',
  'DELETE FROM nodes WHERE id=?', 'const takedown = new LegalNotice(id);'
];
const MATRIX_COLORS = ['#fb7185', '#0d9488', '#f59e0b', '#0284c7', '#7c3aed'];

const stats = [
  { icon: '⚠', ghost: '90%', headline: '90%+', title: 'Non-Consensual Material', copy: 'Research indicates over 90% of deepfake content appearing on public forums is created without explicit permission.' },
  { icon: '↗', ghost: '10×', headline: '10× Volume', title: 'Explosive Growth', copy: 'AI tooling has accelerated abuse creation and distribution, increasing malicious volume by over 1,000%.' }
];

const features = [
  { step: '01', title: 'Continuous Global Surveillance', body: 'Our proprietary engine monitors over 4,000 public platforms, indexed search surfaces, and known deepfake repositories 24/7.', bullets: ['Biometric Voice Mapping', 'Facial Recognition Scanning'], icon: '◉', iconClass: 'radar' },
  { step: '02', title: 'Rapid Takedown Orchestration', body: 'Automated legal-notice generation and escalation workflows remove malicious media quickly and systematically.', bullets: ['Platform-Specific Notice Templates', 'Priority Escalation Network'], icon: '⬢', iconClass: 'shield' }
];

const plans = [
  { name: 'Individual', detail: 'Personal social monitoring', icon: '◔', tags: ['2 Profiles', 'Weekly Sync', 'Takedowns'], price: '$29', unit: '/MO', cta: 'Select', featured: false },
  { name: 'Professional', detail: 'For creators & public figures', icon: '✦', tags: ['10 Profiles', '24/7 Monitoring', 'Priority Removal', 'Voice Protection'], price: '$89', unit: '/MO', cta: 'Monitor', featured: true },
  { name: 'Enterprise', detail: 'Corporate identity defense', icon: '▦', tags: ['Unlimited Scans', 'Full API Access', 'Dedicated Crisis Mgr'], price: 'Quote', unit: 'Custom', cta: 'Contact', featured: false }
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function MatrixGrid() {
  const initialCells = useMemo(() => Array.from({ length: 72 }, (_, i) => ({
    id: i,
    text: MATRIX_SNIPPETS[Math.floor(Math.random() * MATRIX_SNIPPETS.length)],
    color: MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)],
    duration: `${20 + Math.random() * 20}s`,
    opacity: 0.12 + Math.random() * 0.24
  })), []);

  const [cells, setCells] = useState(initialCells);

  useEffect(() => {
    const timer = setInterval(() => {
      setCells((prev) => {
        const next = [...prev];
        for (let i = 0; i < 8; i += 1) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = {
            ...next[idx],
            opacity: 0.08 + Math.random() * 0.34,
            text: Math.random() > 0.62 ? MATRIX_SNIPPETS[Math.floor(Math.random() * MATRIX_SNIPPETS.length)] : next[idx].text
          };
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="matrix-mask" aria-hidden="true">
      <div className="matrix-grid">
        {cells.map((cell) => (
          <span key={cell.id} className="snippet" style={{ color: cell.color, opacity: cell.opacity, '--dur': cell.duration }}>{cell.text}</span>
        ))}
      </div>
    </div>
  );
}

function App() {
  useReveal();

  useEffect(() => {
    const links = document.querySelectorAll('.glass-nav nav a');

    const handleClick = (event) => {
      const href = event.currentTarget.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const navOffset = 104;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    };

    links.forEach((link) => link.addEventListener('click', handleClick));
    return () => links.forEach((link) => link.removeEventListener('click', handleClick));
  }, []);

  return (
    <>
      <header className="glass-nav">
        <div className="brand"><span>⛨</span> FRAMEWATCH</div>
        <nav>
          <span className="nav-blob" aria-hidden="true"></span>
          <a href="#about">About</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <button className="btn btn-login">Login</button>
      </header>

      <main>
        <section className="hero">
          <MatrixGrid />
          <div className="hero-content reveal" data-reveal>
            <p className="hero-badge"><span className="pulse-dot"></span> AUTOMATED IDENTITY DEFENSE v2.0</p>
            <h1>Your Face.<br /><span>Your Control.</span></h1>
            <p className="lead">If someone is using your face or voice without consent. We help you find it, and take it down.</p>
          </div>
          <div className="chevron" aria-hidden="true">⌄</div>
        </section>

        <section id="about" className="timeline">
          <div className="timeline-line"></div>
          {stats.map((item) => (
            <article key={item.title} className="timeline-item reveal" data-reveal>
              <div className="milestone">{item.icon}</div>
              <div className="ghost">{item.ghost}</div>
              <h2>{item.headline}</h2>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="features">
          <p className="eyebrow reveal" data-reveal>OUR METHODOLOGY</p>
          <h2 className="title reveal" data-reveal>We exist to change that.</h2>

          {features.map((feature, idx) => (
            <article key={feature.title} className={`feature-row reveal ${idx % 2 ? 'reverse' : ''}`} data-reveal>
              <div className="feature-copy">
                <div className="step">{feature.step}</div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
                <ul>{feature.bullets.map((point) => <li key={point}>{point}</li>)}</ul>
              </div>
              <div className={`glass-card icon-card ${feature.iconClass}`}>{feature.icon}</div>
            </article>
          ))}
        </section>

        <section id="pricing" className="pricing">
          <p className="eyebrow reveal" data-reveal>TRANSPARENT SECURITY</p>
          <h2 className="title reveal" data-reveal>Choose Your Protection Level</h2>

          {plans.map((plan) => (
            <article key={plan.name} className={`price-card reveal ${plan.featured ? 'featured' : ''}`} data-reveal>
              {plan.featured ? <span className="popular">MOST POPULAR</span> : null}
              <div className="plan-id"><span className="plan-icon">{plan.icon}</span><div><h3>{plan.name}</h3><p>{plan.detail}</p></div></div>
              <div className="tags">{plan.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="price-cta"><strong>{plan.price}</strong><small>{plan.unit}</small><button className={`btn ${plan.featured ? 'btn-rose' : ''}`}>{plan.cta}</button></div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
