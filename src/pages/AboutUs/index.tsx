// src/pages/SobreNos.tsx
import { useEffect, useRef, useState } from "react";
import type React from "react";

/** Fade + hover-swap image (in-view fade, hover crossfade) + hover gray + center label on hover */
function FadeSwapImg({
  baseSrc,
  hoverSrc,
  alt,
  label,
  className,
  style,
  imgClassName = "absolute inset-0 w-full h-full object-cover",
  hoverGray = 0.25, // 0..1
}: {
  baseSrc: string;
  hoverSrc: string;
  alt: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  imgClassName?: string;
  hoverGray?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [baseLoaded, setBaseLoaded] = useState(false);
  const [hoverLoaded, setHoverLoaded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hoverEver, setHoverEver] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        }
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hoverFilter = `grayscale(${Math.round(hoverGray * 100)}%) brightness(0.96)`;

  return (
    <div
      ref={wrapperRef}
      className={`group relative bg-neutral-300 ${className ?? ""}`}
      style={style}
      onMouseEnter={() => {
        setHovering(true);
        if (!hoverEver) setHoverEver(true);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Base image */}
      {inView && (
        <img
          src={baseSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setBaseLoaded(true)}
          className={[
            imgClassName,
            "transition-opacity duration-300 ease-out",
            hovering && hoverLoaded ? "opacity-0" : baseLoaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            filter: baseLoaded ? (hovering ? hoverFilter : "none") : "grayscale(100%)",
            willChange: "opacity, filter",
          }}
        />
      )}

      {/* Hover image (mounted after first hover) */}
      {inView && hoverEver && (
        <img
          src={hoverSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setHoverLoaded(true)}
          className={[
            imgClassName,
            "transition-opacity duration-300 ease-out",
            hovering ? (hoverLoaded ? "opacity-100" : "opacity-0") : "opacity-0",
          ].join(" ")}
          style={{
            filter: hoverLoaded ? (hovering ? hoverFilter : "none") : "grayscale(100%)",
            willChange: "opacity, filter",
          }}
        />
      )}

      {/* Center label — only visible on hover */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out
                     text-white text-2xl sm:text-3xl md:text-4xl font-bold
                     drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
          style={{ fontFamily: "'DM Serif Text', serif" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export function SobreNos() {
  // Separate sources per image (easy to change later)
  const IMG1 = { base: "/pictures/pic_11.jpg", hover: "/pictures/pic_12.jpg", label: "Guilherme", alt: "Sobre Nós imagem 1" };
  const IMG2 = { base: "/pictures/pic_9.jpg",  hover: "/pictures/pic_10.jpg", label: "Paulo",     alt: "Sobre Nós imagem 2" };
  const IMG3 = { base: "/pictures/pic_14.jpg", hover: "/pictures/pic_13.jpg", label: "Mathias",   alt: "Sobre Nós imagem 3" };

  return (
    <main className="bg-white">
      <section className="px-4 md:px-8 py-16">
        {/* Centered title with extra width to fit one line on large screens */}
        <div className="mx-auto w-full max-w-[1600px]">
          <h1
            className="text-center font-bold text-black tracking-tight
                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'DM Serif Text', serif" }}
          >
            Criando experiências através de alimentos &amp; bebidas.
          </h1>
        </div>

        {/* Images: 1 per row on small, 3 per row from md+; large tiles with 4:5 ratio */}
        <div className="mx-auto mt-12 w-full max-w-[1600px] grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[IMG1, IMG2, IMG3].map((cfg, i) => (
            <div key={i} className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
              <FadeSwapImg
                baseSrc={cfg.base}
                hoverSrc={cfg.hover}
                alt={cfg.alt}
                label={cfg.label}
                className="absolute inset-0 w-full h-full overflow-hidden"
                imgClassName="absolute inset-0 w-full h-full object-cover"
                hoverGray={0.25}
              />
            </div>
          ))}
        </div>

        {/* Paragraph beneath the images; left-aligned text in a centered container */}
        <div className="mx-auto mt-12 w-full max-w-[1000px]">
          <p
            className="text-lg leading-relaxed text-left"
            style={{ fontFamily: "'DM Serif Text', serif" }}
          >
            “At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
            occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
            distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
            quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis
            dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum
            necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non
            recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
            voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.”
          </p>
        </div>
      </section>
    </main>
  );
}
