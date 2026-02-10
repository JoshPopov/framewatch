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
    top: `${Math.random() < 0.38 ? 7 + Math.random() * 29 : 45 + Math.random() * 55}%`,
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

function ExplodedRebuildSection() {
  const sectionRef = React.useRef(null);
  const [progress, setProgress] = useState(0);
  const visualProgressRef = React.useRef(0);
  const targetProgressRef = React.useRef(0);
  const rafRef = React.useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const navOffset = 86;
    const touchState = { y: null };

    const getCenterDelta = () => {
      const rect = section.getBoundingClientRect();
      return (rect.top + (rect.height / 2)) - (window.innerHeight / 2);
    };

    const centerLockThreshold = 72;

    const isWithinStage = () => {
      const rect = section.getBoundingClientRect();
      return rect.top <= navOffset + 12 && rect.bottom >= window.innerHeight - 12;
    };

    const keepSectionCentered = () => {
      const centerTarget = window.scrollY + getCenterDelta();
      window.scrollTo({ top: centerTarget, behavior: 'auto' });
    };

    const animateProgress = () => {
      const current = visualProgressRef.current;
      const target = targetProgressRef.current;
      const next = current + ((target - current) * 0.18);
      const settled = Math.abs(target - next) < 0.0005;
      const finalValue = settled ? target : next;

      visualProgressRef.current = finalValue;
      setProgress(finalValue);

      if (!settled) {
        rafRef.current = requestAnimationFrame(animateProgress);
      } else {
        rafRef.current = null;
      }
    };

    const queueProgressAnimation = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(animateProgress);
    };

    const advanceProgress = (delta) => {
      const nextTarget = Math.min(1, Math.max(0, targetProgressRef.current + (delta * 0.00085)));
      targetProgressRef.current = nextTarget;
      queueProgressAnimation();
    };

    const shouldIntercept = (delta) => {
      if (!isWithinStage()) return false;

      const centerDelta = getCenterDelta();
      if (Math.abs(centerDelta) > centerLockThreshold) {
        if ((delta > 0 && targetProgressRef.current < 0.999) || (delta < 0 && targetProgressRef.current > 0.001)) {
          keepSectionCentered();
          return true;
        }
        return false;
      }

      return (delta > 0 && targetProgressRef.current < 0.999) || (delta < 0 && targetProgressRef.current > 0.001);
    };

    const onWheel = (event) => {
      const delta = event.deltaY;
      if (!shouldIntercept(delta)) return;

      event.preventDefault();
      advanceProgress(delta);
      keepSectionCentered();
    };

    const onKeyDown = (event) => {
      const map = {
        ArrowDown: 110,
        PageDown: 220,
        ' ': 170,
        ArrowUp: -110,
        PageUp: -220
      };

      if (!(event.key in map)) return;
      const delta = map[event.key];
      if (!shouldIntercept(delta)) return;

      event.preventDefault();
      advanceProgress(delta);
      keepSectionCentered();
    };

    const onTouchStart = (event) => {
      touchState.y = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event) => {
      if (touchState.y === null) return;

      const y = event.touches[0]?.clientY ?? touchState.y;
      const delta = (touchState.y - y) * 1.4;
      touchState.y = y;

      if (!shouldIntercept(delta)) return;

      event.preventDefault();
      advanceProgress(delta);
      keepSectionCentered();
    };

    const onTouchEnd = () => {
      touchState.y = null;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div ref={sectionRef} className="exploded-section">
      <div className="exploded-sticky">
        <div className="exploded-heading">
          <p className="eyebrow">SOCIAL THREAT BREAKDOWN</p>
          <h2 className="title">From One Mockup to Full Platform Control</h2>
        </div>

        <div className="mockup-stage" style={{ '--progress': progress }}>
          <article className="mock-piece piece-frame"></article>
          <article className="mock-piece piece-cover"><span>COVER</span><i></i></article>
          <article className="mock-piece piece-meta">
            <span>POST INFO</span>
            <h3>@luna.orchestra</h3>
            <p>Midnight Echoes • Reel</p>
            <b></b>
          </article>
          <article className="mock-piece piece-video"></article>
          <article className="mock-piece piece-actions"><span>♡</span><span>💬</span><span>↗</span><span>♪</span></article>
          <article className="mock-piece piece-wave">
            <div>{Array.from({ length: 26 }, (_, i) => <i key={i}></i>)}</div>
          </article>
          <article className="mock-piece piece-controls"><span>⏮</span><b>▶</b><span>⏭</span></article>
          <article className="mock-piece piece-pill">IG + TT UI</article>
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
        <div className="brand" aria-label="FrameWatch">
          <span className="brand-mark" aria-hidden="true"><i></i></span>
          <span className="brand-word"><b>Frame</b><strong>Watch</strong></span>
        </div>
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
          <ExplodedRebuildSection />
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
