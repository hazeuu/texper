import React from "react";
import Footer from "../components/Footer";
import Header_home from "../components/Header_home";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import "../layout.css"; // style riêng
import { useLocation } from "react-router-dom";
import { useAuth } from "../pages/internal/jsx/AuthContext";

export default function Layout({ children }) {
  const { isLoggedIn } = useAuth();     
  const location =useLocation();
  const isHome = ["/", "/About","/QandA"].includes(location.pathname);
  return (
    <div className="layout-container">
      {isLoggedIn  &&  <Sidebar />}
      <Header_home />
      {isHome && <Navbar />}
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
}
