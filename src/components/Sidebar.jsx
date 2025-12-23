import React, { useState } from "react";
import "../sidebar.css";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Toggle button nằm ngoài sidebar, luôn lộ ra */}
      <div className="menu-toggle" onMouseEnter={() => setExpanded(true)}>
        <Menu size={22} />
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar ${expanded ? "expanded" : ""}`}
        onMouseLeave={() => setExpanded(false)} // Khi rời sidebar → thu lại
      >
        <ul>
          <Link to="/"> <li>Trang chủ</li> </Link>
          <Link to="/Dashboard"><li>Dashboard</li></Link>
          <Link to="/Calendar"><li>Đặt lịch hẹn</li></Link>
          <Link to="/about"><li>Giới thiệu</li></Link>
          <Link to="/QandA"><li>Giải đáp y học</li></Link>
          <div className="account_setting"><Link to="/Account"><li>Tài khoản</li></Link></div>
        </ul>
      </div>
    </>
  );
}
