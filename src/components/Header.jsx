import React from "react";
import { Link, useNavigate} from "react-router-dom";
import "../footer_border.css"
export default function Header(){
  const navigate=useNavigate();
    return (
    <div className="header_sign">
      <div className="header_sign_branding">
        <Link to="/">HỆ THỐNG QUẢN LÝ BỆNH ÁN ĐIỆN TỬ <br></br>
    BỆNH VIỆN PHỤ SẢN TRUNG ƯƠNG</Link></div>
      <button onClick={() => navigate("/Login")} className="button_position">Đăng nhập</button>
    </div>
    )
}