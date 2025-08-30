export function HeroSection({
  containerRef,
  imageOpacity,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  imageOpacity: number;
}) {
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
    </div>
  );
}
