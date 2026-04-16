import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import DynamicNetwork from "../components/DynamicNetwork";
import entitiesData from "../data/entities.json";
import flavorData from "../data/flavor_data.json";

const CATEGORY_COLORS = {
  Fruit: "#4ade80", Vegetable: "#22c55e", Herb: "#34d399",
  Spice: "#f59e0b", Dairy: "#38bdf8", Meat: "#f43f5e",
  Fish: "#fb7185", Bakery: "#fbbf24", Beverage: "#a78bfa",
  Seed: "#fb923c", Cereal: "#fde68a", Legume: "#2dd4bf",
  Berry: "#f0abfc", Plant: "#86efac", Seafood: "#67e8f9",
  "Beverage Caffeinated": "#c084fc", "Beverage Alcoholic": "#8b5cf6",
  Flower: "#f9a8d4", "Essential Oil": "#fde047", Maize: "#fcd34d",
};

function getCategoryEmoji(cat) {
  const map = {
    Fruit: "🍎", Vegetable: "🥦", Herb: "🌿", Spice: "🌶️",
    Dairy: "🧀", Meat: "🥩", Fish: "🐟", Bakery: "🍞",
    Beverage: "🥤", Seed: "🌾", Cereal: "🌽", Legume: "🫘",
    Berry: "🫐", Plant: "🌱", Seafood: "🦐",
    "Beverage Caffeinated": "☕", "Beverage Alcoholic": "🍷",
    Flower: "🌸", "Essential Oil": "🧴", Maize: "🌽",
  };
  return map[cat] || "🍽️";
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  // Group entities by category
  const categories = useMemo(() => {
    const map = {};
    entitiesData.forEach((e) => {
      if (!map[e.category]) map[e.category] = [];
      map[e.category].push(e);
    });
    return Object.entries(map)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([name, items]) => ({ name, items, count: items.length }));
  }, []);

  // Filtered list when a category is selected
  const ingredientsInCategory = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = categories.find((c) => c.name === selectedCategory);
    if (!cat) return [];
    if (!searchQuery.trim()) return cat.items;
    return cat.items.filter((i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedCategory, searchQuery, categories]);

  // Flavor profile for selected ingredient
  const flavorProfile = useMemo(() => {
    if (!selectedIngredient) return null;
    return flavorData.find((f) => f.entity_id === selectedIngredient.entity_id) || null;
  }, [selectedIngredient]);

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      <div className="container">
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
            <h1>Food <span className="gradient-text">Explorer</span></h1>
            <p>Browse all {entitiesData.length} ingredients by category, explore their molecular profiles.</p>
          </motion.div>
        </div>

        {/* Breadcrumb */}
        {selectedCategory && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
            <button
              onClick={() => { setSelectedCategory(null); setSelectedIngredient(null); setSearchQuery(""); }}
              style={{ background: "none", border: "none", color: "var(--amber-400)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "14px" }}
            >
              All Categories
            </button>
            <span>›</span>
            <span style={{ color: "var(--text-primary)" }}>{selectedCategory}</span>
            {selectedIngredient && (
              <>
                <span>›</span>
                <span style={{ color: "var(--text-primary)" }}>{selectedIngredient.name}</span>
              </>
            )}
          </div>
        )}

        {/* Category Grid */}
        {!selectedCategory && (
          <>
            {/* Search box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ maxWidth: "480px", margin: "0 auto 40px" }}
            >
              <div style={{
                display: "flex", alignItems: "center", background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: "var(--radius-full)", padding: "0 20px",
              }}>
                <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search a category..."
                  style={{
                    flex: 1, padding: "13px 12px", background: "transparent",
                    border: "none", outline: "none", color: "var(--text-primary)", fontSize: "15px",
                  }}
                />
              </div>
            </motion.div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px", paddingBottom: "80px",
            }}>
              {categories
                .filter((c) => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                  >
                    <button
                      onClick={() => { setSelectedCategory(cat.name); setSearchQuery(""); }}
                      style={{
                        width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)", padding: "24px 20px", cursor: "pointer",
                        textAlign: "left", transition: "all 0.3s ease", display: "flex",
                        flexDirection: "column", gap: "8px",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = CATEGORY_COLORS[cat.name] || "var(--border-hover)";
                        e.currentTarget.style.background = "var(--bg-card-hover)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.background = "var(--bg-card)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <span style={{ fontSize: "2rem" }}>{getCategoryEmoji(cat.name)}</span>
                      <div style={{
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        fontSize: "1rem", color: "var(--text-primary)",
                      }}>
                        {cat.name}
                      </div>
                      <div style={{
                        fontSize: "12px", color: CATEGORY_COLORS[cat.name] || "var(--amber-400)",
                        fontWeight: 600,
                      }}>
                        {cat.count} ingredients
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {cat.items.slice(0, 3).map((i) => i.name).join(", ")}
                        {cat.count > 3 && ` +${cat.count - 3} more`}
                      </div>
                    </button>
                  </motion.div>
                ))}
            </div>
          </>
        )}

        {/* Ingredient list inside category */}
        {selectedCategory && !selectedIngredient && (
          <>
            <div style={{ maxWidth: "480px", marginBottom: "28px" }}>
              <div style={{
                display: "flex", alignItems: "center", background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: "var(--radius-full)", padding: "0 20px",
              }}>
                <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${selectedCategory}...`}
                  style={{
                    flex: 1, padding: "13px 12px", background: "transparent",
                    border: "none", outline: "none", color: "var(--text-primary)", fontSize: "15px",
                  }}
                />
              </div>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px", paddingBottom: "80px",
            }}>
              {ingredientsInCategory.map((item, i) => {
                const hasProfile = flavorData.some((f) => f.entity_id === item.entity_id);
                return (
                  <motion.div
                    key={item.entity_id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                  >
                    <button
                      onClick={() => setSelectedIngredient(item)}
                      style={{
                        width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)", padding: "16px 18px", cursor: "pointer",
                        textAlign: "left", transition: "all 0.25s ease",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-hover)";
                        e.currentTarget.style.background = "var(--bg-card-hover)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.background = "var(--bg-card)";
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                          {item.name}
                        </div>
                        {hasProfile && (
                          <div style={{ fontSize: "11px", color: "var(--green-400)", marginTop: "3px" }}>
                            ✓ Profile available
                          </div>
                        )}
                      </div>
                      <ArrowRight size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Ingredient detail */}
        {selectedIngredient && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ paddingBottom: "80px" }}
            >
              <div className="card" style={{ marginBottom: "24px", textAlign: "center" }}>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{selectedIngredient.name}</h2>
                <div className="badge">{selectedIngredient.category}</div>
              </div>

              {flavorProfile ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                    <div className="card">
                      <h3 style={{ fontSize: "1rem", marginBottom: "12px" }}>Flavor Notes</h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {flavorProfile.flavor_profile.map((f) => (
                          <span key={f} style={{
                            padding: "5px 12px", borderRadius: "var(--radius-full)",
                            background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)",
                            fontSize: "12px", color: "var(--amber-300)",
                          }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <h3 style={{ fontSize: "1rem", marginBottom: "12px" }}>Taste Dimensions</h3>
                      {Object.entries(flavorProfile.taste_dimensions)
                        .filter(([, v]) => v > 0)
                        .sort((a, b) => b[1] - a[1])
                        .map(([taste, val]) => (
                          <div key={taste} style={{ marginBottom: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                              <span style={{ fontSize: "12px", textTransform: "capitalize", color: "var(--text-secondary)" }}>{taste}</span>
                              <span style={{ fontSize: "12px", color: "var(--amber-400)", fontWeight: 600 }}>{Math.round(val * 100)}%</span>
                            </div>
                            <div style={{ width: "100%", height: "5px", background: "rgba(253,248,237,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ width: `${val * 100}%`, height: "100%", background: "var(--amber-400)", borderRadius: "3px" }} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <DynamicNetwork
                    title="🏷️ Flavor Profile Network"
                    description={`Dominant taste notes in ${selectedIngredient.name}`}
                    centerLabel={selectedIngredient.name}
                    nodeColor="#4ade80"
                    items={flavorProfile.flavor_profile.map((f, i) => ({ id: `f-${i}`, label: f, value: 10 }))}
                  />

                  <DynamicNetwork
                    title="🧪 Molecular Composition"
                    description={`Key molecules in ${selectedIngredient.name}`}
                    centerLabel={selectedIngredient.name}
                    nodeColor="#a78bfa"
                    items={flavorProfile.top_molecules.map((m, i) => ({ id: `m-${i}`, label: m.name, value: 12 }))}
                  />
                </>
              ) : (
                <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🔬</div>
                  <h3 style={{ color: "var(--amber-400)", marginBottom: "12px" }}>Full Profile — Coming Soon</h3>
                  <p style={{ color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto" }}>
                    Detailed molecular data for <strong style={{ color: "var(--text-primary)" }}>{selectedIngredient.name}</strong> will be
                    available with the FlavorDB API integration. Browse other ingredients with ✓ profiles for full analytics.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
