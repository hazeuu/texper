import React from "react";
import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import "../footer_border.css"
export default function Header(){
  const [open, setOpen] = useState(false);
    return (
    <div className="header_sign">
      <div className="header_sign_branding">
        <Link to="/">HỆ THỐNG QUẢN LÝ BỆNH ÁN ĐIỆN TỬ <br></br>
    BỆNH VIỆN PHỤ SẢN TRUNG ƯƠNG</Link></div>    
    </div>
    )
}