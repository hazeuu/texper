import React from "react";
import Footer from "../components/Footer";
import "../layout.css"; // style riêng
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <Header />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
}
