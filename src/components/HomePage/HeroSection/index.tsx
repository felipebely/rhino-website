export function HeroSection({ imageOpacity }: { imageOpacity: number }) {
  return (
    <div className="w-full bg-black overflow-hidden h-[calc(100vh-var(--spacing-navbar-mobile))] mt-16 lg:h-[calc(100vh-var(--spacing-navbar-desktop))] lg:mt-28">
      <div
        className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center"
        style={{ margin: "inherit" }}
      >
        <div className="flex flex-col">
          <img
            src="/logos/logo_black.jpg"
            alt="Rhino Logo"
            className="object-contain max-h-[70vh] max-w-[80vw]"
            style={{ opacity: imageOpacity }}
          />
          <div
            className="text-white text-2xl sm:text-3xl text-center px-4 mt-8"
            style={{ fontFamily: "'DM Serif Text', serif" }}
          >
            Criando experiências através de alimentos & bebidas.
          </div>
        </div>
      </div>
    </div>
  );
}
