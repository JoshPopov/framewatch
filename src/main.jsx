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
  { icon: '↗', ghost: '10×', headline: '10× Volume', title: 'Explosive Growth', copy: 'AI tooling has accelerated abuse creation and distribution, increasing malicious volume by over 1,000%.' },
  { icon: '◎', ghost: '24/7', headline: '24/7', title: 'Placeholder Coverage Metric', copy: 'Placeholder: Continuous monitoring coverage placeholder text for additional trust indicator and future reporting data.' }
];

const featurePoints = [
  { step: '01', title: 'Continuous Global Surveillance', body: 'Our detection rails watch known mirror sites, search surfaces, and repost channels in real-time across thousands of endpoints.' },
  { step: '02', title: 'Automated Strike Pipeline', body: 'Every confirmed match enters a notice stream with platform-specific templates and auto escalation timers.' },
  { step: '03', title: 'Live Clearance Feedback', body: 'As assets are removed, your dashboard updates status and confidence so response teams can stay focused.' }
];

const streamRows = [
  ['portrait-feed-983', 'ugc-sync-441', 'mirror-archive-72', 'faceclip-20', 'live-share-998', 'leakdump-511'],
  ['voice-sample-077', 'seed-video-551', 'framepack-301', 'clonepool-014', 'repost-node-822', 'crawl-index-419'],
  ['dumpboard-291', 'tagged-cut-114', 'fakecast-665', 'region-cache-742', 'hash-match-502', 'clipchain-039'],
  ['source-hub-811', 'takedown-log-230', 'scrape-batch-095', 'alert-cache-474', 'queue-run-123', 'drift-copy-954'],
  ['biometric-hold-604', 'threat-frame-410', 'voicefork-052', 'node-relay-283', 'counterfeed-735', 'audit-drop-168'],
  ['mirror-feed-540', 'rapid-spread-914', 'multicast-221', 'media-loop-366', 'danger-index-841', 'tracker-run-014']
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
    duration: `${9 + Math.random() * 14}s`,
    delay: `${-Math.random() * 12}s`,
    top: `${Math.random() < 0.24 ? 8 + Math.random() * 22 : 46 + Math.random() * 54}%`,
    left: `${Math.random() * 100}%`,
    xDrift: `${-32 + Math.random() * 64}px`,
    yDrift: `${-42 + Math.random() * 84}px`,
    opacity: 0.15 + Math.random() * 0.3
  })), []);

  const [cells, setCells] = useState(initialCells);

  useEffect(() => {
    const timeouts = new Set();

    const timer = setInterval(() => {
      const fadingIds = new Set();

      setCells((prev) => {
        const next = [...prev];

        for (let i = 0; i < 12; i += 1) {
          const idx = Math.floor(Math.random() * next.length);
          fadingIds.add(next[idx].id);
          next[idx] = {
            ...next[idx],
            opacity: 0.02
          };
        }

        return next;
      });

      const timeoutId = setTimeout(() => {
        setCells((prev) => prev.map((cell) => {
          if (!fadingIds.has(cell.id)) return cell;

          return {
            ...cell,
            text: MATRIX_SNIPPETS[Math.floor(Math.random() * MATRIX_SNIPPETS.length)],
            color: MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)],
            opacity: 0.14 + Math.random() * 0.32,
            duration: `${8 + Math.random() * 15}s`,
            xDrift: `${-38 + Math.random() * 76}px`,
            yDrift: `${-50 + Math.random() * 100}px`
          };
        }));
        timeouts.delete(timeoutId);
      }, 640);

      timeouts.add(timeoutId);
    }, 900);

    return () => {
      clearInterval(timer);
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
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
              opacity: cell.opacity,
              top: cell.top,
              left: cell.left,
              '--dur': cell.duration,
              '--delay': cell.delay,
              '--drift-x': cell.xDrift,
              '--drift-y': cell.yDrift
            }}
          >
            {cell.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function TakedownStreams() {
  return (
    <div className="stream-wall" aria-hidden="true">
      {streamRows.map((row, rowIdx) => (
        <div key={`row-${rowIdx}`} className={`stream-row ${rowIdx % 2 ? 'reverse' : ''}`}>
          <div className="stream-track">
            {[...row, ...row].map((label, itemIdx) => {
              return (
                <article key={`${label}-${itemIdx}`} className="stream-card">
                  <div className="stream-media">
                    <span className="scan-line"></span>
                  </div>
                  <p>{label}</p>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  useReveal();

  const isWindows = useMemo(() => {
    const platform = navigator.userAgentData?.platform || navigator.platform || "";
    return /win/i.test(platform);
  }, []);

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
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <button className="btn btn-login">Login</button>
      </header>

      <main>
        <section id="home" className="hero">
          <MatrixGrid />
          <div className="hero-content hero-intro">
            <p className="hero-badge"><span className="pulse-dot"></span> AUTOMATED IDENTITY DEFENSE v2.0</p>
            <h1>Your Face.<br /><span>Your Control.</span></h1>
            <p className="lead">If someone is using your face or voice without consent.<br />We help you find it, and take it down.</p>
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
          <TakedownStreams />
          <div className="feature-overlay"></div>
          <div className="feature-content">
            <p className="eyebrow reveal" data-reveal>OUR METHODOLOGY</p>
            <h2 className="title reveal" data-reveal>We exist to change that.</h2>
            <div className="feature-list">
              {featurePoints.map((feature) => (
                <article key={feature.title} className="feature-step reveal" data-reveal>
                  <span>{feature.step}</span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
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

        <footer className="site-footer">
          <div className="footer-glass-row">
            <small>© 2026 FrameWatch. All rights reserved.</small>
            <span className="footer-sep" aria-hidden="true"></span>
            <small>Made in Canada <span className="ca-flag" aria-hidden="true">{isWindows ? "🍁" : "🇨🇦"}</span></small>
          </div>
        </footer>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
