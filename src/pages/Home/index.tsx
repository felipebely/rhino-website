import { useEffect, useRef, useState } from "react";
import {
  Navbar,
  Footer,
  HeroSection,
  CurtainSection,
  ParallaxSection,
  AboutSection,
} from "../../components";

export function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const curtainInnerRef = useRef<HTMLDivElement | null>(null);

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
  const overlayHeight = Math.max(
    navbarHeight,
    viewportHeight - effectiveScroll
  );

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));
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
  const centerBrandOpacity = 1 - tCenter * tCenter * (3 - 2 * tCenter);

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

  return (
    <>
      {/* Collapsing black header */}
      <div
        className="fixed top-0 left-0 w-full bg-black z-10 overflow-hidden"
        style={{
          height: `${overlayHeight}px`,
          transform: containerHasRoom
            ? `translateY(-${effectiveScroll}px)`
            : "none",
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

      <HeroSection containerRef={containerRef} imageOpacity={imageOpacity} />

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
          style={{
            transform: `translateY(-${scrollY}px)`,
            willChange: "transform",
          }}
        >
          <div style={{ height: curtainLeadSpacer }} />

          <div className="bg-white">
            <CurtainSection />

            <ParallaxSection
              setScrollY={setScrollY}
              setViewportHeight={setViewportHeight}
            />

            <AboutSection />
          </div>

          {/* ===== Footer inside the curtain ===== */}
          <Footer />
        </div>
      </div>

      {/* Scroll proxy mirrors measured content so the page can scroll */}
      <div style={{ height: Math.max(contentHeight, viewportHeight + 1) }} />
    </>
  );
}
