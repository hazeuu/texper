import { Link } from "react-router-dom";
import React from "react";
import { useState } from "react";
import "../cssfile/account.css"
function Account_management()
{
    return(
        <div className="fill-border_group">
        <h1>Tài khoản</h1>
    <div className="account_form">
    <button>Chỉnh sửa</button>
    <div className="input-box">
  <label>Họ và tên</label>
  <input type="text" readOnly/>
</div>
 <div className="input-box">
  <label>Ngày sinh</label>
  <input type="text" readOnly/>
</div>
 <div className="input-box">
  <label>Email</label>
  <input type="text" readOnly/>
</div>
 <div className="input-box">
  <label>Số điện thoại</label>
  <input type="text" readOnly/>
</div>
 <div className="input-box">
  <label>Nhập mật khẩu hiện tại</label>
  <input type="text" readOnly/>
</div>
 <div className="input-box">
  <label>Nhập mật khẩu mới</label>
  <input type="text" readOnly/>
</div>
 <div className="input-box">
  <label>Xác nhận mật khẩu mới</label>
  <input type="text" readOnly/>
</div>
</div>
        <button>Đăng xuất</button>
        </div>
    )
}
export default Account_management;