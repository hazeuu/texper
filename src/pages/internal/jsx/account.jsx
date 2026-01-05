import React, { useState, useEffect } from "react";
import { useAuth } from "../jsx/AuthContext";
import "../cssfile/account.css";

function Account_management() {
  const { user, loading } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  // Khi auth chưa load xong
  if (loading) return <div>Loading auth...</div>;
  if (!user) return <div>Chưa đăng nhập</div>;

  const roleGroup =
  ["nurse", "receptionist"].includes(user.role)
    ? "staff"
    : user.role;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        
        let userId;
        if (roleGroup === "doctor") userId = user.doctor_id;
        else if (roleGroup === "staff") userId = user.staff_id;
        else if (roleGroup === "patient") userId = user.patient_id;
        else return;

        const res = await fetch(`https://texper.onrender.com/api/account/${roleGroup}/${userId}`);
        if (!res.ok) throw new Error("Lỗi kết nối server");
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Lỗi fetch user info:", err);
      }
    };

    fetchUserInfo();
  }, [user]);

  if (!userInfo) return <div>Loading user data...</div>;

  return (
    <div className="fill-border_group">
      <h1>Tài khoản</h1>
      <div className="account_form">

        <div className="input-box">
          <label>Họ và tên</label>
          <input type="text" value={userInfo.full_name} readOnly />
        </div>

        <div className="input-box">
          <label>Ngày sinh (MM/DD/YYYY)</label>
          <input type="text" value={new Date(userInfo.date_of_birth).toLocaleDateString()} readOnly />
        </div>

        <div className="input-box">
          <label>Email</label>
          <input type="text" value={userInfo.email} readOnly />
        </div>

        <div className="input-box">
          <label>Số điện thoại</label>
          <input type="text" value={userInfo.phone} readOnly />
        </div>
      </div>

      <button>Đổi mật khẩu</button>
    </div>
  );
}

export default Account_management;
