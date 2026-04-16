import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Search } from "lucide-react";
import entitiesData from "../data/entities.json";
import substitutionsData from "../data/substitutions.json";

const COMMON_INGREDIENTS = [
  { id: 60,  name: "Butter",   emoji: "🧈" },
  { id: 62,  name: "Cheese",   emoji: "🧀" },
  { id: 162, name: "Apple",    emoji: "🍎" },
  { id: 46,  name: "Coffee",   emoji: "☕" },
  { id: 259, name: "Garlic",   emoji: "🧄" },
  { id: 330, name: "Cinnamon", emoji: "🫚" },
];

export default function Substitute() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInput = useCallback((value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const matches = entitiesData
        .filter((e) => e.name.toLowerCase().includes(value.trim().toLowerCase()))
        .slice(0, 8);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    }, 200);
  }, []);

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
    setShowSuggestions(false);
    setSuggestions([]);
    handleSubstitute(item.entity_id);
  };

  const handleSubstitute = (entityId) => {
    setLoading(true);
    setTimeout(() => {
      const data = substitutionsData[String(entityId)];
      if (data) {
        setResult(data);
      } else {
        // Graceful fallback
        const entity = entitiesData.find((e) => e.entity_id === entityId);
        setResult({
          source: {
            entity_id: entityId,
            name: entity?.name || "Unknown",
            category: entity?.category || "Unknown",
            flavor_profile: [],
            taste_dimensions: {},
          },
          substitutions: [],
          _noData: true,
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      <div className="container">
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "3rem", marginBottom: "16px", display: "inline-block", transformOrigin: "bottom center" }}
            >
              🌿
            </motion.div>
            <h1>
              Molecular <span className="gradient-text">Substitution</span>
            </h1>
            <p>Find healthy ingredient alternatives with molecularly similar flavor profiles.</p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          style={{ maxWidth: "520px", margin: "0 auto 32px" }}
        >
          <div ref={searchRef} style={{ position: "relative" }}>
            <div
              style={{
                display: "flex", alignItems: "center",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: showSuggestions && suggestions.length > 0 ? "16px 16px 0 0" : "var(--radius-full)",
                padding: "0 20px",
              }}
            >
              <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Search any ingredient... (e.g. butter, cream, chocolate)"
                style={{
                  flex: 1, padding: "14px 12px", background: "transparent",
                  border: "none", outline: "none", color: "var(--text-primary)",
                  fontSize: "15px", fontFamily: "var(--font-body)",
                }}
              />
            </div>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute", top: "100%", left: 0, right: 0,
                    background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)", borderTop: "none",
                    borderRadius: "0 0 16px 16px", maxHeight: "320px", overflowY: "auto",
                    zIndex: 100, boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                  }}
                >
                  {suggestions.map((item, i) => (
                    <button
                      key={item.entity_id}
                      onClick={() => handleSelectSuggestion(item)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        width: "100%", padding: "16px 24px", background: "transparent",
                        border: "none",
                        borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        color: "var(--text-primary)", fontSize: "15px",
                        cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{
                        fontSize: "11px", padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(251,191,36,0.15)", color: "var(--amber-400)",
                        border: "1px solid rgba(251,191,36,0.3)",
                      }}>
                        {item.category}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Pick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{ maxWidth: "700px", margin: "0 auto 48px" }}
        >
          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
            or quick pick:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {COMMON_INGREDIENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setQuery(item.name); handleSubstitute(item.id); }}
                disabled={loading}
                className="btn-secondary"
                style={{ padding: "10px 18px", fontSize: "14px", opacity: loading ? 0.6 : 1, cursor: loading ? "wait" : "pointer" }}
              >
                {item.emoji} {item.name}
              </button>
            ))}
          </div>
        </motion.div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="spinner" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)" }}>Searching molecular database for alternatives...</p>
          </div>
        )}

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
              style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "80px" }}
            >
              {/* Source */}
              <div className="card" style={{ textAlign: "center", marginBottom: "32px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Finding healthier alternatives for
                </p>
                <h2 style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{result.source.name}</h2>
                <div className="badge">{result.source.category}</div>
              </div>

              {result._noData ? (
                <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔬</div>
                  <h3 style={{ marginBottom: "12px", color: "var(--amber-400)" }}>Substitutions — Coming Soon</h3>
                  <p style={{ color: "var(--text-muted)", maxWidth: "440px", margin: "0 auto" }}>
                    Molecular substitution data for <strong style={{ color: "var(--text-primary)" }}>{result.source.name}</strong> will be available
                    when the full FlavorDB integration goes live. Try Butter, Cheese, Apple, Coffee, Garlic, or Cinnamon for live results!
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ textAlign: "center", margin: "0 0 32px" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      padding: "8px 20px", borderRadius: "var(--radius-full)",
                      background: "rgba(34,197,94,0.1)", color: "var(--green-400)",
                      fontSize: "13px", fontWeight: 600,
                    }}>
                      <Leaf size={16} />
                      {result.substitutions.length} healthier alternatives found
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {result.substitutions.map((sub, i) => (
                      <motion.div
                        key={sub.entity_id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="card"
                        style={{ display: "flex", alignItems: "center", gap: "20px" }}
                      >
                        {/* Rank */}
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: i === 0
                            ? "linear-gradient(135deg, var(--amber-400), var(--amber-600))"
                            : "rgba(253,248,237,0.06)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: "14px",
                          color: i === 0 ? "var(--brown-950)" : "var(--text-muted)", flexShrink: 0,
                        }}>
                          {i + 1}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{sub.name}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span className="badge" style={{ fontSize: "11px" }}>{sub.category}</span>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {sub.similarity.shared_molecule_count} shared molecules
                            </span>
                          </div>
                          {sub.similarity.shared_flavors.length > 0 && (
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "8px" }}>
                              {sub.similarity.shared_flavors.slice(0, 5).map((f) => (
                                <span key={f} style={{
                                  fontSize: "11px", padding: "2px 8px",
                                  borderRadius: "var(--radius-full)",
                                  background: "rgba(34,197,94,0.08)", color: "var(--green-400)",
                                }}>
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Score */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{
                            fontSize: "1.5rem", fontFamily: "var(--font-display)", fontWeight: 800,
                            color: sub.similarity.combined_score > 0.6
                              ? "var(--green-400)"
                              : sub.similarity.combined_score > 0.4
                                ? "var(--amber-400)"
                                : "var(--text-muted)",
                          }}>
                            {Math.round(sub.similarity.combined_score * 100)}%
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>flavor match</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
