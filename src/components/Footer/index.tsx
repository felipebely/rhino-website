import { useState } from "react";
import { Link } from "react-router-dom";

type FooterProps = {
  topGap?: number;
};

const siteLinks = [
  { to: "/", label: "Home" },
  { to: "/sobre-nos", label: "Sobre Nós" },
  { to: "/menus", label: "Menus" },
  { to: "/produtos", label: "Produtos" },
  { to: "/galeria", label: "Galeria" },
  { to: "/contato", label: "Contato" },
  { to: "/newsletter", label: "Newsletter" },
];

export const Footer = ({ topGap = 220 }: FooterProps) => {
  const [email, setEmail] = useState("");

  return (
    <>
      <div style={{ height: topGap }} aria-hidden />

      <footer className="w-full bg-black text-white font-work-sans pt-16 pb-12">
        {/* Top Section: Flex container to push Subscribe left and Links right */}
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-start gap-16 md:gap-0 mb-24">

          {/* LEFT: Newsletter Section */}
          <div className="w-full max-w-md">
            <h4 className="text-md font-bold uppercase tracking-widest mb-6">
              Inscreva-se
            </h4>
            <p className="text-sm font-bold mb-6 max-w-xs">
              Cadastre-se em nossa Newsletter.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-4 w-full"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                required
                className="flex-1 px-4 py-3 text-sm bg-white text-black placeholder-gray-500 outline-none rounded-none border-none"
              />
              <button
                type="submit"
                className="px-8 py-3 text-sm font-bold uppercase tracking-wider border border-white bg-transparent text-white hover:bg-white hover:text-black transition-colors rounded-none whitespace-nowrap"
              >
                Inscrever
              </button>
            </form>
            <p className="text-xs font-bold mt-4">
              Respeitamos sua privacidade.
            </p>
          </div>

          {/* RIGHT: Links Section (Grouped) */}
          <div className="flex flex-row gap-16 sm:gap-32">

            {/* Mapa do Site */}
            <div>
              <h4 className="text-md font-bold uppercase tracking-widest mb-6">
                Mapa do Site
              </h4>
              <ul className="space-y-3">
                {siteLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm font-medium uppercase text-gray-300 hover:text-white underline decoration-gray-600 underline-offset-4 hover:decoration-white transition-all"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Siga-nos */}
            <div>
              <h4 className="text-md font-bold uppercase tracking-widest mb-6">
                Redes
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.instagram.com/orhinocozinha/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium uppercase text-gray-300 hover:text-white underline decoration-gray-600 underline-offset-4 hover:decoration-white transition-all"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5551991632950"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium uppercase text-gray-300 hover:text-white underline decoration-gray-600 underline-offset-4 hover:decoration-white transition-all"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom: Rhino Logo (Centered) */}
        <div className="w-full flex justify-center items-center px-6">
          <img
            src="/logos/logo_black_2.jpg"
            alt="Rhino Footer Logo"
            className="w-full max-w-[280px] object-contain opacity-90"
          />
        </div>
      </footer>
    </>
  );
};