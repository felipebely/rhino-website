// components/Navbar.tsx
import type React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

type NavbarProps = {
  smallLogoOpacity?: number;
  brandShift?: number;
  centerBrandOpacity?: number;
};

type AppLink = { to: string; label: string };

export const Navbar = ({
  smallLogoOpacity = 0,
  brandShift = 0,
  centerBrandOpacity = 1,
}: NavbarProps) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links: AppLink[] = [
    { to: "/newsletter", label: "Newsletter" },
    { to: "/sobre-nos", label: "Sobre Nós" },
    { to: "/menus", label: "Menus" },
    { to: "/produtos", label: "Produtos" },
    { to: "/galeria", label: "Galeria" },
    { to: "/contato", label: "Contato" },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle clicks: if already on page, just scroll top; else let router navigate
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    to: string
  ) => {
    if (pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black text-white">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 sm:h-28 flex items-center justify-between relative">
          {/* LEFT: logo + brand */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="flex items-center gap-2 sm:gap-3 select-none transition-transform duration-[240ms] ease-in-out"
            aria-label="Go to home"
            style={{
              transform: `translateX(${(-1 + brandShift) * 24}px)`,
            }}
          >
            <img
              src="/logos/logo_black.jpg"
              alt="Rhino logo"
              className="h-10 w-auto sm:h-14 transition-opacity duration-[240ms] ease-in-out"
              style={{ opacity: smallLogoOpacity }}
            />
            <div
              className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider font-work-sans transition-opacity duration-[240ms] ease-in-out whitespace-nowrap"
              style={{ opacity: brandShift }}
            >
              {isHome ? "[RHINO]" : "RHINO"}
            </div>
          </Link>

          {/* CENTER: only on home and larger screens */}
          {isHome && (
            <div
              className="block absolute left-1/2 -translate-x-1/2 text-4xl xl:text-6xl font-bold tracking-wider pointer-events-none select-none font-work-sans transition-opacity duration-[240ms] ease-in-out whitespace-nowrap"
              style={{ opacity: centerBrandOpacity }}
            >
              RHINO
            </div>
          )}

          {/* RIGHT: desktop nav links */}
          <ul className="hidden lg:flex items-center gap-10 xl:gap-12 mr-10 font-work-sans font-bold">
            {links.map(({ to, label }) => (
              <li key={to} className="text-base xl:text-lg group">
                <NavLink
                  to={to}
                  end
                  onClick={(e) => handleNavClick(e, to)}
                  className="relative text-white no-underline transition-all duration-[180ms] ease-in-out"
                >
                  {({ isActive }: { isActive: boolean }) => (
                    <>
                      <span
                        className={`absolute -left-1 top-1/2 -translate-y-1/2 transition-all duration-[180ms] ease-in-out pointer-events-none text-white ${isActive
                            ? "opacity-100 -translate-x-1"
                            : "opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
                          }`}
                      >
                        [
                      </span>
                      {label}
                      <span
                        className={`absolute -right-1 top-1/2 -translate-y-1/2 transition-all duration-[180ms] ease-in-out pointer-events-none text-white ${isActive
                            ? "opacity-100 translate-x-1"
                            : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                          }`}
                      >
                        ]
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger menu */}
          <button
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-white/10 transition-colors duration-200 ml-auto"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
            type="button"
          >
            <div className="relative w-6 h-6">
              {/* Top line */}
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-white transition-all duration-300 ease-in-out origin-center ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
              />
              {/* Middle line */}
              <span
                className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transition-all duration-300 ease-in-out -translate-y-1/2 ${isMobileMenuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
              />
              {/* Bottom line */}
              <span
                className={`absolute bottom-0 left-0 w-6 h-0.5 bg-white transition-all duration-300 ease-in-out origin-center ${isMobileMenuOpen ? "-rotate-45 -translate-y-3.5" : ""
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-sm border-t border-white/20 transition-all duration-300 ${isMobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
            }`}
        >
          <ul className="px-6 py-8 space-y-6 font-work-sans font-bold">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  onClick={(e) => handleNavClick(e, to)}
                  className={({ isActive }: { isActive: boolean }) =>
                    `block text-2xl transition-colors duration-200 ${isActive
                      ? "text-white border-l-4 border-white pl-4"
                      : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};
