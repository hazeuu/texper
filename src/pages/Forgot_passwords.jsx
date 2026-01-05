import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../format_login.css";
function getback_passwords () {
    const [email, setEmail] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState("");
   async function handleverify(e) {
    e.preventDefault();

    // Gửi request đến backend
    const response = await fetch("https://texper.onrender.com/forgot-password", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({email})
    });

     if (!submitted) {
    setSubmitted(true);
    return;
    }
    if (!confirm) {
      setError("Vui lòng xác nhận bạn không phải robot!");
      setSuccess ("");
      return;
    }
      const data = await response.json();

  if (!response.ok) {
    setError(data.message || "Không thể gửi yêu cầu. Vui lòng thử lại.");
    setSuccess("");
    return;
  }
    setError("");
    setSuccess ("Yêu cầu khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra Email");
    setSubmitted(false);
    setConfirm(false);
    setEmail("");
  }

return (
    
<div className="fill-border_forgot">
        <h1>QUÊN MẬT KHẨU</h1>
        Nhập email dùng để đăng ký tài khoản:
        <form onSubmit={handleverify}>
            <input
          type="email"
          placeholder="Email đăng ký"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
         {submitted && (<div className="checkbox_layout">
          <input
            type="checkbox" required
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)} 
          />Tôi không phải robot</div>)}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "#ffffffff" }}>{success}</p>}
        <button type="submit">Lấy lại mật khẩu</button>
        </form>
    </div>
)
function fakeverifyAPI(username, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === "admin" && password === "123") {
        resolve({ success: true, token: "fake-jwt-token" });
      } else {
        resolve({ success: false });
      }
    }, 1000);
  });
}
}
export default getback_passwords;