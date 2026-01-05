import { Link } from "react-router-dom";
import {React, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import "../../../format_signup.css"

function Admin_register() {
  
  const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [sex, setSex] = useState("");
    const [license_number, setLicensenumber] = useState(""); 
    const [specialization, setSpecialization] = useState(""); 
 
    const roleMap = {
  "Quản trị viên": "admin",
  "Lễ tân": "receptionist",
  "Bác sĩ": "doctor",
  "Y tá": "nurse"
};
     const [choice, setChoice] = useState("");

    const [formData, setFormData] = useState({
    extra1: "",
    extra2: "",
  });
  
    async function handleRegister(e) {
      e.preventDefault();
  
      const payload = {
      mainChoice: choice,
      licenseNumber: formData.extra1,
      specialization: formData.extra2,
    };

      try {
        const roleForDB = roleMap[choice]; 
        const response = await fetch("https://texper.onrender.com/staff/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, name, dob, email, phone, sex, license_number: formData.extra1,
          specialization: formData.extra2, role: roleForDB}),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          alert(data.error || "Sai tài khoản hoặc mật khẩu");
          return;
        }
  
        alert("Đăng ký thành công");
      } catch (err) {
        alert("Không kết nối được đến server!");
        console.error(err);
      }
    }
  const showExtraInputs = choice !== "" && choice !== "Quản trị viên" && choice !== "Lễ tân"; // ví dụ option1 là lựa chọn đặc biệt
  
useEffect(() => {
    if (choice === "Quản trị viên" || choice === "Lễ tân") {
      setFormData({ extra1: "", extra2: "" }); // reset nếu không cần
    }
  }, [choice]);

  return (
    <>
    <div className="fill-border_signup">
      <h1>THÊM TÀI KHOẢN</h1>

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
        Ngày sinh:
        <input type="date" value={dob} onChange={(e) =>setDob(e.target.value)} required />
        Giới tính:
        <select value={sex} onChange={(e)=> setSex(e.target.value)} required>
            <option value="">--Chọn--</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
        </select>
       Email:
        <input type="email" value={email} onChange={(e) =>setEmail(e.target.value)} placeholder="Nhập email" required />
    
        Số điện thoại:
        <input
          type="text"
          value={phone}
          onChange={(e) =>setPhone(e.target.value)}
          inputMode="tel"
          maxLength="11"
          placeholder="Nhập số điện thoại"
          required
        />
        Đối tượng sử dụng:
        <select
        id="mainChoice"
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
      >
        <option value="">-- Chọn --</option>
        <option value="Quản trị viên">Quản trị viên</option>
        <option value="Lễ tân">Lễ tân</option>
        <option value="Bác sĩ">Bác sĩ</option>
        <option value="Y tá">Y tá</option>
      </select>
      
      {showExtraInputs && (  // Chỉ hiện trường giấy phép và chuyên môn khi là bác sĩ hoặc y tá
        <div>
            Giấy phép làm việc số:
          <input
            type="text"
            id="extra1"
            value={formData.extra1}
            onChange={(e) =>
              setFormData({ ...formData, extra1: e.target.value })
            }
            required
            title="Số giấy phép làm việc"
            placeholder="Số giấy phép làm việc"
          />
          Chuyên môn:
          <input
            type="text"
            id="extra2"
            value={formData.extra2}
            onChange={(e) =>
              setFormData({ ...formData, extra2: e.target.value })
            }
            required
            title="Chuyên môn"
            placeholder="Chuyên môn"
          />
          </div>
      )}

        Tên đăng nhập:
        <input
          type="text"
          value={username}
          onChange={(e) =>setUsername(e.target.value)}
          placeholder="Tên đăng nhập"
          required
          title="Vui lòng chọn tên đăng nhập"
        />

        Mật khẩu:
        <input
          type="password"
          value={password}
          onChange={(e) =>setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
          required
        />
               <button type="submit">Đăng ký</button>
      </form>
    </div>
    </>
  );
}

export default Admin_register;
