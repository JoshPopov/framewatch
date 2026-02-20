"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthErrorPage() {
  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="auth-logo">
            <Link href="/">
              <img src="/logo.png" alt="FrameWatch" />
            </Link>
          </div>
          <div className="auth-header">
            <h1>Something went wrong</h1>
            <p>
              We encountered an error during authentication. Please try again.
            </p>
          </div>
          <div className="auth-form">
            <Link href="/auth/login" className="auth-btn" style={{ textDecoration: "none", display: "block", textAlign: "center" }}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
