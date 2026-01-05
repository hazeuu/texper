import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// CORS 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(204); // trả OK cho preflight
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;

// MySQL Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT || 3306, // 3306 mặc định
  ssl: {
    ca: process.env.DB_SSL_CA       // Nội dung server-ca.pem
  }
});

// Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((err, success) => {
  if (err) console.log("Nodemailer lỗi:", err);
  else console.log("Nodemailer sẵn sàng gửi email");
});

//-------------VERIFY TOKEN-------------------------
function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu user vào req để route phía sau dùng
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ---------------------- REGISTER ----------------------
app.post("/register", async (req, res) => {
  const { username, password, name, dob, email, phone } = req.body;
  let connection;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [patientResult] = await connection.query(
      "INSERT INTO patients (full_name, date_of_birth, email, phone) VALUES (?, ?, ?, ?)",
      [name, dob, email, phone]
    );
    const patientId = patientResult.insertId;

    await connection.query(
      "INSERT INTO accountlists (username, password_hash, patient_id) VALUES (?, ?, ?)",
      [username, hashedPassword, patientId]
    );

    await connection.commit();
    res.json({ message: "Registered successfully" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ---------------------- LOGIN ----------------------
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.execute(
      "SELECT * FROM accountlists WHERE username = ?",
      [username]
    );

    if (rows.length === 0) return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });

    let userId;
    if (user.role === "doctor") userId = user.doctor_id;
    else if (user.role === "staff") userId = user.staff_id;
    else if (user.role === "patient") userId = user.patient_id;

    const token = jwt.sign(
      {
        id: userId,
        username: user.username,
        role: user.role,
        patient_id: user.patient_id ?? null,
        doctor_id: user.doctor_id ?? null,
        staff_id: user.staff_id ?? null,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login thành công",
      token,
      user: {
        id: userId,
        username: user.username,
        role: user.role,
        doctor_id: user.doctor_id,
        staff_id: user.staff_id,
        patient_id: user.patient_id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ---------------------- GET PATIENT BY NAME ----------------------
app.get("/patients", async (req, res) => {
  const { name } = req.query;
  try {
    const [rows] = await pool.execute(
      "SELECT patient_id FROM patients WHERE full_name = ?",
      [name]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ---------------------- FORGOT PASSWORD ----------------------
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await pool.execute(
      "SELECT patient_id FROM patients WHERE email = ?",
      [email]
    );
    if (users.length === 0) return res.status(404).json({ message: "Email không tồn tại" });

    const patientId = users[0].patient_id;
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const expireTime = new Date(Date.now() + 3600000);

    await pool.execute(
      `INSERT INTO password_resets (patient_id, reset_token, expire_time)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE reset_token = VALUES(reset_token), expire_time = VALUES(expire_time), used = FALSE`,
      [patientId, resetTokenHash, expireTime]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset_password?token=${encodeURIComponent(resetToken)}&email=${email}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu Hệ thống QLBAĐT Bệnh viện Phụ sản Trung ương",
      html: `<p>Xin chào, <br></br>

Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn trên hệ thống của chúng tôi. <br></br>

Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email — tài khoản của bạn sẽ không bị thay đổi. <br></br>

Để tạo mật khẩu mới, vui lòng nhấp vào liên kết bên dưới và làm theo hướng dẫn: <br></br>

<a href="${resetLink}">Đặt lại mật khẩu</a> <br></br> 

Lưu ý: liên kết này chỉ có hiệu lực trong một khoảng thời gian giới hạn vì lý do bảo mật. <br></br>

Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Rất mong bạn có trải nghiệm tốt. <br></br> <br></br>

Trân trọng,<br></br>
Đội ngũ Hỗ trợ <br></br>
</p>`,
    });

    res.json({ message: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ---------------------- RESET PASSWORD ----------------------
app.post("/reset-password", async (req, res) => {
  const { token, email, newPassword, newPasswordConfirm } = req.body;
  if (!token || !email || !newPassword || !newPasswordConfirm) return res.status(400).json({ message: "Thiếu dữ liệu." });
  if (newPassword !== newPasswordConfirm) return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });

  try {
    const [users] = await pool.execute("SELECT patient_id FROM patients WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).json({ message: "Email không tồn tại." });

    const patientId = users[0].patient_id;
    const [rows] = await pool.execute(
      "SELECT reset_token, expire_time, used FROM password_resets WHERE patient_id = ?",
      [patientId]
    );
    if (rows.length === 0) return res.status(400).json({ message: "Token không hợp lệ." });

    const record = rows[0];
    if (record.used) return res.status(400).json({ message: "Link reset đã được sử dụng." });
    if (new Date(record.expire_time) < new Date()) return res.status(400).json({ message: "Token đã hết hạn." });

    const isValid = await bcrypt.compare(token, record.reset_token);
    if (!isValid) return res.status(400).json({ message: "Token không hợp lệ." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.execute("UPDATE accountlists SET password_hash = ? WHERE patient_id = ?", [hashed, patientId]);
    await pool.execute("UPDATE password_resets SET used = TRUE WHERE patient_id = ?", [patientId]);

    res.json({ message: "Đặt lại mật khẩu thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
});

// ---------------------- VALIDATE TOKEN ----------------------
app.post("/reset-password/validate", async (req, res) => {
  const { token, email } = req.body;
  try {
    const [users] = await pool.execute("SELECT patient_id FROM patients WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ message: "Token không hợp lệ." });

    const patientId = users[0].patient_id;
    const [rows] = await pool.execute("SELECT reset_token, expire_time, used FROM password_resets WHERE patient_id = ?", [patientId]);
    if (rows.length === 0) return res.status(400).json({ message: "Token không hợp lệ." });

    const record = rows[0];
    if (record.used) return res.status(400).json({ message: "Link reset đã được sử dụng." });
    if (new Date(record.expire_time) < new Date()) return res.status(400).json({ message: "Token đã hết hạn." });

    const isValid = await bcrypt.compare(token, record.reset_token);
    if (!isValid) return res.status(400).json({ message: "Token không hợp lệ." });

    res.json({ message: "Token hợp lệ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ---------------------- APPOINTMENTS ----------------------
app.post("/api/patients-appointments", async (req, res) => {
  const { appointment_datetime, symptom_text } = req.body;

  const patient_id = req.user.patient_id;   // lấy từ token

  if (!appointment_datetime || !symptom_text)
    return res.status(400).json({ error: "Missing required fields." });

  try {
    const [result] = await pool.query(
      `
      INSERT INTO patients_appointing (patient_id, appointment_datetime, symptom_text)
      VALUES (?, ?, ?)
      `,
      [patient_id, appointment_datetime, symptom_text]
    );

    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/api/patients-appointments", verifyToken, async (req, res) => {
  try {
    let [rows] = [[]];

    if (req.user.role === "patient") {
      const pid = req.user.id; // đảm bảo token decode có id
      [rows] = await pool.query(
        `SELECT pa.appointment_id, pa.appointment_datetime, pa.symptom_text, pa.status,
                p.full_name AS patientName, p.phone AS patientPhone, p.email AS patientEmail,
                COALESCE(d.full_name, 'Chưa phân công') AS doctor
         FROM patients_appointing pa
         LEFT JOIN patients p ON pa.patient_id = p.patient_id
         LEFT JOIN doctors d ON pa.doctor_id = d.doctor_id
         WHERE pa.patient_id = ?
         ORDER BY pa.appointment_datetime ASC`,
        [pid]
      );
    } else if (req.user.role === "doctor" || req.user.role === "nurse") {
      [rows] = await pool.query(
        `SELECT pa.appointment_id, pa.appointment_datetime, pa.symptom_text, pa.status,
                p.full_name AS patientName, p.phone AS patientPhone, p.email AS patientEmail,
                COALESCE(d.full_name, 'Chưa phân công') AS doctor
         FROM patients_appointing pa
         LEFT JOIN patients p ON pa.patient_id = p.patient_id
         LEFT JOIN doctors d ON pa.doctor_id = d.doctor_id
         ORDER BY pa.appointment_datetime ASC`
      );
    } else {
      return res.status(403).json({ error: "Unauthorized role" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Lỗi fetchAppointments:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});


// ---------------------- REGISTER STAFF ----------------------
app.post("/staff/register", async (req, res) => {
  const { username, password, name, dob, email, phone, sex, role, license_number, specialization } = req.body;
  let connection;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let staffId;
    const normalizedRole = role?.toLowerCase();
    if (normalizedRole === "bác sĩ" || normalizedRole === "doctor") {
      const [doctorResult] = await connection.query(
        "INSERT INTO doctors (full_name, date_of_birth, email, phone, gender, license_number, specialization) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, dob, email, phone, sex, license_number, specialization]
      );
      staffId = doctorResult.insertId;
      await connection.query("INSERT INTO accountlists (username, password_hash, doctor_id, role) VALUES (?, ?, ?, ?)", [username, hashedPassword, staffId, "doctor"]);
    } else {
      const [staffResult] = await connection.query(
        "INSERT INTO staff (full_name, date_of_birth, email, phone, sex, role) VALUES (?, ?, ?, ?, ?, ?)",
        [name, dob, email, phone, sex, role]
      );
      staffId = staffResult.insertId;
      await connection.query("INSERT INTO accountlists (username, password_hash, staff_id, role) VALUES (?, ?, ?, ?)", [username, hashedPassword, staffId, role]);
    }

    await connection.commit();
    res.json({ message: "Staff registered successfully" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ---------------------- ACCOUNT ----------------------
app.get("/api/account/:role/:id", async (req, res) => {
  const { role, id } = req.params;
  const roleMap = { doctor: { table: "doctors", key: "doctor_id" }, staff: { table: "staff", key: "staff_id" }, patient: { table: "patients", key: "patient_id" } };
  const mapping = roleMap[role];
  if (!mapping) return res.status(400).json({ message: "Invalid role" });

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT *, ?? as original_id FROM ?? WHERE ?? = ?`, [mapping.key, mapping.table, mapping.key, id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    const row = rows[0];

    let unifiedId;
    if (role === "doctor") unifiedId = row.doctor_id;
    else if (role === "staff") unifiedId = row.staff_id;
    else if (role === "patient") unifiedId = row.patient_id;

    res.json({ id: unifiedId, full_name: row.full_name, date_of_birth: row.date_of_birth, email: row.email, phone: row.phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
});

// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API chạy ở http://localhost:${PORT}`));
