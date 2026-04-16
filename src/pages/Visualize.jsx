import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import entitiesData from "../data/entities.json";

const CATEGORY_COLORS = {
  Fruit: "#4ade80", Vegetable: "#22c55e", Herb: "#34d399",
  Spice: "#f59e0b", Dairy: "#38bdf8", Meat: "#f43f5e",
  Fish: "#fb7185", Bakery: "#fbbf24", Beverage: "#a78bfa",
  Seed: "#fb923c", Cereal: "#fde68a", Legume: "#2dd4bf",
  Berry: "#f0abfc", Plant: "#86efac", Seafood: "#67e8f9",
  "Beverage Caffeinated": "#c084fc", "Beverage Alcoholic": "#8b5cf6",
  Flower: "#f9a8d4", "Essential Oil": "#fde047", Maize: "#fcd34d",
  Additive: "#f0abfc",
};

// Build a static graph from entities — use first 50 entries + build random edges
function buildStaticGraph() {
  const subset = entitiesData.slice(0, 50);
  const nodes = subset.map((e, i) => ({
    id: e.entity_id,
    name: e.name,
    category: e.category,
    molecule_count: 10 + Math.floor(Math.random() * 40),
    x: undefined, y: undefined, vx: 0, vy: 0,
  }));

  // Build edges: connect nodes within same category + some cross-category
  const edges = [];
  nodes.forEach((a, i) => {
    nodes.forEach((b, j) => {
      if (j <= i) return;
      if (a.category === b.category && Math.random() < 0.4) {
        edges.push({ source: a.id, target: b.id, weight: 3 + Math.floor(Math.random() * 5) });
      } else if (Math.random() < 0.04) {
        edges.push({ source: a.id, target: b.id, weight: 1 });
      }
    });
  });

  return { nodes, edges };
}

export default function Visualize() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const { nodes: n, edges: e } = buildStaticGraph();
    const W = 900, H = 580;
    const initialized = n.map((node, i) => ({
      ...node,
      x: W / 2 + Math.cos((i / n.length) * Math.PI * 2) * 220 + (Math.random() - 0.5) * 80,
      y: H / 2 + Math.sin((i / n.length) * Math.PI * 2) * 180 + (Math.random() - 0.5) * 80,
      vx: 0, vy: 0,
    }));
    setNodes(initialized);
    setEdges(e);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const simulate = useCallback(() => {
    if (!canvasRef.current || nodes.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const nodeMap = new Map();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = (b.x || 0) - (a.x || 0);
        const dy = (b.y || 0) - (a.y || 0);
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 400 / (dist * dist);
        const fx = (dx / dist) * force, fy = (dy / dist) * force;
        a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy;
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const a = nodeMap.get(edge.source), b = nodeMap.get(edge.target);
      if (!a || !b) continue;
      const dx = (b.x || 0) - (a.x || 0), dy = (b.y || 0) - (a.y || 0);
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - 100) * 0.005;
      const fx = (dx / dist) * force, fy = (dy / dist) * force;
      a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
    }

    // Center gravity + dampen
    let hovered = null;
    for (const n of nodes) {
      n.vx = (n.vx || 0) + (W / 2 - (n.x || 0)) * 0.001;
      n.vy = (n.vy || 0) + (H / 2 - (n.y || 0)) * 0.001;
      n.vx *= 0.85; n.vy *= 0.85;
      n.x = Math.max(30, Math.min(W - 30, (n.x || 0) + (n.vx || 0)));
      n.y = Math.max(30, Math.min(H - 30, (n.y || 0) + (n.vy || 0)));

      const dx = (n.x || 0) - mouseRef.current.x;
      const dy = (n.y || 0) - mouseRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 18) hovered = n;
    }
    setHoveredNode(hovered);

    // Render
    ctx.fillStyle = "#1a1008";
    ctx.fillRect(0, 0, W, H);

    for (const edge of edges) {
      const a = nodeMap.get(edge.source), b = nodeMap.get(edge.target);
      if (!a || !b) continue;
      const isHighlighted = hovered && (hovered.id === edge.source || hovered.id === edge.target);
      ctx.beginPath();
      ctx.moveTo(a.x || 0, a.y || 0);
      ctx.lineTo(b.x || 0, b.y || 0);
      ctx.strokeStyle = isHighlighted
        ? `rgba(251,191,36,${0.3 + edge.weight * 0.06})`
        : `rgba(253,248,237,${0.03 + edge.weight * 0.015})`;
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();
    }

    for (const n of nodes) {
      const color = CATEGORY_COLORS[n.category] || "#fbbf24";
      const size = 5 + (n.molecule_count || 0) / 12;
      const isHovered = hovered?.id === n.id;
      const isConnected = hovered && edges.some(
        (e) => (e.source === hovered.id && e.target === n.id) || (e.target === hovered.id && e.source === n.id)
      );

      if (isHovered || isConnected) {
        ctx.beginPath();
        ctx.arc(n.x || 0, n.y || 0, size + 8, 0, Math.PI * 2);
        ctx.fillStyle = `${color}33`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x || 0, n.y || 0, isHovered ? size + 3 : size, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? "#fff" : isConnected ? color : `${color}aa`;
      ctx.fill();

      if (isHovered || isConnected) {
        ctx.font = `600 ${isHovered ? "13" : "11"}px 'DM Sans', sans-serif`;
        ctx.fillStyle = isHovered ? "#fbbf24" : "rgba(253,248,237,0.7)";
        ctx.textAlign = "center";
        ctx.fillText(n.name, n.x || 0, (n.y || 0) - size - 8);
      }
    }

    animRef.current = requestAnimationFrame(simulate);
  }, [nodes, edges]);

  useEffect(() => {
    if (nodes.length > 0) animRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animRef.current);
  }, [simulate, nodes.length]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  };

  // Get unique categories present in our 50-node subset
  const presentCategories = [...new Set(nodes.map((n) => n.category))];

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      <div className="container">
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🌐</div>
            <h1>Flavor <span className="gradient-text">Visualization</span></h1>
            <p>Interactive network graph showing how ingredients connect through shared flavor molecules.</p>
          </motion.div>
        </div>

        {nodes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="spinner" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)" }}>Building flavor network...</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div style={{
              position: "relative", maxWidth: "900px", margin: "0 auto",
              borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)",
            }}>
              <canvas
                ref={canvasRef}
                width={900}
                height={580}
                style={{ display: "block", width: "100%", cursor: "crosshair" }}
                onMouseMove={handleMouseMove}
              />
              {hoveredNode && (
                <div style={{
                  position: "absolute", top: "16px", right: "16px", padding: "16px",
                  background: "rgba(26,16,8,0.9)", backdropFilter: "blur(10px)",
                  borderRadius: "var(--radius-md)", border: "1px solid var(--border)", minWidth: "180px",
                }}>
                  <div style={{ fontWeight: 700, marginBottom: "4px" }}>{hoveredNode.name}</div>
                  <div className="badge" style={{ marginBottom: "8px" }}>{hoveredNode.category}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    ~{hoveredNode.molecule_count} flavor molecules
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div style={{
              maxWidth: "900px", margin: "24px auto 80px",
              display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center",
            }}>
              {presentCategories.map((cat) => (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: CATEGORY_COLORS[cat] || "#fbbf24" }} />
                  {cat}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
