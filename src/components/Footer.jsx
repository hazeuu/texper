import React from "react";
import "../footer_border.css"
import { Link } from "react-router-dom";
export default function Footer(){
    return (
    <div  className="border_footer">
        <Link to="/About" className="footer_content">About</Link>
        <div className="info">
            BỆNH VIỆN PHỤ SẢN TRUNG ƯƠNG <br></br>
            Địa chỉ: Số 1 Triệu Quốc Đạt, Cửa Nam, Hà Nội <br></br>
            Hotline: 1900 1029 <br></br>
        </div>
        <h4>Một sản phẩm của Texper</h4>
    
    </div>
    )
}