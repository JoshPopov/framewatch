"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  LogOut,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";

interface DashboardUser {
  id: string;
  email: string;
  fullName: string;
  faceScanUrl: string | null;
  faceScanUploadedAt: string | null;
  onboardingComplete: boolean;
  createdAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function DashboardClient({ user }: { user: DashboardUser }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [faceScan, setFaceScan] = useState(user.faceScanUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleFaceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/face-scan.${fileExt}`;

      await supabase.storage
        .from("face-scans")
        .upload(fileName, file, { upsert: true });

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

      setFaceScan(urlData?.publicUrl || null);
    } catch {
      // Continue silently
    }
    setUploading(false);
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard">
      {/* Navigation */}
      <header className="dash-nav">
        <div className="dash-nav-inner">
          <div className="dash-nav-left">
            <Link href="/">
              <img src="/logo.png" alt="FrameWatch" />
            </Link>
            <nav className="dash-nav-links">
              <span className="dash-nav-link active">Dashboard</span>
              <span className="dash-nav-link">Monitoring</span>
              <span className="dash-nav-link">Reports</span>
            </nav>
          </div>
          <div className="dash-nav-right">
            <button
              className="sign-out-btn"
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <LogOut size={14} />
                Sign Out
              </span>
            </button>
            <div className="dash-avatar">
              {faceScan ? (
                <img
                  src={faceScan}
                  alt={`${user.fullName}'s profile`}
                  crossOrigin="anonymous"
                />
              ) : (
                initials
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <motion.div
        className="dash-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="dash-welcome" variants={item}>
          <h1>
            {"Welcome back, "}
            {user.fullName.split(" ")[0]}
          </h1>
          <p>{"Here's an overview of your identity protection status."}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="dash-grid" variants={item}>
          <motion.div className="dash-card" whileHover={{ y: -4 }}>
            <div className="dash-card-icon rose">
              <Shield size={20} />
            </div>
            <h3>Protection Status</h3>
            <div className="value">{faceScan ? "Active" : "Setup"}</div>
            <div className="subtext">
              {faceScan
                ? "Your identity is being monitored"
                : "Upload a face scan to activate"}
            </div>
          </motion.div>

          <motion.div className="dash-card" whileHover={{ y: -4 }}>
            <div className="dash-card-icon slate">
              <Eye size={20} />
            </div>
            <h3>Scans Completed</h3>
            <div className="value">0</div>
            <div className="subtext">Across all monitored platforms</div>
          </motion.div>

          <motion.div className="dash-card" whileHover={{ y: -4 }}>
            <div className="dash-card-icon blue">
              <AlertTriangle size={20} />
            </div>
            <h3>Threats Detected</h3>
            <div className="value">0</div>
            <div className="subtext">No threats found yet</div>
          </motion.div>
        </motion.div>

        {/* Profile Section */}
        <motion.div className="dash-section" variants={item}>
          <div className="dash-section-header">
            <h2>Profile</h2>
          </div>
          <div className="profile-row">
            <span className="label">Name</span>
            <span className="value">{user.fullName}</span>
          </div>
          <div className="profile-row">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="profile-row">
            <span className="label">Member Since</span>
            <span className="value">{memberSince}</span>
          </div>
          <div className="profile-row">
            <span className="label">Face Scan</span>
            <span className="value">
              {faceScan ? (
                <span className="face-scan-badge uploaded">
                  <CheckCircle size={14} />
                  Uploaded
                </span>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span className="face-scan-badge pending">
                    <Clock size={14} />
                    Pending
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFaceUpload}
                    style={{ display: "none" }}
                    aria-label="Upload face scan"
                  />
                  <button
                    className="sign-out-btn"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    style={{ fontSize: "0.8rem" }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Upload size={12} />
                      {uploading ? "Uploading..." : "Upload Now"}
                    </span>
                  </button>
                </span>
              )}
            </span>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div className="dash-section" variants={item}>
          <div className="dash-section-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-item">
            <div className="activity-dot green" />
            <span className="activity-text">Account created</span>
            <span className="activity-time">{memberSince}</span>
          </div>
          {faceScan && (
            <div className="activity-item">
              <div className="activity-dot rose" />
              <span className="activity-text">Face scan uploaded</span>
              <span className="activity-time">
                {user.faceScanUploadedAt
                  ? new Date(user.faceScanUploadedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Recently"}
              </span>
            </div>
          )}
          <div className="activity-item">
            <div className="activity-dot blue" />
            <span className="activity-text">Monitoring initialized</span>
            <span className="activity-time">Pending activation</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
