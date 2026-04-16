import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import DynamicNetwork from "../components/DynamicNetwork";
import entitiesData from "../data/entities.json";
import flavorData from "../data/flavor_data.json";

const SAMPLE_INGREDIENTS = [
  { id: 60,  name: "Butter",   emoji: "🧈" },
  { id: 62,  name: "Cheese",   emoji: "🧀" },
  { id: 162, name: "Apple",    emoji: "🍎" },
  { id: 46,  name: "Coffee",   emoji: "☕" },
  { id: 259, name: "Garlic",   emoji: "🧄" },
  { id: 330, name: "Cinnamon", emoji: "🫚" },
  { id: 364, name: "Tomato",   emoji: "🍅" },
];

export default function Deconstruct() {
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
    handleDeconstruct(item.entity_id, item.name, item.category);
  };

  const handleDeconstruct = (entityId, fallbackName, fallbackCategory) => {
    setLoading(true);
    setTimeout(() => {
      const profile = flavorData.find((f) => f.entity_id === entityId);
      if (profile) {
        setResult(profile);
      } else {
        // Not in flavor_data — show a graceful fallback
        const entity = entitiesData.find((e) => e.entity_id === entityId);
        setResult({
          entity_id: entityId,
          name: entity?.name || fallbackName || "Unknown",
          category: entity?.category || fallbackCategory || "Unknown",
          molecule_count: null,
          flavor_profile: [],
          taste_dimensions: {},
          top_molecules: [],
          _noData: true,
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "3rem", marginBottom: "16px", display: "inline-block", transformOrigin: "bottom center" }}
            >
              🧪
            </motion.div>
            <h1>
              AI <span className="gradient-text">Deconstruction</span>
            </h1>
            <p>Break any ingredient into its molecular flavor components. See the chemistry behind taste.</p>
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
                padding: "0 20px", transition: "border-radius 0.2s ease",
              }}
            >
              <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Search any ingredient... (e.g. vanilla, salmon, basil)"
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
                    background: "rgba(10, 10, 10, 0.95)", backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)", borderTop: "none",
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
                        color: "var(--text-primary)", fontSize: "15px", cursor: "pointer",
                        textAlign: "left", transition: "all 0.2s ease",
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
            {SAMPLE_INGREDIENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setQuery(item.name); handleDeconstruct(item.id, item.name); }}
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "10px 18px", background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: "var(--radius-full)",
                  color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500,
                  cursor: loading ? "wait" : "pointer", transition: "all 0.3s ease",
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseOver={(e) => { if (!loading) { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-card-hover)"; } }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}
              >
                {item.emoji} {item.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="spinner" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)" }}>Analyzing molecular structure...</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
              style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "80px" }}
            >
              {/* Ingredient Header */}
              <div className="card" style={{ textAlign: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{result.name}</h2>
                <div className="badge" style={{ marginBottom: "12px" }}>{result.category}</div>
                {result._noData ? (
                  <div style={{
                    marginTop: "16px", padding: "16px 24px",
                    background: "rgba(251,191,36,0.06)", borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(251,191,36,0.15)",
                  }}>
                    <p style={{ color: "var(--amber-400)", fontWeight: 600, marginBottom: "4px" }}>
                      🔬 Detailed molecular analysis — Coming Soon
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                      Full flavor deconstruction for {result.name} will be available when the FlavorDB integration goes live.
                    </p>
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                    {result.molecule_count} flavor molecules detected
                  </p>
                )}
              </div>

              {/* Networks — only if we have real data */}
              {!result._noData && (
                <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <DynamicNetwork
                      title="🏷️ Flavor Profile"
                      description={`Dominant taste notes in ${result.name}`}
                      centerLabel={result.name}
                      nodeColor="#4ade80"
                      items={result.flavor_profile.slice(0, 20).map((f, i) => ({ id: `flavor-${i}`, label: f, value: 10 }))}
                    />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <DynamicNetwork
                      title="🧪 Molecular Composition"
                      description={`Key chemical compounds in ${result.name}`}
                      centerLabel={result.name}
                      nodeColor="#a78bfa"
                      items={result.top_molecules.slice(0, 20).map((m, i) => ({ id: `mol-${i}`, label: m.name, value: 12 }))}
                    />
                  </motion.div>

                  {/* Taste dimensions bar chart */}
                  <div className="card">
                    <h3 style={{ marginBottom: "16px" }}>🎨 Taste Dimensions</h3>
                    {Object.entries(result.taste_dimensions)
                      .filter(([, v]) => v > 0)
                      .sort((a, b) => b[1] - a[1])
                      .map(([taste, value]) => (
                        <div key={taste} style={{ marginBottom: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "13px", textTransform: "capitalize", color: "var(--text-secondary)" }}>{taste}</span>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--amber-400)" }}>
                              {Math.round(value * 100)}%
                            </span>
                          </div>
                          <div style={{ width: "100%", height: "6px", background: "rgba(253,248,237,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${value * 100}%` }}
                              transition={{ delay: 0.3, duration: 0.8 }}
                              style={{ height: "100%", background: "linear-gradient(90deg, var(--amber-500), var(--amber-300))", borderRadius: "3px" }}
                            />
                          </div>
                        </div>
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
