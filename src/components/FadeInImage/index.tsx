import { useEffect, useRef, useState } from "react";
import type React from "react";

export function FadeInImg({
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
    <div
      ref={wrapperRef}
      className={`bg-neutral-300 ${className ?? ""}`}
      style={style}
    >
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
