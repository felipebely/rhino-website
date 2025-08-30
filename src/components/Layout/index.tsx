import { Navbar, Footer } from "../index";
import { Outlet } from "react-router-dom";
  
export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar smallLogoOpacity={1} brandShift={1} centerBrandOpacity={0} />
      <div style={{ height: 112 }} />
      <Outlet />
      <Footer />
    </div>
  );
}