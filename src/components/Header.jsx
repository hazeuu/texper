import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../footer_border.css";
import { useAuth } from "../pages/internal/jsx/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // lấy trạng thái login từ context

  return (
    <div className="header_sign">
      <div className="header_sign_branding">
        <Link to="/">
          HỆ THỐNG QUẢN LÝ BỆNH ÁN ĐIỆN TỬ <br />
          BỆNH VIỆN PHỤ SẢN TRUNG ƯƠNG
        </Link>
      </div>
    </div>
  );
}
