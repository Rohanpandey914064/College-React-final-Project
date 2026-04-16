import { motion } from "framer-motion";

export default function Localize() {
  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      <div className="container">
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "3rem", marginBottom: "16px", display: "inline-block" }}
            >
              🌍
            </motion.div>
            <h1>
              Recipe <span className="gradient-text">Localization</span>
            </h1>
            <p>Recreate international dishes using local ingredients with molecular precision.</p>
          </motion.div>
        </div>

        {/* Main Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ maxWidth: "680px", margin: "0 auto 60px" }}
        >
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "56px 40px",
              background: "linear-gradient(135deg, rgba(251,191,36,0.04) 0%, rgba(244,63,94,0.04) 100%)",
              border: "1px solid rgba(251,191,36,0.15)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow orb */}
            <div style={{
              position: "absolute", top: "-80px", right: "-80px",
              width: "300px", height: "300px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Coming Soon badge */}
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "8px 20px", borderRadius: "var(--radius-full)",
                background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)",
                fontSize: "13px", fontWeight: 700, color: "var(--amber-400)",
                marginBottom: "28px", letterSpacing: "0.05em",
              }}
            >
              ✦ COMING SOON ✦
            </motion.div>

            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", marginBottom: "16px", lineHeight: 1.3 }}>
              Live Recipe Localization<br />
              <span style={{ fontWeight: 400, color: "var(--text-secondary)", fontSize: "0.75em" }}>
                Powered by FlavorDB API
              </span>
            </h2>

            <p style={{
              color: "var(--text-muted)", fontSize: "16px", lineHeight: 1.7,
              maxWidth: "480px", margin: "0 auto 32px",
            }}>
              Enter any dish — Butter Chicken, Ramen, Pasta Carbonara — and ByteBite will
              find locally available ingredients that match the exact molecular flavor signature.
              Real recipe swaps, scientifically validated.
            </p>

            {/* Feature preview pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "36px" }}>
              {[
                "🌏 Cross-cuisine adaptation",
                "🧬 Molecular flavor matching",
                "🛒 Local market lookup",
                "📊 Similarity scoring",
                "🥗 Nutrition tracking",
              ].map((f) => (
                <span key={f} style={{
                  padding: "7px 14px", borderRadius: "var(--radius-full)",
                  background: "rgba(253,248,237,0.05)", border: "1px solid var(--border)",
                  fontSize: "13px", color: "var(--text-secondary)",
                }}>
                  {f}
                </span>
              ))}
            </div>

            <div style={{
              padding: "16px 24px",
              background: "rgba(253,248,237,0.03)", borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)", fontSize: "13px", color: "var(--text-muted)",
            }}>
              While you wait — try{" "}
              <a href="/deconstruct" style={{ color: "var(--amber-400)", textDecoration: "underline" }}>Deconstruct</a>
              {" "}or{" "}
              <a href="/substitute" style={{ color: "var(--amber-400)", textDecoration: "underline" }}>Substitute</a>
              {" "}for live molecular flavor analysis.
            </div>
          </div>
        </motion.div>

        {/* Floating decorative cards */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", paddingBottom: "80px" }}>
          {[
            { emoji: "🍛", label: "Butter Chicken → Local herbs", delay: 0 },
            { emoji: "🍜", label: "Ramen → Regional noodles", delay: 0.1 },
            { emoji: "🥘", label: "Paella → Native substitutes", delay: 0.2 },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + item.delay, duration: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + item.delay, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "20px 24px",
                  textAlign: "center", minWidth: "200px",
                  filter: "blur(0.5px)", opacity: 0.7,
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{item.emoji}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.label}</div>
                <div style={{
                  marginTop: "10px", fontSize: "11px", fontWeight: 700,
                  color: "var(--amber-400)", letterSpacing: "0.08em",
                }}>
                  LAUNCHING SOON
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
