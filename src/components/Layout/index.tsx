import { Outlet } from "react-router-dom";

import { ScrollToTop } from "../../hooks";
import { Navbar, Footer } from "../index";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Navbar smallLogoOpacity={1} brandShift={1} centerBrandOpacity={0} />
      <main className="flex-grow mt-[112px] overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
