import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Beaker, ArrowRight, Sparkles, Globe, Network, Leaf, FlaskConical } from "lucide-react";

const features = [
  {
    icon: "🧪",
    title: "AI Deconstruction",
    description: "Break any food into its molecular flavor components — understand the chemistry behind your cravings.",
    href: "/deconstruct",
    color: "var(--violet-400)",
    lucide: <Beaker size={20} />,
  },
  {
    icon: "🌿",
    title: "Molecular Substitution",
    description: "Find healthy alternatives that taste the same using molecular flavor matching from FlavorDB.",
    href: "/substitute",
    color: "var(--green-400)",
    lucide: <Leaf size={20} />,
  },
  {
    icon: "🔍",
    title: "Food Explorer",
    description: "Browse all 900+ ingredients by category, explore their flavor profiles and molecular networks.",
    href: "/explore",
    color: "var(--sky-400)",
    lucide: <Globe size={20} />,
  },
  {
    icon: "🌐",
    title: "Flavor Visualization",
    description: "Interactive force-directed graph showing how ingredients connect through shared flavor molecules.",
    href: "/visualize",
    color: "var(--amber-400)",
    lucide: <Network size={20} />,
  },
  {
    icon: "🌍",
    title: "Recipe Localization",
    description: "Recreate international dishes using local ingredients with molecular precision.",
    href: "/localize",
    color: "var(--rose-400)",
    lucide: <FlaskConical size={20} />,
    comingSoon: true,
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero Section */}
      <section style={{ position: "relative", padding: "80px 0 60px", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", top: "-200px", left: "-100px",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-300px", right: "-150px",
            width: "700px", height: "700px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "8px 20px", borderRadius: "var(--radius-full)",
                  background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
                  fontSize: "14px", color: "var(--amber-400)", marginBottom: "32px", fontWeight: 600,
                }}
              >
                <Sparkles size={16} />
                Powered by FlavorDB &amp; RecipeDB
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 900,
                  lineHeight: 1.05, marginBottom: "24px", letterSpacing: "-0.03em",
                }}
              >
                Guilt-Free
                <br />
                <span className="gradient-text">Comfort Food</span>
                <br />
                <span style={{ fontSize: "0.55em", fontWeight: 500, color: "var(--text-secondary)" }}>
                  Engineered by Molecular AI
                </span>
              </h1>

              <p
                style={{
                  fontSize: "18px", color: "var(--text-muted)", maxWidth: "560px",
                  margin: "0 auto 40px", lineHeight: 1.7,
                }}
              >
                ByteBite uses computational gastronomy to decode flavor at the molecular level,
                helping you find healthy food that actually satisfies your cravings.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <Link to="/deconstruct">
                  <button className="btn-primary">
                    <Beaker size={18} />
                    Start Deconstructing
                    <ArrowRight size={16} />
                  </button>
                </Link>
                <Link to="/visualize">
                  <button className="btn-secondary">Explore Flavor Map</button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "40px 0 100px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "12px" }}>
              Molecular Toolkit
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
              Five tools that bridge the gap between nutrition science and flavor satisfaction
            </p>
          </div>

          <div
            style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center",
              gap: "24px", maxWidth: "1200px", margin: "0 auto",
            }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={mounted ? { opacity: 0, y: 30 } : false}
                animate={mounted ? { opacity: 1, y: 0 } : false}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
              >
                <Link to={feature.href} style={{ textDecoration: "none" }}>
                  <div
                    className="card"
                    style={{
                      cursor: "pointer", width: "280px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", textAlign: "center",
                      position: "relative",
                    }}
                  >
                    {feature.comingSoon && (
                      <div
                        style={{
                          position: "absolute", top: "12px", right: "12px",
                          fontSize: "10px", fontWeight: 700, padding: "3px 8px",
                          borderRadius: "var(--radius-full)", background: "rgba(244,63,94,0.15)",
                          color: "var(--rose-400)", border: "1px solid rgba(244,63,94,0.3)",
                        }}
                      >
                        SOON
                      </div>
                    )}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                      style={{ fontSize: "2.5rem", marginBottom: "16px", display: "inline-block" }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", color: feature.color }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                      {feature.description}
                    </p>
                    <div
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        marginTop: "auto", paddingTop: "16px",
                        fontSize: "13px", fontWeight: 600, color: feature.color,
                      }}
                    >
                      {feature.comingSoon ? "Coming Soon" : "Try it"} <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 0", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <div className="container">
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            ByteBite — Molecular Culinary Transformer · Powered by{" "}
            <a href="https://cosylab.iiitd.edu.in/flavordb/" target="_blank" rel="noopener" style={{ color: "var(--amber-400)" }}>
              FlavorDB
            </a>{" "}
            &amp;{" "}
            <a href="https://cosylab.iiitd.edu.in/recipedb/" target="_blank" rel="noopener" style={{ color: "var(--amber-400)" }}>
              RecipeDB
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
