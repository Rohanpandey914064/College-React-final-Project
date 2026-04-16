import { useEffect, useRef, useState, useCallback } from "react";

export default function DynamicNetwork({ title, description, centerLabel, items, nodeColor }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const reqRef = useRef();
  const dragRef = useRef({ id: null, offsetX: 0, offsetY: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  // Initialize Nodes
  useEffect(() => {
    if (!canvasRef.current) return;
    const width = 800;
    const height = 500;

    const centerNode = {
      id: "center",
      label: centerLabel,
      type: "center",
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: 45,
      color: "#fbbf24",
    };

    const satelliteNodes = items.map((item, i) => {
      const angle = (i / items.length) * Math.PI * 2;
      const dist = 140 + Math.random() * 80;
      return {
        id: item.id,
        label: item.label,
        type: "satellite",
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: 12 + (item.value ? Math.min(item.value, 8) : 0),
        color: nodeColor,
      };
    });

    setNodes([centerNode, ...satelliteNodes]);
  }, [centerLabel, items, nodeColor]);

  // Animation Loop
  useEffect(() => {
    if (nodes.length === 0) return;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      nodes.forEach((node, i) => {
        if (node.isDragging) {
          node.x = mouseRef.current.x;
          node.y = mouseRef.current.y;
          node.vx = 0;
          node.vy = 0;
          return;
        }

        if (node.type === "center") {
          node.vx += (width / 2 - node.x) * 0.02;
          node.vy += (height / 2 - node.y) * 0.02;
        } else {
          const center = nodes[0];
          const dx = center.x - node.x;
          const dy = center.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - 180) * 0.0015;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;

          nodes.forEach((other, j) => {
            if (i === j) return;
            const ox = other.x - node.x;
            const oy = other.y - node.y;
            const odist = Math.sqrt(ox * ox + oy * oy) || 1;
            if (odist < 120) {
              const rep = 250 / (odist * odist);
              node.vx -= (ox / odist) * rep;
              node.vy -= (oy / odist) * rep;
            }
          });
        }

        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      });

      // Draw Connections
      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        if (node.type === "satellite") {
          ctx.beginPath();
          ctx.moveTo(nodes[0].x, nodes[0].y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.stroke();
        }
      });

      // Draw Nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = node.type === "center" ? "rgba(251, 191, 36, 0.15)" : `${node.color}22`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (node.type === "satellite") {
          ctx.fillStyle = "rgba(30, 30, 30, 0.9)";
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = node.color;
        }
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = node.type === "center" ? "bold 15px sans-serif" : "600 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (node.label.length > 12 && node.type === "satellite") {
          const words = node.label.split(" ");
          if (words.length > 1) {
            ctx.fillText(words[0], node.x, node.y - 6);
            ctx.fillText(words.slice(1).join(" "), node.x, node.y + 8);
          } else {
            ctx.fillText(node.label.substring(0, 10) + "-", node.x, node.y - 6);
            ctx.fillText(node.label.substring(10), node.x, node.y + 8);
          }
        } else {
          ctx.fillText(node.label, node.x, node.y);
        }
      });

      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqRef.current);
  }, [nodes]);

  const handleMouseDown = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    mouseRef.current = { x, y };

    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < (node.radius + 10) ** 2) {
        dragRef.current = { id: node.id, offsetX: dx, offsetY: dy };
        node.isDragging = true;
        return;
      }
    }
  }, [nodes]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    mouseRef.current = { x, y };

    if (!dragRef.current.id) {
      canvas.style.cursor = "default";
      for (const node of nodes) {
        const dx = x - node.x;
        const dy = y - node.y;
        if (dx * dx + dy * dy < node.radius ** 2) {
          canvas.style.cursor = "grab";
          break;
        }
      }
    }
  }, [nodes]);

  const handleMouseUp = useCallback(() => {
    if (dragRef.current.id) {
      const node = nodes.find((n) => n.id === dragRef.current.id);
      if (node) node.isDragging = false;
      dragRef.current.id = null;
    }
  }, [nodes]);

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      <div
        style={{ position: "absolute", top: 16, left: 20, zIndex: 10, pointerEvents: "none" }}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text-primary)" }}>{title}</h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{description}</p>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ width: "100%", height: "auto", display: "block", cursor: "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />
    </div>
  );
}
