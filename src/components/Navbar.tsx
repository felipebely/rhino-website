// components/Navbar.tsx
import type React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

type NavbarProps = {
  smallLogoOpacity?: number;
  brandShift?: number;
  centerBrandOpacity?: number;
};

type AppLink = { to: string; label: string };

export default function Navbar({
  smallLogoOpacity = 0,
  brandShift = 0,
  centerBrandOpacity = 1,
}: NavbarProps) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const links: AppLink[] = [
    { to: "/sobre-nos", label: "Sobre Nós" },
    { to: "/menus", label: "Menus" },
    { to: "/galeria", label: "Galeria" },
    { to: "/contato", label: "Contato" },
  ];

  // Handle clicks: if already on page, just scroll top; else let router navigate
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black text-white">
      <style>{`
        .nav-link {
          position: relative;
          padding: 0 .5rem;
          color: #fff;
          text-decoration: none;
        }
        .nav-link::before,
        .nav-link::after {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 180ms ease, transform 180ms ease;
          color: currentColor;
          pointer-events: none;
          content: "";
        }
        .nav-link::before {
          content: "[ ";
          left: 0;
          transform: translate(-0.35rem, -50%);
        }
        .nav-link::after {
          content: " ]";
          right: 0;
          transform: translate(0.35rem, -50%);
        }
        .nav-link:hover::before,
        .nav-link:hover::after,
        .nav-link.is-active::before,
        .nav-link.is-active::after {
          opacity: 1;
          transform: translate(0, -50%);
        }
      `}</style>

      <nav className="mx-auto px-6">
        <div className="h-28 flex items-center justify-between relative ml-10">
          {/* LEFT: logo + brand */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center gap-3 select-none"
            aria-label="Go to home"
            style={{
              transform: `translateX(${(-1 + brandShift) * 24}px)`,
              transition: "transform 240ms ease",
              color: "#fff",
              textDecoration: "none",
              fontFamily: "Work Sans, sans-serif",
            }}
          >
            <img
              src="/logos/logo_black.jpg"
              alt="Rhino logo"
              className="h-14 w-auto"
              style={{ opacity: smallLogoOpacity, transition: "opacity 240ms ease" }}
            />
            <div
              className="text-2xl sm:text-3xl font-bold tracking-wider"
              style={{
                opacity: brandShift,
                transition: "opacity 240ms ease",
                whiteSpace: "nowrap",
                color: "#fff",
              }}
            >
              {isHome ? "[RHINO]" : "RHINO"}
            </div>
          </Link>

          {/* CENTER: only on home */}
          {isHome && (
            <div
              className="absolute left-1/2 -translate-x-1/2 text-6xl font-bold tracking-wider pointer-events-none select-none"
              style={{
                fontFamily: "Work Sans, sans-serif",
                color: "#fff",
                opacity: centerBrandOpacity,
                transition: "opacity 240ms ease",
                whiteSpace: "nowrap",
              }}
            >
              RHINO
            </div>
          )}

          {/* RIGHT: nav links */}
          <ul
            className="hidden sm:flex items-center gap-10 mr-10"
            style={{ fontFamily: "Work Sans, sans-serif", fontWeight: 700 }}
          >
            {links.map(({ to, label }) => (
              <li key={to} className="text-lg">
                <NavLink
                  to={to}
                  end
                  onClick={(e) => handleNavClick(e, to)}
                  className={({ isActive }: { isActive: boolean }) =>
                    `nav-link ${isActive ? "is-active" : ""}`
                  }
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontFamily: "Work Sans, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger (visual only) */}
          <button
            className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 ml-auto"
            aria-label="Open menu"
            type="button"
          >
            <span className="block w-5 h-0.5 bg-white mb-1.5" />
            <span className="block w-5 h-0.5 bg-white mb-1.5" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>
        </div>
      </nav>
    </header>
  );
}
