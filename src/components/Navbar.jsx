import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
  const { currentUser, logout } = useAuth();

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
          <span style={{ fontSize: "1.5rem" }}></span>
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

        {/* Auth section */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-nav">
          {currentUser ? (
            <>
              <div className="nav-user-badge">
                <div className="nav-avatar">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
                {currentUser.name}
              </div>
              <button className="nav-logout-btn" onClick={logout} title="Logout">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-auth-btn nav-login-btn">
                Sign In
              </Link>
              <Link to="/signup" className="nav-auth-btn nav-signup-btn">
                Sign Up
              </Link>
            </>
          )}
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
          {/* Mobile auth */}
          <div style={{ borderTop: "1px solid var(--border)", marginTop: "8px", paddingTop: "8px" }}>
            {currentUser ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(244,63,94,0.08)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--rose-400)",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <LogOut size={15} /> Logout ({currentUser.name})
              </button>
            ) : (
              <div style={{ display: "flex", gap: "8px" }}>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="nav-auth-btn nav-login-btn"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="nav-auth-btn nav-signup-btn"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
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
