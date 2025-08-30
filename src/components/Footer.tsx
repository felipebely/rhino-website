// components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div
        className="mx-auto px-6 flex items-center justify-center"
        style={{ height: "224px" }} // 2 × navbar height (h-28 = 112px)
      >
        <img
          src="/logos/logo_black_2.jpg"
          alt="Rhino Footer Logo"
          className="max-h-[220px] w-auto object-contain"
        />
      </div>
    </footer>
  );
}
