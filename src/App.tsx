import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { SobreNos } from "./pages/AboutUs";
import { Menus } from "./pages/Menus";
import { Galeria } from "./pages/Galery";
import { Contato } from "./pages/Contact";
import { Newsletter } from "./pages/Newsletter";
import { Products } from "./pages/Products";
import { AdminOrders } from "./pages/AdminOrders";
import { OrderStatus } from "./pages/OrderStatus";

const router = createBrowserRouter([
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
      },
      {
        path: "/newsletter",
        element: <Newsletter />,
      },
      {
        path: "/newsletter/:slug",
        element: <Newsletter />,
      },
      {
        path: "/produtos",
        element: <Products />,
      },
      {
        path: "/admin-orders",
        element: <AdminOrders />,
      },
      {
        path: "/pedido/:id",
        element: <OrderStatus />,
      },
    ],
  }
]);


export { router };