import React from "react";
import Footer from "../components/Footer";
import Header_home from "../components/Header_home";
import Sidebar from "./sidebar";
import "../layout.css"; // style riêng

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <Sidebar />
      <Header_home />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
}
