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
  const initialCells = useMemo(() => Array.from({ length: 72 }, (_, i) => {
    // Top Gap Fix: Specifically target the area between nav and text (approx 0-30% vertical)
    const zone = Math.floor(Math.random() * 4);
    let top, left;

    if (zone === 0) { // Top Band (Fill the gap between nav and text)
      top = Math.random() * 30; // 0-30%
      left = Math.random() * 100;
    } else if (zone === 1) { // Bottom Band
      top = 70 + Math.random() * 30; // 70-100%
      left = Math.random() * 100;
    } else if (zone === 2) { // Left Side
      top = Math.random() * 100;
      left = Math.random() * 15; // 0-15%
    } else { // Right Side
      top = Math.random() * 100;
      left = 85 + Math.random() * 15; // 85-100%
    }

    return {
      id: i,
      text: MATRIX_SNIPPETS[Math.floor(Math.random() * MATRIX_SNIPPETS.length)],
      color: MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)],
      duration: `${9 + Math.random() * 14}s`,
      delay: `${-Math.random() * 12}s`,
      top: `${top}%`,
      left: `${left}%`,
      xDrift: `${-32 + Math.random() * 64}px`,
      yDrift: `${-42 + Math.random() * 84}px`,
      opacity: 0.15 + Math.random() * 0.3
    };
  }), []);

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
          next[idx] = { ...next[idx], opacity: 0.02 };
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
      }, 600);
      timeouts.add(timeoutId);
    }, 2800);

    return () => {
      clearInterval(timer);
      timeouts.forEach(clearTimeout);
    };
  }, [initialCells]);

  return (
    <>
      <div className="matrix-mask"></div>
      <div className="matrix-grid">
        {cells.map((cell) => (
          <span
            key={cell.id}
            className="snippet"
            style={{
              color: cell.color,
              top: cell.top,
              left: cell.left,
              opacity: cell.opacity,
              '--dur': cell.duration,
              '--delay': cell.delay,
              '--drift-x': cell.xDrift,
              '--drift-y': cell.yDrift,
            }}
          >
            {cell.text}
          </span>
        ))}
      </div>
    </>
  );
}

function DetectionAlgorithms() {
  return (
    <div className="algo-section">
      <div className="algo-container">
        <div className="algo-content" data-reveal>
          <p className="eyebrow badge-font">How It Works</p>
          <h2 className="algo-title">Detection Algorithms</h2>
          <p className="algo-text">
            Our proprietary multi-modal models analyze standard video feeds in real-time. 
            By decomposing signals into distinct biometric layers, we can identify synthetic 
            artifacts that are invisible to the naked eye.
          </p>
        </div>
        <div className="algo-visual" data-reveal>
          <div className="scan-grid">
            <div className="scan-line"></div>
            <div className="scan-node n1"></div>
            <div className="scan-node n2"></div>
            <div className="scan-node n3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExplodedRebuildSection() {
  useEffect(() => {
    const container = document.querySelector('.exploded-section');
    const sticky = document.querySelector('.exploded-sticky');
    const stage = document.querySelector('.mockup-stage');
    const heading = document.querySelector('.exploded-heading');

    const handleScroll = () => {
      if (!container || !sticky || !stage || !heading) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDist = rect.height - viewportHeight;
      const scrolled = -rect.top;
      const isMobile = window.innerWidth <= 980;

      let startBuffer = viewportHeight * (isMobile ? 0.52 : 0.25);

      if (isMobile) {
        const frame = stage.querySelector('.piece-frame');
        if (frame) {
          const frameRect = frame.getBoundingClientRect();
          const frameCenter = frameRect.top + frameRect.height / 2;
          const viewportCenter = viewportHeight / 2;
          const centerDistance = Math.abs(frameCenter - viewportCenter);
          const alignmentBoost = Math.min(viewportHeight * 0.22, centerDistance * 0.8);
          startBuffer += alignmentBoost;
        }
      }

      const effectiveDist = Math.max(1, totalDist - startBuffer);

      let progress = 0;
      if (scrolled > startBuffer) {
        progress = Math.min(1, (scrolled - startBuffer) / effectiveDist);
      }

      stage.style.setProperty('--progress', progress.toFixed(4));

      const textFadeMultiplier = isMobile ? 2.2 : 3.5;
      const textOpacity = Math.max(0, 1 - (progress * textFadeMultiplier));
      heading.style.opacity = textOpacity.toFixed(2);
      heading.style.transform = `translateY(${progress * -20}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="exploded-section">
      <div className="exploded-sticky">
        <div className="exploded-split-layout">
          <div className="mockup-stage">
            <article className="mock-piece piece-frame"></article>
            <article className="mock-piece piece-cover"><span>Extracted Image</span></article>
            <article className="mock-piece piece-meta">
              <span>Media Info</span>
              <h3>@misa.amane</h3>
              <p>Midnight Echoes • Reel</p>
              <b></b>
            </article>
            <article className="mock-piece piece-video"><span>Hidden Metadata</span></article>
            <article className="mock-piece piece-wave">
              <span>Extracted Audio</span>
              <div className="wave-bars">{Array.from({ length: 26 }, (_, i) => <i key={i}></i>)}</div>
            </article>
            <article className="mock-piece piece-controls">
              <span>Playback Info</span>
              <div className="playback-bar"><div className="playback-progress"></div></div>
              <div className="playback-buttons"><span>⏮</span><b>▶</b><span>⏭</span></div>
            </article>
            <div className="final-message">
              <p className="eyebrow badge-font">Final Report</p>
              <h2 className="title">Complete Analysis</h2>
              <p className="lead">We break content down so you can fully understand what’s happening.</p>
            </div>
          </div>

          <div className="exploded-heading">
            <h2 className="title">Deconstructed Detection</h2>
            <p className="lead">
              We separate every layer of media to verify authenticity. 
              Audio waves, metadata headers, and frame-by-frame pixel density are analyzed in isolation.
            </p>
          </div>
        </div>
      </div>
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
    const links = document.querySelectorAll('.glass-nav nav a, .brand');
    const handleClick = (event) => {
      const anchor = event.currentTarget.closest('a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
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
        <a href="#home" className="brand" aria-label="FrameWatch Home">
          <img src="/logo.png" alt="FrameWatch" className="brand-logo-img" />
        </a>
        <nav>
          <span className="nav-blob" aria-hidden="true"></span>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#cta">Start</a>
        </nav>
        <button className="btn-icon-profile" aria-label="User Profile">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
             <circle cx="12" cy="7" r="4" />
           </svg>
        </button>
      </header>

      <main>
        <section id="home" className="hero">
          <MatrixGrid />
          <div className="hero-content hero-intro">
            <p className="hero-badge"><span className="pulse-dot"></span> AUTOMATED IDENTITY DEFENSE v2.0</p>
            <h1>Your Face.<br /><span>Your Control.</span></h1>
            <p className="lead">If someone is using your face or voice without consent. We'll know about it, and we'll take it down. Instantly.</p>
          </div>
        </section>

        <section id="about" className="timeline">
          <div className="timeline-line"></div>
          {stats.map((item, idx) => (
            <div className="timeline-item" data-reveal key={idx}>
              <div className="milestone">{item.icon}</div>
              <span className="ghost">{item.ghost}</span>
              <h2>{item.headline}</h2>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
          ))}
        </section>

        <section className="features">
          <DetectionAlgorithms />
          <ExplodedRebuildSection />
        </section>

        <section id="cta" className="cta-section">
          <h2 className="title">Ready to check?</h2>
          <button className="cta-button" type="button">Let's do this</button>
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
