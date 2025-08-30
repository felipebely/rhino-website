// components/Footer.tsx
import React from "react";

type FooterProps = {
  /** Extra white space above the footer (in pixels). Default: 110 */
  topGap?: number;
};

export default function Footer({ topGap = 220 }: FooterProps) {
  return (
    <>
      {/* White space above the footer */}
      <div style={{ height: topGap }} aria-hidden />

      <footer className="w-full bg-black text-white">
        <div
          className="mx-auto px-6 flex items-center justify-center"
          style={{ height: "224px" }} // Footer body height (2 × navbar)
        >
          <img
            src="/logos/logo_black_2.jpg"
            alt="Rhino Footer Logo"
            className="max-h-[220px] w-auto object-contain"
          />
        </div>
      </footer>
    </>
  );
}

