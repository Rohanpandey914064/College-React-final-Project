import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/deconstruct", label: "Deconstruct" },
  { href: "/substitute", label: "Substitute" },
  { href: "/explore", label: "Explore" },
  { href: "/visualize", label: "Visualize" },
  { href: "/localize", label: "Localize" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.3rem",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🧬</span>
          <span className="gradient-text">ByteBite</span>
        </Link>

        {/* Desktop nav */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                fontSize: "14px",
                fontWeight: 500,
                color: pathname === link.href ? "var(--accent)" : "var(--text-muted)",
                background: pathname === link.href ? "rgba(251,191,36,0.1)" : "transparent",
                transition: "all 0.3s ease",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            color: "var(--text-primary)",
            padding: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            zIndex: 99,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                fontSize: "15px",
                fontWeight: 500,
                color: pathname === link.href ? "var(--accent)" : "var(--text-secondary)",
                background: pathname === link.href ? "rgba(251,191,36,0.1)" : "transparent",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}
