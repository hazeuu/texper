import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "SUPER_SECRET_KEY"; // đổi thành key thật

// Kết nối MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@ima.bietduoC418375",
    database: "project_demo"
});

// ---------------------- REGISTER ----------------------
app.post("/register", async (req, res) => {
  const { username, password, name, dob, email, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Bắt đầu transaction
    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ error: err.message });

      // 1. Tạo patient
      db.query(
        "INSERT INTO patients (full_name, date_of_birth, email, phone) VALUES (?, ?, ?, ?)",
        [name, dob, email, phone],
        (err, patientResult) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

          const patientId = patientResult.insertId;

          // 2. Tạo account và liên kết patient_id
          db.query(
            "INSERT INTO accountlists (username, password_hash, patient_id) VALUES (?, ?, ?)",
            [username, hashedPassword, patientId],
            (err, accountResult) => {
              if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

              // 3. Commit transaction
              db.commit((err) => {
                if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

                res.json({ message: "Registered successfully" });
              });
            }
          );
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------------- LOGIN ----------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM accountlists WHERE username = ?",
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (rows.length === 0)
        return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });

      const user = rows[0];

      if (!user.password_hash)
        return res.status(500).json({ error: "Password hash không tồn tại" });

      bcrypt.compare(password, user.password_hash)
        .then(match => {
          if (!match)
            return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });

          const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1d" }
          );

          res.json({
            message: "Login thành công",
            token,
            user: { id: user.id, username: user.username }
          });
        })
        .catch(err => res.status(500).json({ error: err.message }));
    }
  );
});
// ---------------------- data_name_patients ----------------------
app.get("/patients", (req, res) => {
    const sql = "SELECT * FROM patients";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        res.json(results);
    });
});

// ---------------------- forgot_password ----------------------
// Cấu hình nodemailer (ví dụ Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_email_password",
  },
});

// Endpoint: nhận email và gửi link reset
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email=?", [email]);
    if (users.length === 0) return res.status(404).json({ message: "Email không tồn tại" });

    // Tạo reset token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const expireTime = new Date(Date.now() + 3600000); // 1 giờ

    // Lưu token hash và thời gian expire vào DB
    await db.execute(
      "UPDATE users SET reset_token=?, reset_token_expire=? WHERE email=?",
      [resetTokenHash, expireTime, email]
    );

    // Tạo link reset (frontend route sẽ nhận email + token)
    const resetLink = `https://your-frontend.com/reset-password?token=${resetToken}&email=${email}`;

    // Gửi email
    await transporter.sendMail({
      from: "your_email@gmail.com",
      to: email,
      subject: "Reset mật khẩu",
      html: `<p>Click vào link để đặt lại mật khẩu (hết hạn sau 1 giờ): <a href="${resetLink}">Đặt lại mật khẩu</a></p>`,
    });

    res.json({ message: "Gửi email thành công. Vui lòng kiểm tra hộp thư của bạn." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// ---------------------- START SERVER ----------------------
app.listen(3000, () =>  {console.log("API chạy ở http://localhost:3000");});
