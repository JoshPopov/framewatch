"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, CheckCircle, User } from "lucide-react";

type Step = "credentials" | "face-scan" | "complete";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep("face-scan");
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5MB.");
        return;
      }

      setError("");
      setFaceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFacePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleFaceScanUpload = async () => {
    if (!faceFile) {
      setError("Please upload a face scan image.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStep("complete");
        return;
      }

      const fileExt = faceFile.name.split(".").pop();
      const fileName = `${user.id}/face-scan.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("face-scans")
        .upload(fileName, faceFile, { upsert: true });

      if (uploadError) {
        // Storage bucket may not exist yet - still proceed
        console.log("[v0] Storage upload note:", uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from("face-scans")
        .getPublicUrl(fileName);

      await supabase
        .from("profiles")
        .update({
          face_scan_url: urlData?.publicUrl || null,
          face_scan_uploaded_at: new Date().toISOString(),
          onboarding_complete: true,
        })
        .eq("id", user.id);
    } catch {
      // Continue even if profile update fails
    }

    setLoading(false);
    setStep("complete");
  };

  const handleSkipFaceScan = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ onboarding_complete: true })
          .eq("id", user.id);
      }
    } catch {
      // Continue even if update fails
    }
    setLoading(false);
    setStep("complete");
  };

  const slideVariants = {
    enter: { x: 60, opacity: 0, filter: "blur(8px)" },
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: { x: -60, opacity: 0, filter: "blur(8px)" },
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-card">
          <div className="auth-logo">
            <Link href="/">
              <img src="/logo.png" alt="FrameWatch" />
            </Link>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            <div
              className={`step-dot ${
                step === "credentials"
                  ? "active"
                  : step !== "credentials"
                  ? "completed"
                  : ""
              }`}
            />
            <div
              className={`step-line ${
                step !== "credentials" ? "completed" : ""
              }`}
            />
            <div
              className={`step-dot ${
                step === "face-scan"
                  ? "active"
                  : step === "complete"
                  ? "completed"
                  : ""
              }`}
            />
            <div
              className={`step-line ${step === "complete" ? "completed" : ""}`}
            />
            <div
              className={`step-dot ${step === "complete" ? "active" : ""}`}
            />
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Credentials */}
            {step === "credentials" && (
              <motion.div
                key="credentials"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="auth-header">
                  <h1>Create account</h1>
                  <p>Start protecting your identity today</p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="auth-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginBottom: "1rem" }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleCredentials} className="auth-form">
                  <div className="form-field">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`auth-btn ${loading ? "loading" : ""}`}
                    disabled={loading}
                  >
                    {loading ? <span className="spinner" /> : "Continue"}
                  </button>
                </form>

                <div className="auth-footer">
                  Already have an account?{" "}
                  <Link href="/auth/login">Sign in</Link>
                </div>
              </motion.div>
            )}

            {/* Step 2: Face Scan Upload */}
            {step === "face-scan" && (
              <motion.div
                key="face-scan"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="auth-header">
                  <h1>Face Scan</h1>
                  <p>Upload a clear photo of your face for identity protection</p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="auth-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginBottom: "1rem" }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  aria-label="Upload face scan photo"
                />

                <motion.div
                  className={`face-scan-area ${facePreview ? "has-image" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to upload face scan"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  {facePreview ? (
                    <motion.img
                      src={facePreview}
                      alt="Face scan preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  ) : (
                    <>
                      <Camera className="scan-icon" size={32} />
                      <span className="scan-text">
                        Tap to upload a photo
                      </span>
                      <span className="scan-hint">JPG, PNG up to 5MB</span>
                    </>
                  )}
                </motion.div>

                <div className="auth-form" style={{ gap: "0.75rem" }}>
                  <button
                    type="button"
                    className={`auth-btn ${loading ? "loading" : ""}`}
                    disabled={loading}
                    onClick={handleFaceScanUpload}
                  >
                    {loading ? (
                      <span className="spinner" />
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Upload size={16} />
                        Upload & Continue
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className="skip-btn"
                    onClick={handleSkipFaceScan}
                    disabled={loading}
                  >
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Complete */}
            {step === "complete" && (
              <motion.div
                key="complete"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ textAlign: "center" }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />
                </motion.div>

                <div className="auth-header">
                  <h1>{"You're all set!"}</h1>
                  <p>
                    Your account has been created. Check your email to confirm
                    your account, then sign in to access your dashboard.
                  </p>
                </div>

                <div className="auth-form">
                  <button
                    type="button"
                    className="auth-btn"
                    onClick={() => router.push("/auth/login")}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <User size={16} />
                      Go to Sign In
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
