import React, { useEffect, useMemo, useRef, useState } from "react";
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

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'pricing', label: 'Pricing' }
];

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

function useSmoothNavBlob(links) {
  const navRef = useRef(null);
  const [blobStyle, setBlobStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const moveBlobToId = (id, visible = true) => {
    const navEl = navRef.current;
    if (!navEl) return;
    const anchor = navEl.querySelector(`a[href="#${id}"]`);
    if (!anchor) return;
    const navRect = navEl.getBoundingClientRect();
    const rect = anchor.getBoundingClientRect();
    setBlobStyle({
      left: rect.left - navRect.left - 6,
      width: rect.width + 12,
      opacity: visible ? 1 : 0
    });
  };

  useEffect(() => {
    if (!links.length) return;
    const firstId = links[0].id;
    const update = () => moveBlobToId(firstId, true);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [links]);

  const handleNavClick = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: 'smooth' });
    moveBlobToId(id, true);
  };

  return { navRef, blobStyle, handleNavClick, moveBlobToId };
}

function MatrixGrid() {
  const initialCells = useMemo(() => Array.from({ length: 72 }, (_, i) => ({
    id: i,
    text: MATRIX_SNIPPETS[Math.floor(Math.random() * MATRIX_SNIPPETS.length)],
    color: MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)],
    duration: `${22 + Math.random() * 24}s`,
    swayDuration: `${16 + Math.random() * 18}s`,
    xMove: `${10 + Math.random() * 28}px`,
    yMove: `${14 + Math.random() * 32}px`,
    opacity: 0.14 + Math.random() * 0.22
  })), []);

  const [cells, setCells] = useState(initialCells);

  useEffect(() => {
    const timer = setInterval(() => {
      setCells((prev) => {
        const next = [...prev];
        for (let i = 0; i < 10; i += 1) {
          const idx = Math.floor(Math.random() * next.length);
          const current = next[idx];
          next[idx] = {
            ...current,
            opacity: Math.min(0.42, current.opacity + (Math.random() - 0.38) * 0.12),
            text: Math.random() > 0.76 ? MATRIX_SNIPPETS[Math.floor(Math.random() * MATRIX_SNIPPETS.length)] : current.text
          };
        }
        return next;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="matrix-mask" aria-hidden="true">
      <div className="matrix-grid">
        {cells.map((cell) => (
          <span
            key={cell.id}
            className="snippet"
            style={{
              color: cell.color,
              opacity: Math.max(0.08, cell.opacity),
              '--dur': cell.duration,
              '--sway-dur': cell.swayDuration,
              '--x-move': cell.xMove,
              '--y-move': cell.yMove
            }}
          >
            {cell.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function App() {
  useReveal();
  const { navRef, blobStyle, handleNavClick, moveBlobToId } = useSmoothNavBlob(NAV_LINKS);

  return (
    <>
      <header className="glass-nav nav-float-in" data-reveal>
        <div className="brand"><span>⛨</span> FRAMEWATCH</div>
        <nav ref={navRef} className="liquid-nav">
          <span className="nav-blob" style={{ left: blobStyle.left, width: blobStyle.width, opacity: blobStyle.opacity }}></span>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onMouseEnter={() => moveBlobToId(link.id, true)}
              onFocus={() => moveBlobToId(link.id, true)}
              onClick={(event) => handleNavClick(event, link.id)}
            >
              {link.label}
            </a>
          ))}
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
