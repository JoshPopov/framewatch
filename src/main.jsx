import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const MATRIX_SNIPPETS = [
  "NODE_AUTH_BEARER_v2",
  "if (match.score > 0.98)",
  'payload: { status: "OK" }',
  'stream.pipe(analyzer).on("match", alert)',
  "await sync_authority()",
  "while (active) monitor()",
  "SCAN_STREAMS_ACTIVE",
  "const hash = sha256(bio)",
  "ERROR: ACCESS_DENIED",
  'await takedown.send("PLATFORM_A")',
  "X: 124.5 Y: 88.2",
  "biometric.verify(face_sample)",
  "DELETE FROM nodes WHERE id=?",
  "const takedown = new LegalNotice(id);",
];
const MATRIX_COLORS = ["#fb7185", "#0d9488", "#f59e0b", "#0284c7", "#7c3aed"];

const stats = [
  {
    icon: "⚠",
    ghost: "90%",
    headline: "90%+",
    title: "Without Consent",
    copy: "Most deepfake content is created without permission.\nYours could already be out there.",
  },
  {
    icon: "↗",
    ghost: "100×",
    headline: "100×",
    title: "Growth",
    copy: "AI has made abuse cheap, fast, and scalable.",
  },
  {
    icon: "◎",
    ghost: "700+",
    headline: "700+ Per Minute",
    title: "Uploaded Deepfakes",
    copy: "That’s how many deepfake images and videos hit the internet every minute.",
  },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function MatrixGrid() {
  const initialCells = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        // Top Gap Fix: Specifically target the area between nav and text (approx 0-30% vertical)
        const zone = Math.floor(Math.random() * 4);
        let top, left;

        if (zone === 0) {
          // Top Band (Fill the gap between nav and text)
          top = Math.random() * 30; // 0-30%
          left = Math.random() * 100;
        } else if (zone === 1) {
          // Bottom Band
          top = 70 + Math.random() * 30; // 70-100%
          left = Math.random() * 100;
        } else if (zone === 2) {
          // Left Side
          top = Math.random() * 100;
          left = Math.random() * 15; // 0-15%
        } else {
          // Right Side
          top = Math.random() * 100;
          left = 85 + Math.random() * 15; // 85-100%
        }

        return {
          id: i,
          text: MATRIX_SNIPPETS[
            Math.floor(Math.random() * MATRIX_SNIPPETS.length)
          ],
          color:
            MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)],
          duration: `${9 + Math.random() * 14}s`,
          delay: `${-Math.random() * 12}s`,
          top: `${top}%`,
          left: `${left}%`,
          xDrift: `${-32 + Math.random() * 64}px`,
          yDrift: `${-42 + Math.random() * 84}px`,
          opacity: 0.15 + Math.random() * 0.3,
        };
      }),
    [],
  );

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
        setCells((prev) =>
          prev.map((cell) => {
            if (!fadingIds.has(cell.id)) return cell;
            return {
              ...cell,
              text: MATRIX_SNIPPETS[
                Math.floor(Math.random() * MATRIX_SNIPPETS.length)
              ],
              color:
                MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)],
              opacity: 0.14 + Math.random() * 0.32,
              duration: `${8 + Math.random() * 15}s`,
              xDrift: `${-38 + Math.random() * 76}px`,
              yDrift: `${-50 + Math.random() * 100}px`,
            };
          }),
        );
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
              "--dur": cell.duration,
              "--delay": cell.delay,
              "--drift-x": cell.xDrift,
              "--drift-y": cell.yDrift,
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
            Our proprietary multi-modal models analyze image and video feeds in
            real-time from tens of thousands of sources from the public and dark
            web. By decomposing signals into distinct biometric layers, we can
            identify synthetic artifacts that are invisible to the naked eye.
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
    const container = document.querySelector(".exploded-section");
    const sticky = document.querySelector(".exploded-sticky");
    const stage = document.querySelector(".mockup-stage");
    const heading = document.querySelector(".exploded-heading");

    // Cache mobileStartBuffer once so it never shifts while scrolling.
    // (The phone position changes mid-scroll as layout reflows, so
    // recalculating every frame meant progress never advanced.)
    let mobileStartBuffer = null;

    const handleScroll = () => {
      if (!container || !sticky || !stage || !heading) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDist = rect.height - viewportHeight;
      const scrolled = -rect.top;
      const isMobile = window.innerWidth <= 980;

      let startBuffer;

      if (isMobile) {
        if (mobileStartBuffer === null) {
          const frame = stage.querySelector(".piece-frame");
          if (frame) {
            const frameRect = frame.getBoundingClientRect();
            const frameCenterY = frameRect.top + frameRect.height / 2;
            const viewportCenterY = viewportHeight / 2;
            const distanceToCenter = frameCenterY - viewportCenterY;
            // Subtract a small offset so the phone sits slightly above true center
            // (accounts for the heading above it taking visual weight)
            mobileStartBuffer = Math.max(0, scrolled + distanceToCenter - viewportHeight * 0.06);
          } else {
            mobileStartBuffer = viewportHeight * 0.35;
          }
        }
        startBuffer = mobileStartBuffer;
      } else {
        startBuffer = viewportHeight * 0.25;
      }

      const effectiveDist = Math.max(1, totalDist - startBuffer);

      let progress = 0;
      if (scrolled > startBuffer) {
        progress = Math.min(1, (scrolled - startBuffer) / effectiveDist);
      }

      stage.style.setProperty("--progress", progress.toFixed(4));

      if (isMobile) {
        // Fade title out as animation begins — no movement, just opacity.
        const mobileFade = Math.max(0, 1 - progress * 4);
        heading.style.opacity = mobileFade.toFixed(3);
        heading.style.transform = "none";
      } else {
        const textFadeMultiplier = 3.5;
        const textOpacity = Math.max(0, 1 - progress * textFadeMultiplier);
        heading.style.opacity = textOpacity.toFixed(2);
        heading.style.transform = `translateY(${progress * -20}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="exploded-section">
      <div className="exploded-sticky">
        <div className="exploded-split-layout">
          <div className="mockup-stage">
            <article className="mock-piece piece-frame"></article>
            <article className="mock-piece piece-cover">
              <span>Extracted Image</span>
            </article>
            <article className="mock-piece piece-meta">
              <span>Media Info</span>
              <h3>@misa.amane</h3>
              <p>Red Wine Supernova • Reel</p>
              <b></b>
            </article>
            <article className="mock-piece piece-video">
              <span>Hidden Metadata</span>
            </article>
            <article className="mock-piece piece-wave">
              <span>Extracted Audio</span>
              <div className="wave-bars">
                {Array.from({ length: 26 }, (_, i) => (
                  <i key={i}></i>
                ))}
              </div>
            </article>
            <article className="mock-piece piece-controls">
              <span>Playback Info</span>
              <div className="playback-bar">
                <div className="playback-progress"></div>
              </div>
              <div className="playback-buttons">
                <span>⏮</span>
                <b>▶</b>
                <span>⏭</span>
              </div>
            </article>
            <div className="final-message">
              <p className="eyebrow badge-font">Final Report</p>
              <h2 className="title">Complete Analysis</h2>
              <p className="lead">
                We break content down so you can fully understand what’s
                happening.
              </p>
            </div>
          </div>

          <div className="exploded-heading">
            <h2 className="title">If it exists,<br/>you deserve to know.</h2>
            <p className="lead"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WaitlistModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [closing, setClosing] = useState(false);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (open) {
      setClosing(false);
      document.body.classList.add("scroll-locked");
    }
    return () => document.body.classList.remove("scroll-locked");
  }, [open]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
      setStatus("idle");
      setName("");
      setEmail("");
    }, 300);
  }, [onClose]);

  const handleBackdrop = useCallback(
    (e) => {
      if (e.target === backdropRef.current) handleClose();
    },
    [handleClose],
  );

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("l", "3d150e5c-b98b-414d-973a-e3237948289d");

      await fetch("https://mail.framewatch.org/subscription/form", {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className={`wl-backdrop${closing ? " wl-closing" : ""}`}
      onClick={handleBackdrop}
    >
      <div className={`wl-modal${closing ? " wl-modal-closing" : ""}`}>
        <button
          className="wl-close"
          onClick={handleClose}
          aria-label="Close"
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="wl-success">
            <div className="wl-check-wrap">
              <svg className="wl-check" viewBox="0 0 52 52">
                <circle
                  className="wl-check-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="wl-check-path"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
            <h3 className="wl-success-title">You're in!</h3>
            <p className="wl-success-msg">
              You’ll be notified when access opens.
            </p>
          </div>
        ) : (
          <>
            <h3 className="wl-title">Get Notified</h3>
            <p className="wl-subtitle">Find out before it spreads.</p>
            <form className="wl-form" onSubmit={handleSubmit}>
              <div className="wl-field">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="wl-field">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <button
                className="wl-submit"
                type="submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <span className="wl-spinner"></span>
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  useReveal();
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const isWindows = useMemo(() => {
    const platform =
      navigator.userAgentData?.platform || navigator.platform || "";
    return /win/i.test(platform);
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".glass-nav");
    const darkSections = () =>
      document.querySelectorAll(
        ".bold-statement, .notify-section, .cta-section, .site-footer",
      );

    const checkNav = () => {
      if (!nav) return;
      const navRect = nav.getBoundingClientRect();
      const navMid = navRect.top + navRect.height / 2;
      let onDark = false;

      darkSections().forEach((section) => {
        const r = section.getBoundingClientRect();
        if (navMid >= r.top && navMid <= r.bottom) onDark = true;
      });

      nav.classList.toggle("nav-dark", onDark);
    };

    window.addEventListener("scroll", checkNav, { passive: true });
    checkNav();
    return () => window.removeEventListener("scroll", checkNav);
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll(".glass-nav nav a, .brand");
    const handleClick = (event) => {
      const anchor = event.currentTarget.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const navOffset = 72;
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({ top: targetTop, behavior: "smooth" });
    };

    links.forEach((link) => link.addEventListener("click", handleClick));
    return () =>
      links.forEach((link) => link.removeEventListener("click", handleClick));
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
        <button
          className="btn-waitlist"
          type="button"
          onClick={() => setWaitlistOpen(true)}
        >
          Join Waitlist
        </button>
      </header>

      <main>
        <section id="home" className="hero">
          <MatrixGrid />
          <div className="hero-content hero-intro">
            <p className="hero-badge">
              <span className="pulse-dot"></span> AUTOMATED IDENTITY DEFENSE
              v2.0
            </p>
            <h1>
              Your Face.
              <br />
              <span>Your Control.</span>
            </h1>
            <p className="lead">
              Someone is using your face or voice without consent. <br /> We
              help you find it and take it down.
            </p>
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
              <p style={{ whiteSpace: "pre-line" }}>{item.copy}</p>
            </div>
          ))}
        </section>

        <section className="features">
          <DetectionAlgorithms />
          <ExplodedRebuildSection />
        </section>

        <section className="bold-statement" data-reveal>
          <div className="bold-statement-bg" aria-hidden="true">
            <div className="bold-ring r1"></div>
            <div className="bold-ring r2"></div>
            <div className="bold-ring r3"></div>
            <div className="bold-pulse-dot"></div>
          </div>
          <div className="bold-statement-content">
            <div className="bold-eyebrow-row">
              <span className="bold-eyebrow badge-font">The reality</span>
            </div>
            <div className="bold-split-row">
              <div className="bold-left">
                <div className="bold-stat-block">
                  <span className="bold-stat-num">96<span className="bold-stat-pct">%</span></span>
                  <span className="bold-stat-label">of victims never discover deepfake content made of them</span>
                </div>
              </div>
              <div className="bold-divider" aria-hidden="true"></div>
              <div className="bold-right">
                <h2 className="bold-line line-1">Most people<br/>never find out.</h2>
                <h2 className="bold-line line-2">You will.</h2>
              </div>
            </div>
          </div>
        </section>

        <section className="notify-section">
          <div className="nf-header" data-reveal>
            <p className="eyebrow badge-font">How You Stay In Control</p>
            <h2 className="nf-title">You&apos;re Notified.<br/>You&apos;re Shown.<br/>You Decide.</h2>
          </div>

          <div className="nf-features">

            {/* ── 01 Instant Alert ── */}
            <div className="nf-feature" data-reveal>
              <div className="nf-feature-text">
                <span className="nf-num badge-font">01</span>
                <h3 className="nf-feature-title">Instant alert</h3>
                <p className="nf-feature-body">The moment a match is found anywhere on the web or dark web, you get a push notification before anyone else.</p>
              </div>
              <div className="nf-feature-vis">
                <div className="nf-phone-notif">
                  <div className="nf-phone-screen">
                    <div className="nf-phone-statusbar">
                      <span>9:41</span>
                      <span>●●●</span>
                    </div>
                    <div className="nf-notif-stack">
                      <div className="nf-notif-card">
                        <div className="nf-notif-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                        </div>
                        <div className="nf-notif-text">
                          <strong>FrameWatch</strong>
                          <span>Match detected — tap to review</span>
                        </div>
                        <span className="nf-notif-time">now</span>
                      </div>
                      <div className="nf-notif-card nf-notif-card--2">
                        <div className="nf-notif-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                        </div>
                        <div className="nf-notif-text">
                          <strong>FrameWatch</strong>
                          <span>New match found — @user_4821</span>
                        </div>
                        <span className="nf-notif-time">now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 02 See What Was Found ── */}
            <div className="nf-feature" data-reveal>
              <div className="nf-feature-text">
                <span className="nf-num badge-font">02</span>
                <h3 className="nf-feature-title">See exactly what was found</h3>
                <p className="nf-feature-body">View the exact content, the platform it was on, and full forensic evidence — with a confidence score so you always know how certain we are.</p>
              </div>
              <div className="nf-feature-vis">
                <div className="nf-scan-vis">
                  <div className="nf-scan-face">
                    <div className="nf-scan-line"></div>
                    <div className="nf-scan-corner tl"></div>
                    <div className="nf-scan-corner tr"></div>
                    <div className="nf-scan-corner bl"></div>
                    <div className="nf-scan-corner br"></div>
                    <div className="nf-scan-dot d1"></div>
                    <div className="nf-scan-dot d2"></div>
                    <div className="nf-scan-dot d3"></div>
                    <div className="nf-scan-dot d4"></div>
                    <div className="nf-scan-dot d5"></div>
                    <span className="nf-scan-label">@unknown_user</span>
                  </div>
                  <div className="nf-confidence-bar">
                    <span className="nf-confidence-label badge-font">Match Confidence</span>
                    <div className="nf-confidence-track">
                      <div className="nf-confidence-fill"></div>
                    </div>
                    <span className="nf-confidence-pct">97.4%</span>
                  </div>
                  <div className="nf-scan-tags">
                    <span className="nf-tag">Instagram Reel</span>
                    <span className="nf-tag">Deepfake</span>
                    <span className="nf-tag nf-tag--alert">Action required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 03 One-click Takedown ── */}
            <div className="nf-feature" data-reveal>
              <div className="nf-feature-text">
                <span className="nf-num badge-font">03</span>
                <h3 className="nf-feature-title">One-click takedown</h3>
                <p className="nf-feature-body">Request accelerated removal in a single tap. We handle the legal notices, platform submissions, and follow-up until it&apos;s gone.</p>
              </div>
              <div className="nf-feature-vis">
                <div className="nf-takedown-vis">
                  <div className="nf-content-card">
                    <div className="nf-content-card-img"></div>
                    <div className="nf-content-card-info">
                      <span className="nf-content-card-platform badge-font">TikTok · @anon</span>
                      <span className="nf-content-card-title">Unauthorized deepfake</span>
                    </div>
                    <div className="nf-content-card-dismiss">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* ── 04 Ongoing Protection ── */}
            <div className="nf-feature" data-reveal>
              <div className="nf-feature-text">
                <span className="nf-num badge-font">04</span>
                <h3 className="nf-feature-title">Ongoing protection</h3>
                <p className="nf-feature-body">Continuous 24/7 monitoring across 50,000+ sources — social platforms, adult sites, dark web forums — so it can&apos;t come back.</p>
              </div>
              <div className="nf-feature-vis">
                <div className="nf-shield-vis">
                  <div className="nf-shield-core">
                    <svg className="nf-shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <div className="nf-shield-counter">
                      <span className="nf-shield-counter-num">24/7</span>
                      <span className="nf-shield-counter-sub badge-font">Live</span>
                    </div>
                  </div>
                  <div className="nf-shield-ring r1" aria-hidden="true"></div>
                  <div className="nf-shield-ring r2" aria-hidden="true"></div>
                  <div className="nf-shield-ring r3" aria-hidden="true"></div>
                  {["TikTok","IG","X","OF","Reddit","Telegram"].map((p, i) => (
                    <div className="nf-platform-dot" key={p} style={{"--pi": i, "--ptotal": 6}}>
                      <span>{p}</span>
                    </div>
                  ))}

                </div>
              </div>
            </div>

          </div>

          <div className="nf-footer" data-reveal>
            <p className="nf-footer-text">Nothing happens behind your back.</p>
          </div>
        </section>
        <section id="cta" className="cta-section">
          <div className="cta-orbits" aria-hidden="true">
            <div className="cta-orbit">
              <span className="cta-orbit-dot"></span>
            </div>
            <div className="cta-orbit">
              <span className="cta-orbit-dot"></span>
            </div>
            <div className="cta-orbit">
              <span className="cta-orbit-dot"></span>
            </div>
          </div>
          <h2 className="title">Ready to check?</h2>
          <p className="cta-lead">
            See who's using your face.
          </p>
          <button
            className="cta-button"
            type="button"
            onClick={() => setWaitlistOpen(true)}
          >
            Join Waitlist
          </button>
        </section>

        <footer className="site-footer">
          <div className="footer-glass-row">
            <small>© 2026 FrameWatch. All rights reserved.</small>
            <span className="footer-sep" aria-hidden="true"></span>
            <small>
              Made in Canada{" "}
              <span className="ca-flag" aria-hidden="true">
                {isWindows ? "🍁" : "🇨🇦"}
              </span>
            </small>
          </div>
        </footer>
      </main>
      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
