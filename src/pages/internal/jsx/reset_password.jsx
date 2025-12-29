import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import "../../../format_login.css";

function Reset_password() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email");

  const navigate = useNavigate();

  useEffect(() => {
  async function validate() {
    if (!token || !email) {
      setError("Liên kết không hợp lệ");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/reset-password/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Liên kết không còn hiệu lực");
        setTimeout(() => navigate("/login"), 4000);
      }
    } catch {
      setError("Không thể kết nối đến server");
      setTimeout(() => navigate("/login"), 4000);
    }
  }

  validate();
}, [token, email, navigate]);

  const [newpassword, setNewpassword] = useState("");
  const [newpasswordconfirm, setNewpasswordconfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //  Nếu thiếu token/email -> chuyển về trang login
  useEffect(() => {
    if (!token || !email) {
      setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
      setTimeout(() => navigate("/login"), 4000);
    }
  }, [token, email, navigate]);

  async function handleverify(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newpassword !== newpasswordconfirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          newPassword: newpassword,
          newPasswordConfirm: newpasswordconfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Không thể đặt lại mật khẩu");
        return;
      }

      setSuccess("Thay đổi mật khẩu thành công. Hệ thống sẽ chuyển trang sau giây lát.");
      setNewpassword("");
      setNewpasswordconfirm("");

      // ⏳ Redirect sau 5s
      setTimeout(() => navigate("/login"), 5000);

    } catch (err) {
      setError("Không thể kết nối đến server");
    }
  }

  return (
    <>
      <h1>Khôi phục mật khẩu</h1>

      <div className="wrapping_reset_password_content">
        <div className="reset_password_layout">

          {/* ⚠️ KHU VỰC THÔNG BÁO */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <form onSubmit={handleverify}>
            Vui lòng nhập mật khẩu mới:
            <input
              type="password"
              value={newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
              maxLength="256"
              placeholder="Nhập mật khẩu mới"
              required
            />

            Xác nhận mật khẩu mới:
            <input
              type="password"
              value={newpasswordconfirm}
              onChange={(e) => setNewpasswordconfirm(e.target.value)}
              maxLength="256"
              placeholder="Nhập mật khẩu mới"
              required
            />

            <button type="submit">Thay đổi mật khẩu</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Reset_password;
