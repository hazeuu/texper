import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./internal/jsx/AuthContext";
import "../format_login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Sai tài khoản hoặc mật khẩu");
        return;
      }

      // Lưu token
      localStorage.setItem("token", data.token);

      // Chuyển trang
      window.location.href = "/dashboard";
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
