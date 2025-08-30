import { useRef, useState, useEffect } from "react";

export function ParallaxSection({
  setScrollY,
  setViewportHeight,
}: {
  setScrollY: (value: number) => void;
  setViewportHeight: (value: number) => void;
}) {
  const videoWrapRef = useRef<HTMLElement | null>(null);
  const [videoParallax, setVideoParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY || 0;
      setScrollY(sy);

      const el = videoWrapRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const factor = -0.9;
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

  return (
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
  );
}
