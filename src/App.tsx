import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { SobreNos } from "./pages/AboutUs";
import { Menus } from "./pages/Menus";
import { Galeria } from "./pages/Galery";
import { Contato } from "./pages/Contact";


const router  = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/sobre-nos",
        element: <SobreNos />,
      },
      {
        path: "/menus",
        element: <Menus />,
      },
      {
        path: "/galeria",
        element: <Galeria />,
      },
      {
        path: "/contato",
        element: <Contato />,
      }
    ],
  }
]);


export { router };