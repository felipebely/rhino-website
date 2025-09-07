import { useEffect, useState } from "react";
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

  // Initialize viewport and scroll values
  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight || 0);
    const onScroll = () => setScrollY(window.scrollY || 0);
    onResize();
    onScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
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

  // Hero fade (tuned to sync with curtain collapse)
  const fadeStart = 0.05;
  const fadeEnd = 0.32;
  const tFade = clamp(
    (progressBlack - fadeStart) / Math.max(0.0001, fadeEnd - fadeStart),
    0,
    1
  );
  const smooth = tFade * tFade * (3 - 2 * tFade);
  const rawOpacity = 1 - smooth;
  const imageOpacity = clamp(Math.min(rawOpacity, blackCoverage - 0.01), 0, 1);

  // Brand crossfade
  const centerFadeOutStart = 0.2;
  const centerFadeOutEnd = 0.32;
  const tCenter = clamp(
    (progressBlack - centerFadeOutStart) /
      Math.max(0.0001, centerFadeOutEnd - centerFadeOutStart),
    0,
    1
  );
  const centerBrandOpacity = 1 - tCenter * tCenter * (3 - 2 * tCenter);

  const inlineFadeInStart = 0.34;
  const inlineFadeInEnd = 0.5;
  const tInline = clamp(
    (progressBlack - inlineFadeInStart) /
      Math.max(0.0001, inlineFadeInEnd - inlineFadeInStart),
    0,
    1
  );
  const inlineOpacity = tInline * tInline * (3 - 2 * tInline);
  const smallLogoOpacity = inlineOpacity;
  const brandShift = inlineOpacity;

  return (
    <>
      <Navbar
        smallLogoOpacity={smallLogoOpacity}
        brandShift={brandShift}
        centerBrandOpacity={centerBrandOpacity}
      />

      <HeroSection imageOpacity={imageOpacity} />
      <div className="h-screen bg-white z-20"></div>

      {/* <div
        className="sticky top-0 inset-0 h-svh z-20 pointer-events-none bg-white will-change-[clip-path]"
        style={{
          clipPath: `inset(${Math.max(0, blackBottom)}px 0 0 0)`,
          WebkitClipPath: `inset(${Math.max(0, blackBottom)}px 0 0 0)`,
        }}
      >
        <CurtainSection />
        <ParallaxSection
          setScrollY={setScrollY}
          setViewportHeight={setViewportHeight}
        />

        <AboutSection />
      </div> */}
      <Footer />
    </>
  );
}
