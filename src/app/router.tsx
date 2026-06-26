import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { HomePage } from "../pages/HomePage";
import { ShopPage } from "../pages/ShopPage";
import { SplashPage } from "../pages/SplashPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/home",
        element: <HomePage />
      },
      {
        path: "/shop",
        element: <ShopPage />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
