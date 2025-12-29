import React from "react";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./internal/jsx/AuthContext";
import "../format_signup.css"

function Signup() {
  
  const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const { login } = useContext(AuthContext);
  
    async function handleRegister(e) {
      e.preventDefault();
  
      try {
        const response = await fetch("https://texper.onrender.com/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, name, dob, email, phone }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          alert(data.error || "Sai tài khoản hoặc mật khẩu");
          return;
        }
  
        // Chuyển trang
        window.location.href = "/login";
        alert("Đăng ký thành công, vui lòng đăng nhập bằng tài khoản vừa tạo");
      } catch (err) {
        alert("Không kết nối được đến server!");
        console.error(err);
      }
    }

  return (
    <>
    <div className="fill-border_signup">
      <h1>ĐĂNG KÝ</h1>

      <form onSubmit={handleRegister} className="signup-form">
        Họ và tên:
        <input
          type="text"
          value={name}
          onChange={(e) =>setName(e.target.value)}
          placeholder="Nhập họ tên"
          required
          title="Vui lòng nhập họ tên"
        />
        Ngày sinh
        <input type="date" value={dob} onChange={(e) =>setDob(e.target.value)} required />
       Email
        <input type="email" value={email} onChange={(e) =>setEmail(e.target.value)} placeholder="Nhập email" required />
    
        Số điện thoại
        <input
          type="text"
          value={phone}
          onChange={(e) =>setPhone(e.target.value)}
          inputMode="tel"
          maxLength="11"
          placeholder="Nhập số điện thoại"
          required
        />

        Tên đăng nhập
        <input
          type="text"
          value={username}
          onChange={(e) =>setUsername(e.target.value)}
          placeholder="Tên đăng nhập"
          required
          title="Vui lòng chọn tên đăng nhập"
        />

        Mật khẩu
        <input
          type="password"
          value={password}
          onChange={(e) =>setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
          required
        />
        <div className="checklist_box">
          <input type="checkbox" required /> Tôi xác nhận các thông tin trên hoàn toàn chính xác
          <input type="checkbox" required /> Tôi đồng ý với điều khoản sử dụng
        </div>
               <button type="submit">Đăng ký</button>
      </form>
    </div>
    </>
  );
}

export default Signup;
