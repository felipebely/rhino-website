// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css"; // Tailwind

import App from "./App";
import Navbar from "./components/Navbar";

import SobreNos from "./pages/SobreNos";
import Menus from "./pages/Menus";
import Galeria from "./pages/Galeria";
import Contato from "./pages/Contato";

type PageWithNavbarProps = React.PropsWithChildren<{}>;

function PageWithNavbar({ children }: PageWithNavbarProps) {
  return (
    <>
      <Navbar smallLogoOpacity={1} brandShift={1} centerBrandOpacity={0} />
      <div style={{ height: 112 }} />
      {children}
    </>
  );
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container #root not found");
}
createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/sobre-nos"
          element={
            <PageWithNavbar>
              <SobreNos />
            </PageWithNavbar>
          }
        />
        <Route
          path="/menus"
          element={
            <PageWithNavbar>
              <Menus />
            </PageWithNavbar>
          }
        />
        <Route
          path="/galeria"
          element={
            <PageWithNavbar>
              <Galeria />
            </PageWithNavbar>
          }
        />
        <Route
          path="/contato"
          element={
            <PageWithNavbar>
              <Contato />
            </PageWithNavbar>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
