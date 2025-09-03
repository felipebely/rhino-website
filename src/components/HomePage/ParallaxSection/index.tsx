import { useRef, useEffect } from "react";

export function ParallaxSection({
  setScrollY,
  setViewportHeight,
}: {
  setScrollY: (value: number) => void;
  setViewportHeight: (value: number) => void;
}) {
  const videoWrapRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY || 0;
      setScrollY(sy);
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
  }, [setScrollY, setViewportHeight]);

  return (
    <section
      ref={videoWrapRef}
      className="relative overflow-hidden w-full max-h-[600px] bg-black lg:flex lg:items-center lg:justify-center"
    >
      <video
        className="h-screen w-auto mx-auto object-cover aspect-[3/2]"
        src="/videos/video_1.mp4"
        playsInline
        muted
        autoPlay
        loop
      />
    </section>
  );
}
