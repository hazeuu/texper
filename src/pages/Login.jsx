import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./internal/jsx/AuthContext";
import "../format_login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, login } = useContext(AuthContext);

  const navigate = useNavigate();

  // Nếu đã login rồi thì không cho vào trang Login
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/Dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);
  
  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("https://texper.onrender.com/login"|| "http://localhost:5173/texper/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Sai tài khoản hoặc mật khẩu");
        return;
      }

 // Tạo object user chuẩn với id riêng theo role
    const userWithId = { ...data.user };
    if (userWithId.role === "doctor") userWithId.doctor_id = data.user.id;
    else if (userWithId.role === "staff") userWithId.staff_id = data.user.id;
    else if (userWithId.role === "patient") userWithId.patient_id = data.user.id;

    login(data.token, userWithId); // set context

      // Lưu token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userWithId));

      // Chuyển trang
       navigate("/dashboard", { replace: true });
    } catch (err) {
      alert("Không kết nối được đến server!");
      console.error(err);
    }
  }

  return (
    <>
      <div className="fill-border_all">
        <h1>
          HỆ THỐNG QUẢN LÝ BỆNH ÁN ĐIỆN TỬ<br></br>BỆNH VIỆN PHỤ SẢN TRUNG ƯƠNG
        </h1>
        <div className="fill-border_content">
          <h2>ĐĂNG NHẬP</h2>
          <form onSubmit={handleLogin} className="form-box">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Đăng nhập</button>
          </form>

          <Link to="/Forgot_passwords">Quên mật khẩu?</Link>
          <div className="signintype">
            Chưa có tài khoản?<Link to="/Signup">Đăng ký</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
