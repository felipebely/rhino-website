import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Navbar, Footer } from "../../components";

type CSSVars = React.CSSProperties & Record<string, string | number>;

/** Fade-in image: starts gray & hidden, fades in when intersecting AND loaded */
function FadeInImg({
  src,
  alt,
  className,
  imgClassName,
  style,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
  loading?: "eager" | "lazy";
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  return (
    <div ref={wrapperRef} className={`bg-neutral-300 ${className ?? ""}`} style={style}>
      {inView && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          className={[
            imgClassName ?? "",
            "transition-opacity duration-300 ease-out",
            loaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            filter: loaded ? "none" : "grayscale(100%)",
            willChange: "opacity, filter",
          }}
        />
      )}
    </div>
  );
}

export function Home() {
  const FOOTER_H = 224; // matches Footer height (2 × navbar)
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [videoParallax, setVideoParallax] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const curtainInnerRef = useRef<HTMLDivElement | null>(null);
  const videoWrapRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY || 0;
      setScrollY(sy);

      const el = videoWrapRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const factor = -0.9; // parallax depth
        setVideoParallax(rect.top * factor);
      }
    };

    const onResize = () => setViewportHeight(window.innerHeight || 0);
    onResize();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const el = curtainInnerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight || el.offsetHeight || 0);
    });
    ro.observe(el);
    setContentHeight(el.scrollHeight || el.offsetHeight || 0);
    return () => ro.disconnect();
  }, []);

  const navbarHeight = 112;
  const maxScrollForTransition = Math.max(1, viewportHeight - navbarHeight);
  const slowCollapseFactor = 0.6;
  const effectiveScroll = scrollY * slowCollapseFactor;
  const overlayHeight = Math.max(navbarHeight, viewportHeight - effectiveScroll);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const progressBlack = clamp(
    effectiveScroll / Math.max(1, maxScrollForTransition),
    0,
    1
  );
  const containerHasRoom = effectiveScroll < maxScrollForTransition;
  const blackBottom = overlayHeight - (containerHasRoom ? effectiveScroll : 0);
  const blackCoverage = clamp(blackBottom / Math.max(1, viewportHeight), 0, 1);

  // Hero fade
  const fadeStart = 0.0;
  const fadeEnd = 0.4;
  const tFade = clamp(
    (progressBlack - fadeStart) / Math.max(0.0001, fadeEnd - fadeStart),
    0,
    1
  );
  const smooth = tFade * tFade * (3 - 2 * tFade);
  const rawOpacity = 1 - smooth;
  const imageOpacity = clamp(Math.min(rawOpacity, blackCoverage - 0.01), 0, 1);

  // Brand crossfade
  const centerFadeOutStart = 0.24;
  const centerFadeOutEnd = 0.34;
  const tCenter = clamp(
    (progressBlack - centerFadeOutStart) /
      Math.max(0.0001, centerFadeOutEnd - centerFadeOutStart),
    0,
    1
  );
  const centerBrandOpacity = 1 - (tCenter * tCenter * (3 - 2 * tCenter));

  const inlineFadeInStart = 0.38;
  const inlineFadeInEnd = 0.52;
  const tInline = clamp(
    (progressBlack - inlineFadeInStart) /
      Math.max(0.0001, inlineFadeInEnd - inlineFadeInStart),
    0,
    1
  );
  const inlineOpacity = tInline * tInline * (3 - 2 * tInline);
  const smallLogoOpacity = inlineOpacity;
  const brandShift = inlineOpacity;

  const curtainLeadSpacer = Math.max(0, viewportHeight - navbarHeight);

  const captionStyle: React.CSSProperties = {
    fontFamily: "'DM Serif Text', serif",
    fontWeight: "bold",
    //fontStyle: "italic",
  };

  // ===== Proportional system (desktop heights in vw; mobile unified & taller) =====
  const MOBILE_H = 120; // all mobile images same tall height (in vw)
  const PIC1_H = 46; // desktop hero height
  const TWO_THIRDS = (2 / 3) * PIC1_H; // ~30.67vw
  const ONE_HALF = (1 / 2) * PIC1_H; // 23vw (kept for reference if needed)
  const FIVE_SIXTHS = (5 / 6) * PIC1_H; // ~38.33vw

  // Row 1
  const PIC2_H = TWO_THIRDS;
  const PIC2_TOP_OFFSET = PIC1_H / 3;

  // Row 2
  const PIC5_H = FIVE_SIXTHS; // Camarões
  const PIC4_H = TWO_THIRDS; // Bolo
  const PIC4_TOP_OFFSET = PIC5_H / 3;

  // Row 3
  const PIC3_H = TWO_THIRDS; // Lombo
  const PIC6_H = FIVE_SIXTHS; // Pêssegos
  const PIC6_TOP_OFFSET = PIC3_H / 3;

  return (
    <div className="bg-white min-h-screen relative" ref={containerRef}>
      {/* Fixed hero under the rising content */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/logos/logo_black.jpg"
            alt="Rhino Logo"
            className="object-contain max-h-[70vh] max-w-[80vw]"
            style={{ opacity: imageOpacity }}
          />
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 text-white text-2xl sm:text-3xl text-center px-4"
          style={{ bottom: "6vh", fontFamily: "'DM Serif Text', serif" }}
        >
          Criando experiências através de alimentos & bebidas.
        </div>
      </div>

      {/* Collapsing black header */}
      <div
        className="fixed top-0 left-0 w-full bg-black z-10 overflow-hidden"
        style={{
          height: `${overlayHeight}px`,
          transform: containerHasRoom ? `translateY(-${effectiveScroll}px)` : "none",
        }}
      />

      {/* Navbar */}
      <div className="relative z-40">
        <Navbar
          smallLogoOpacity={smallLogoOpacity}
          brandShift={brandShift}
          centerBrandOpacity={centerBrandOpacity}
        />
      </div>

      {/* Curtain content */}
      <div
        className="fixed inset-0 z-30 pointer-events-auto bg-white will-change-[clip-path]"
        style={{
          clipPath: `inset(${Math.max(0, blackBottom)}px 0 0 0)`,
          WebkitClipPath: `inset(${Math.max(0, blackBottom)}px 0 0 0)`,
        }}
      >
        <div
          ref={curtainInnerRef}
          style={{ transform: `translateY(-${scrollY}px)`, willChange: "transform" }}
        >
          <div style={{ height: curtainLeadSpacer }} />
          <div className="pt-28" />

          <main className="bg-white">
            {/* ================== IMAGE MOSAIC ================== */}
            <section className="bg-white">
              <div className="mx-auto px-4 sm:px-6 py-12 space-y-24">
                {/* ---------- ROW 1 (pics 1 & 2) ---------- */}
                <div className="grid grid-cols-1 md:grid-cols-[minmax(5vw,1fr)_minmax(30vw,38vw)_minmax(9vw,12vw)_minmax(28vw,34vw)_minmax(5vw,1fr)] items-start gap-y-10 md:gap-y-0">
                  {/* pic_1 (hero) */}
                  <figure className="group md:col-start-2 md:col-end-3 flex flex-col items-center md:items-start">
                    <FadeInImg
                      src="/pictures/pic_1.jpg"
                      alt="pic_1"
                      className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)]"
                      imgClassName="absolute inset-0 w-full h-full object-cover"
                      style={
                        {
                          ["--h-sm"]: `${MOBILE_H}vw`,
                          ["--h"]: `${PIC1_H}vw`,
                        } as CSSVars
                      }
                    />
                    <figcaption
                      className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full"
                      style={captionStyle}
                    >
                      Espuma Cremoux de Chocolate branco com Tartar de Cítricos & Citrus Bergamia
                    </figcaption>
                  </figure>

                  {/* pic_2 */}
                  <figure className="group md:col-start-4 md:col-end-5 flex flex-col items-center md:items-end">
                    <FadeInImg
                      src="/pictures/pic_2.jpg"
                      alt="pic_2"
                      className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:mt-[var(--mt)]"
                      imgClassName="absolute inset-0 w-full h-full object-cover"
                      style={
                        {
                          ["--h-sm"]: `${MOBILE_H}vw`,
                          ["--h"]: `${PIC2_H}vw`,
                          ["--mt"]: `${PIC2_TOP_OFFSET}vw`,
                        } as CSSVars
                      }
                    />
                    <figcaption
                      className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full md:text-right"
                      style={captionStyle}
                    >
                      Pizza de Queijo Brie, Mel, Amêndoas, e Damasco com Alecrim
                    </figcaption>
                  </figure>
                </div>

                {/* ---------- ROW 2 (pics 5 & 4) ---------- */}
                <div className="grid grid-cols-1 md:grid-cols-[minmax(5vw,1fr)_minmax(28vw,34vw)_minmax(9vw,12vw)_minmax(30vw,38vw)_minmax(5vw,1fr)] items-start gap-y-10 md:gap-y-0">
                  {/* pic_5 — Camarões (5/6) */}
                  <figure className="group md:col-start-2 md:col-end-3 flex flex-col items-center md:items-start">
                    <FadeInImg
                      src="/pictures/pic_5.jpg"
                      alt="pic_5"
                      className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:-mt-[1vw]"
                      imgClassName="absolute inset-0 w-full h-full object-cover"
                      style={
                        {
                          ["--h-sm"]: `${MOBILE_H}vw`,
                          ["--h"]: `${PIC5_H}vw`,
                        } as CSSVars
                      }
                    />
                    <figcaption
                      className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full"
                      style={captionStyle}
                    >
                      Camarões Borrachitos, Guanciale & Riso Al Salto
                    </figcaption>
                  </figure>

                  {/* pic_4 — Bolo (2/3), dropped by one-third of pic_5 */}
                  <figure className="group md:col-start-4 md:col-end-5 flex flex-col items-center md:items-end">
                    <FadeInImg
                      src="/pictures/pic_4.jpg"
                      alt="pic_4"
                      className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:mt-[var(--mt)]"
                      imgClassName="absolute inset-0 w-full h-full object-cover"
                      style={
                        {
                          ["--h-sm"]: `${MOBILE_H}vw`,
                          ["--h"]: `${PIC4_H}vw`,
                          ["--mt"]: `${PIC4_TOP_OFFSET}vw`,
                        } as CSSVars
                      }
                    />
                    <figcaption
                      className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full md:text-right"
                      style={captionStyle}
                    >
                      Bolo de nozes e especiarias, Cremoux 45% Mocaccino e Praline de nozes, Cremoux Doce de Leite com Manjericão e Gel de Tâmaras e Alcatrão
                    </figcaption>
                  </figure>
                </div>

                {/* ---------- ROW 3 (pics 3 & 6) ---------- */}
                <div className="grid grid-cols-1 md:grid-cols-[minmax(5vw,1fr)_minmax(30vw,36vw)_minmax(9vw,12vw)_minmax(30vw,38vw)_minmax(5vw,1fr)] items-start gap-y-10 md:gap-y-0">
                  {/* pic_3 — Lombo (2/3)*/}
                  <figure className="group md:col-start-2 md:col-end-3 flex flex-col items-center md:items-start">
                    <FadeInImg
                      src="/pictures/pic_3.jpg"
                      alt="pic_3"
                      className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:mt-[4vw]"
                      imgClassName="absolute inset-0 w-full h-full object-cover"
                      style={
                        {
                          ["--h-sm"]: `${MOBILE_H}vw`,
                          ["--h"]: `${PIC3_H}vw`,
                        } as CSSVars
                      }
                    />
                    <figcaption
                      className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full"
                      style={captionStyle}
                    >
                      Lombo de Bacalhau & Beurre Blanc de Cítricos com Tucupi
                    </figcaption>
                  </figure>

                  {/* pic_6 — Pêssegos (5/6), dropped by one-third of pic_3 */}
                  <figure className="group md:col-start-4 md:col-end-5 flex flex-col items-center md:items-end">
                    <FadeInImg
                      src="/pictures/pic_6.jpg"
                      alt="pic_6"
                      className="relative w-[92vw] md:w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] mt-0 md:mt-[var(--mt)]"
                      imgClassName="absolute inset-0 w-full h-full object-cover"
                      style={
                        {
                          ["--h-sm"]: `${MOBILE_H}vw`,
                          ["--h"]: `${PIC6_H}vw`,
                          ["--mt"]: `${PIC6_TOP_OFFSET}vw`,
                        } as CSSVars
                      }
                    />
                    <figcaption
                      className="mt-3 text-base opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-left w-full md:text-right"
                      style={captionStyle}
                    >
                      Pêssegos Amarelos em Brasa & Burrata
                    </figcaption>
                  </figure>
                </div>
              </div>
            </section>

            {/* ================== PARALLAX VIDEO ================== */}
            <section
              ref={videoWrapRef}
              className="relative overflow-hidden min-h-[40vh] md:min-h-[80vh] mt-48"
              style={{
                width: "100vw",
                marginLeft: "calc(50% - 50vw)",
                marginRight: "calc(50% - 50vw)",
                willChange: "transform",
              }}
            >
              <video
                className="absolute top-1/2 left-1/2 object-cover"
                style={{
                  minWidth: "110%",
                  minHeight: "110%",
                  transform: `translate(-50%, calc(-50% + ${videoParallax}px))`,
                }}
                src="/videos/video_1.mp4"
                playsInline
                muted
                autoPlay
                loop
              />
            </section>

            {/* ================== ABOUT SECTIONS (new) ================== */}
            <section className="bg-white">
              <div className="mx-auto px-4 sm:px-6 py-24 max-w-6xl">
                {/* Section 1: text left, image right (top-aligned) */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
                  style={{ ["--h-sm"]: "65vw", ["--h"]: "28vw" } as CSSVars}
                >
                  {/* Text */}
                  <div className="self-start">
                    <h2
                      className="text-3xl sm:text-4xl font-bold mb-4"
                      style={{ fontFamily: "'DM Serif Text', serif" }}
                    >
                      Quem Somos
                    </h2>
                    <p
                      className="text-lg leading-relaxed"
                      style={{ fontFamily: "'DM Serif Text', serif" }}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  {/* Image */}
                  <FadeInImg
                    src="/pictures/pic_7.jpg"
                    alt="Quem Somos"
                    className="relative w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)]"
                    imgClassName="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Section 2: image left, text right (top-aligned) */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mt-24"
                  style={{ ["--h-sm"]: "65vw", ["--h"]: "28vw" } as CSSVars}
                >
                  {/* Image */}
                  <FadeInImg
                    src="/pictures/pic_8.jpg"
                    alt="Nosso Projeto"
                    className="relative w-full overflow-hidden h-[var(--h-sm)] md:h-[var(--h)] order-1 md:order-none"
                    imgClassName="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Text */}
                  <div className="order-2 md:order-none self-start">
                    <h2
                      className="text-3xl sm:text-4xl font-bold mb-4"
                      style={{ fontFamily: "'DM Serif Text', serif" }}
                    >
                      Nosso Projeto
                    </h2>
                    <p
                      className="text-lg leading-relaxed"
                      style={{ fontFamily: "'DM Serif Text', serif" }}
                    >
                     Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* ===== Footer inside the curtain ===== */}
          <Footer />
        </div>
      </div>

      {/* Scroll proxy mirrors measured content so the page can scroll */}
      <div style={{ height: Math.max(contentHeight, viewportHeight + 1) }} />
    </div>
  );
}
