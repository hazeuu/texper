import React, { useState } from "react";
import "../sidebar.css";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../pages/internal/jsx/AuthContext";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const { user, logout } = useAuth(); // user có { id, username, role }
  const navigate = useNavigate();

  // Cấu hình menu theo role
  const menuConfig = {
    admin: [
      { path: "/", label: "Trang chủ" },
      { path: "/Dashboard", label: "Dashboard" },
      { path: "/admin_register", label: "Đăng ký tài khoản nội bộ" },
      { path: "/Account", label: "Quản lý tài khoản nội bộ", isAccount: true },
      { path: "/QandA", label: "Giải đáp y học" },
      { path: "/about", label: "Giới thiệu" },
    ],
    doctor: [
      { path: "/", label: "Trang chủ" },
      { path: "/Dashboard", label: "Dashboard" },
      { path: "/Reminder", label: "Đặt lịch hẹn" },
      { path: "/QandA", label: "Giải đáp y học" },
      { path: "/Account", label: "Tài khoản", isAccount: true },
      { path: "/about", label: "Giới thiệu" },
    ],
    nurse: [
      { path: "/", label: "Trang chủ" },
      { path: "/Dashboard", label: "Dashboard" },
      { path: "/Reminder", label: "Đặt lịch hẹn" },
      { path: "/QandA", label: "Giải đáp y học" },
      { path: "/Account", label: "Tài khoản", isAccount: true },
      { path: "/about", label: "Giới thiệu" },
    ],
    receptionist: [
      { path: "/", label: "Trang chủ" },
      { path: "/Dashboard", label: "Dashboard" },
      { path: "/Reminder", label: "Đặt lịch hẹn" },
      { path: "/QandA", label: "Giải đáp y học" },
      { path: "/Account", label: "Tài khoản", isAccount: true },
      { path: "/about", label: "Giới thiệu" },
    ],
    patient: [
      { path: "/", label: "Trang chủ" },
      { path: "/Dashboard", label: "Dashboard" },
      { path: "/Reminder", label: "Đặt lịch hẹn" },
      { path: "/QandA", label: "Giải đáp y học" },
      { path: "/Account", label: "Tài khoản", isAccount: true },
      { path: "/about", label: "Giới thiệu" },
    ],
    guest: [
      { path: "/", label: "Trang chủ" },
      { path: "/about", label: "Giới thiệu" },
      { path: "/QandA", label: "Giải đáp y học" },
    ],
  };

  const menuItems = menuConfig[user?.role] || menuConfig["guest"];

  return (
    <>
      {/* Toggle button */}
      <div className="menu-toggle" onMouseEnter={() => setExpanded(true)}>
        <Menu size={22} />
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar ${expanded ? "expanded" : ""}`}
        onMouseLeave={() => setExpanded(false)}
      >
        <ul>
          {menuItems.map((item, idx) =>
            item.isAccount ? (
              <div key={idx} className="account_setting">
                <Link to={item.path}>
                  <li>{item.label}</li>
                </Link>
              </div>
            ) : (
              <Link key={idx} to={item.path}>
                <li>{item.label}</li>
              </Link>
            )
          )}

            {user && (
    <li
      className="logout_button"
      onClick={() => {
        logout();          // từ useAuth()
        navigate("/Login"); // điều hướng về login
      }}
    >
      <b>Đăng xuất</b>
    </li>
  )}
        </ul>
      </div>
    </>
  );
}
