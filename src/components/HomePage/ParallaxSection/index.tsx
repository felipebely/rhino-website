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
  }, []);

  return (
    <section
      ref={videoWrapRef}
      className="relative overflow-hidden min-h-svh w-full"
    >
      <video
        className="w-full "
        src="/videos/video_1.mp4"
        playsInline
        muted
        autoPlay
        loop
      />
    </section>
  );
}
