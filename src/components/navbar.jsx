// Navbar.jsx
import { Link } from "react-router-dom";
import "../navbar.css";

export default function Navbar() {
  return (
    <>
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/tin-tuc">Tin tức - Sự kiện</Link></li>
          <li><Link to="/nghien-cuu">Nghiên cứu khoa học</Link></li>
          <li><Link to="/QandA">Giải đáp y học</Link></li>
          <li><Link to="/quy-trinh">Quy trình khám bệnh</Link></li>
          <li><Link to="/van-ban">Văn bản</Link></li>
          <li><Link to="/About">Giới thiệu</Link></li>
        </ul>
      </nav>
      </>
  );
}
