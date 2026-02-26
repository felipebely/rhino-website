import { useEffect, useRef, useState } from "react";

// 1. Interfaces
interface GalleryItemData {
  id: number;
  height: string;
  color: string;
  title: string; // Kept in data for accessibility/alt text later, but hidden in grid
}

interface MasonryItemProps extends GalleryItemData {
  delayClass: string;
  onClick: () => void;
}

// 2. Data Mockup
const GALLERY_ITEMS: GalleryItemData[] = [
  { id: 1, height: "h-64", color: "bg-neutral-200", title: "Mousse" },
  { id: 2, height: "h-96", color: "bg-stone-300", title: "Citrus Tart" },
  { id: 3, height: "h-72", color: "bg-zinc-200", title: "Brie Pizza" },
  { id: 4, height: "h-[28rem]", color: "bg-gray-300", title: "Artisan Bread" },
  { id: 5, height: "h-64", color: "bg-neutral-300", title: "Sourdough" },
  { id: 6, height: "h-80", color: "bg-stone-200", title: "Plating" },
  { id: 7, height: "h-96", color: "bg-zinc-300", title: "Kitchen" },
  { id: 8, height: "h-60", color: "bg-gray-200", title: "Ingredients" },
  { id: 9, height: "h-80", color: "bg-neutral-200", title: "Chef's Table" },
  { id: 10, height: "h-[30rem]", color: "bg-stone-300", title: "Texture" },
  { id: 11, height: "h-72", color: "bg-zinc-200", title: "Details" },
  { id: 12, height: "h-64", color: "bg-gray-300", title: "Service" },
];

/**
 * 3. Masonry Item Component
 * - Removed captions.
 * - Removed hover shade.
 * - Added onClick handler.
 */
function MasonryItem({ height, color, delayClass, onClick }: MasonryItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        break-inside-avoid mb-6 relative 
        transition-all duration-700 ease-out cursor-zoom-in
        ${delayClass}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
    >
      <div
        className={`w-full ${height} ${color} shadow-sm overflow-hidden hover:opacity-90 transition-opacity duration-300`}
      >
        {/* This is where the <img /> would go. 
           For now, it's just the colored div wrapper.
        */}
      </div>
    </div>
  );
}

export function Galeria() {
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(
    null
  );

  return (
    <main className="bg-white min-h-screen">
      <section className="mx-auto px-6 py-16 max-w-7xl">
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-4 font-['Work_Sans'] tracking-tight text-gray-900">
            Galeria
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Uma seleção de momentos, texturas e criações culinárias.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
          {GALLERY_ITEMS.map((item, index) => {
            const delayClasses = [
              "delay-75",
              "delay-100",
              "delay-150",
              "delay-200",
            ];
            const delayClass = delayClasses[index % delayClasses.length];

            return (
              <MasonryItem
                key={item.id}
                {...item}
                delayClass={delayClass}
                onClick={() => setSelectedItem(item)}
              />
            );
          })}
        </div>
      </section>

      {/* LIGHTBOX MODAL 
        Displays when an item is selected.
      */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setSelectedItem(null)} // Click background to close
        >
          {/* Close Button (Optional visual cue) */}
          <button className="absolute top-6 right-6 text-white text-4xl font-light hover:text-gray-300">
            &times;
          </button>

          {/* Zoomed Image Container */}
          <div
            className={`w-full max-w-4xl max-h-[90vh] aspect-[3/4] md:aspect-auto ${selectedItem.color} shadow-2xl rounded-sm`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          >
            {/* In the real version, use: 
                <img src={selectedItem.src} className="w-full h-full object-contain" />
             */}
          </div>
        </div>
      )}
    </main>
  );
}