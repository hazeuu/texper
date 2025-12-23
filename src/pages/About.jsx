import React from "react"
import "../about.css"
import { useState } from "react";
export default function About(){
      const [active, setActive] = useState("tab1");
  const [exiting, setExiting] = useState(null);

  const handleChange = (next) => {
    if (next === active) return;

    // Start exit
    setExiting(active);

    // Wait for exit animation (250ms)
    setTimeout(() => {
      setExiting(null);
      setActive(next);
    }, 250);
}
    return(
    <div className="about">
        <h1> Giới thiệu</h1>
<div class="container">
  <div class="item"><h2>Bệnh viện Phụ sản Trung ương là bệnh viện chuyên khoa hạng I về chuyên ngành Sản Phụ khoa.</h2></div>
  <div class="item">
        <button onClick={()=> handleChange("tab1")}><h3>Lịch sử</h3></button><br></br>
        <button onClick={()=> handleChange("tab2")}><h3>Chức năng</h3></button><br></br>
        <button onClick={()=> handleChange("tab3")}><h3>Nhiệm vụ</h3></button><br></br>
  </div>
  <div class="item">
    
      <div className={"chucnang " + (active==="tab2"?" enter" : "")+(exiting==="tab2" ? " exit" : "" )}>
             <div className="contenting">Khám bệnh, cấp cứu, chữa bệnh về chuyên ngành phụ khoa, sản khoa</div>
             <div className="contenting">Đào tạo, tham gia đào tạo, chỉ đạo tuyến và hợp tác quốc tế về chuyên ngành phụ khoa, sản khoa</div>
             <div className="contenting">Nghiên cứu khoa học, triển khai ứng dụng khoa học, công nghệ, kỹ thuật hiện đại để khám, chữa bệnh và chăm sóc sức khỏe nhân dân</div>
        </div>
            <div className={
            "nhiemvu " +
            (active === "tab3" ? " enter" : "") +
            (exiting === "tab3" ? " exit" : "")
          }>   
          <div className="contenting">Cấp cứu, khám, chữa bệnh về chuyên ngành phụ khoa, sản khoa</div>
          <div className="contenting">Đào tạo, nghiên cứu khoa học và phát triển công nghệ</div>
          <div className="contenting">Chỉ đạo tuyến, quản lý đơn vị và hợp tác quốc tế</div>
             </div>
  </div>
  <div class="item">Địa chỉ: Số 1 Triệu Quốc Đạt, Cửa Nam, Hà Nội</div>
</div>


<div className="notifying">
        <h2> Đây là sản phẩm phục vụ môn học<br></br>
        Kỹ thuật phần mềm ứng dụng - ET3260<br></br>
        Đại học Bách khoa Hà Nội <br></br>
        Giảng viên hướng dẫn: Th.S Hoàng Quang Huy</h2>
        <h3>Nhóm 03:</h3>
        <p>03. Nguyễn Thế Anh - 20223752<br></br>
        13. Đặng Duy Đạt - 2023<br></br>
        45. Trần Đức Mạnh - 2022</p>
    </div>
</div>
    )
}