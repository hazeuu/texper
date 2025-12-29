import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = "SUPER_SECRET_KEY"; // đổi thành key thật

// Kết nối MySQL
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "@ima.bietduoC418375",
    database: "project_demo",
    waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ---------------------- REGISTER ----------------------
app.post("/register", async (req, res) => {
  const { username, password, name, dob, email, phone } = req.body;
  let connection;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await pool.getConnection();
    // Bắt đầu transaction
    await connection.beginTransaction();

    // 1. Tạo patient
    const [patientResult] = await connection.query(
      "INSERT INTO patients (full_name, date_of_birth, email, phone) VALUES (?, ?, ?, ?)",
      [name, dob, email, phone]
    );

    const patientId = patientResult.insertId;

    // 2. Tạo account liên kết patient_id
    await connection.query(
      "INSERT INTO accountlists (username, password_hash, patient_id) VALUES (?, ?, ?)",
      [username, hashedPassword, patientId]
    );

    // 3. Commit transaction
    await connection.commit();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    if (connection) await connection.rollback(); // rollback nếu lỗi
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release(); // trả connection về pool
  }
});


// ---------------------- LOGIN ----------------------
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Request body:", req.body);

    const [rows] = await pool.execute(
      "SELECT * FROM accountlists WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }

    const user = rows[0];

    if (!user.password_hash) {
      return res.status(500).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }

    // Xác định id theo role
    let userId;
    if (user.role === "doctor") userId = user.doctor_id;
    else if (user.role === "staff") userId = user.staff_id;
    else if (user.role === "patient") userId = user.patient_id;

    const token = jwt.sign(
      { id: userId, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "360s" }
    );

    res.json({
      message: "Login thành công",
      token,
      user: {
        id: userId,            // id chung cho frontend
        username: user.username,
        role: user.role,
        doctor_id: user.doctor_id,
        staff_id: user.staff_id,
        patient_id: user.patient_id
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- data_name_patients ----------------------
app.get("/patients", (req, res) => {
    const sql = "SELECT patient_id FROM patients where full_name=?";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        res.json(results);
    });
});

// ---------------------- forgot_password ----------------------
dotenv.config();

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

app.post("/forgot-password", async (req, res) => {

  const { email } = req.body;
  console.log("REQUEST EMAIL:", email);

  try {
    const [users] = await db.promise().execute(
      "SELECT patient_id FROM patients WHERE email=?",
      [email]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "Email không tồn tại" });

    const patientId = users[0].patient_id;

    const resetToken = crypto.randomBytes(32).toString("hex");
      console.log("RAW TOKEN SENT:", resetToken);
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const expireTime = new Date(Date.now() + 3600000);

    await db.promise().execute(
      `INSERT INTO password_resets (patient_id, reset_token, expire_time)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         reset_token = VALUES(reset_token),
         expire_time = VALUES(expire_time),
         used = FALSE`,
      [patientId, resetTokenHash, expireTime]
    );

   const resetLink =
 `${process.env.FRONTEND_URL}/reset_password?token=${encodeURIComponent(resetToken)}&email=${email}`;


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset mật khẩu",
      html: `<p>Click vào link: <a href="${resetLink}">Đặt lại mật khẩu</a></p>`,
    });

    res.json({ message: "OK" });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ---------------------- reset_password ----------------------
app.post("/reset-password", async (req, res) => {
    console.log("REQ BODY:", req.body);
  try {
    const { token, email, newPassword, newPasswordConfirm } = req.body;
    

    if (!token || !email || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({ message: "Thiếu dữ liệu." });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });
    }

    // Lấy patient_id theo email
    const [users] = await db.promise().execute(
      "SELECT patient_id FROM patients WHERE email=?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Email không tồn tại." });
    }

    const patientId = users[0].patient_id;

    // Lấy token hash trong DB
    const [rows] = await db
      .promise()
      .execute(
        "SELECT reset_token, expire_time, used FROM password_resets WHERE patient_id=?",
        [patientId]
      );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Token không hợp lệ." });
    }

    const record = rows[0];

    if (record.used) {
      return res.status(400).json({ message: "Link reset đã được sử dụng." });
    }

    if (new Date(record.expire_time) < new Date()) {
      return res.status(400).json({ message: "Token đã hết hạn." });
    }

    // So sánh token raw (client gửi) với token đã hash trong DB
    console.log("CLIENT TOKEN:", token);
console.log("DB HASH:", record.reset_token);

    const isValid = await bcrypt.compare(token, record.reset_token);
console.log("TOKEN MATCH?", isValid);
    
    if (!isValid) {
      return res.status(400).json({ message: "Token không hợp lệ." });
    }

    // Hash mật khẩu mới
    const hashed = await bcrypt.hash(newPassword, 10);

    await db
      .promise()
      .execute("UPDATE accountlists SET password_hash=? WHERE patient_id=?", [
        hashed,
        patientId,
      ]);

    // Đánh dấu token đã dùng
    await db
      .promise()
      .execute(
        "UPDATE password_resets SET used=TRUE WHERE patient_id=?",
        [patientId]
      );

    res.json({ message: "Đặt lại mật khẩu thành công." });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
});

// ---------------------- validate_token ----------------------
app.post("/reset-password/validate", async (req, res) => {
  try {
    const { token, email } = req.body;

    const [users] = await db
      .promise()
      .execute("SELECT patient_id FROM patients WHERE email=?", [email]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Token không hợp lệ." });
    }

    const patientId = users[0].patient_id;

    const [rows] = await db
      .promise()
      .execute(
        "SELECT reset_token, expire_time, used FROM password_resets WHERE patient_id=?",
        [patientId]
      );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Token không hợp lệ." });
    }

    const record = rows[0];

    if (record.used) {
      return res.status(400).json({ message: "Link reset đã được sử dụng." });
    }

    if (new Date(record.expire_time) < new Date()) {
      return res.status(400).json({ message: "Token đã hết hạn." });
    }

    const isValid = await bcrypt.compare(token, record.reset_token);
    if (!isValid) {
      return res.status(400).json({ message: "Token không hợp lệ." });
    }

    return res.json({ message: "Token hợp lệ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ---------------------- pick an appointment_patients ----------------------
app.post("/api/patients-appointments", async (req, res) => {
    const { patient_id, appointment_datetime, symptom_text } = req.body;

    if (!patient_id || !appointment_datetime || !symptom_text) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO patients_appointing (patient_id, appointment_datetime, symptom_text)
             VALUES (?, ?, ?)`,
            [patient_id, appointment_datetime, symptom_text]
        );

        res.status(201).json({
            message: "Appointment created successfully",
            appointment_id: result.insertId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.get("/api/patients-appointments", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
    pa.appointment_id,
    pa.appointment_datetime,
    pa.symptom_text,
    pa.status,
    p.full_name AS patientName,
    p.email AS patientEmail,
    p.phone AS patientPhone
FROM patients_appointing pa
LEFT JOIN patients p ON pa.patient_id = p.patient_id
ORDER BY pa.appointment_datetime ASC;
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ---------------------- REGISTER STAFF ----------------------
app.post("/staff/register", async (req, res) => {
  const {
    username,
    password,
    name,
    dob,
    email,
    phone,
    sex,
    role,
    license_number,
    specialization
  } = req.body;

  let connection;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let staffId;

    // Chuẩn hóa role: lowercase, loại bỏ dấu nếu cần
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === "bác sĩ" || normalizedRole === "doctor") {
      // Ghi vào bảng doctors
      const [doctorResult] = await connection.query(
        `INSERT INTO doctors 
        (full_name, date_of_birth, email, phone, gender, license_number, specialization)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, dob, email, phone, sex, license_number, specialization]
      );
      staffId = doctorResult.insertId;

      // Tạo account liên kết doctor_id
      await connection.query(
        "INSERT INTO accountlists (username, password_hash, doctor_id, role) VALUES (?, ?, ?, ?)",
        [username, hashedPassword, staffId, "doctor"]
      );
    } else {
      // Ghi vào bảng staff
      const [staffResult] = await connection.query(
        `INSERT INTO staff 
        (full_name, date_of_birth, email, phone, sex, role)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, dob, email, phone, sex, role]
      );
      staffId = staffResult.insertId;

      // Tạo account liên kết staff_id
      await connection.query(
        "INSERT INTO accountlists (username, password_hash, staff_id, role) VALUES (?, ?, ?, ?)",
        [username, hashedPassword, staffId, role]
      );
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


//-----------------acccount-------------------------
app.get("/api/account/:role/:id", async (req, res) => {
  const { role, id } = req.params;

  // Mapping role → table + cột id
  const roleMap = {
    doctor: { table: "doctors", key: "doctor_id" },
    staff: { table: "staff", key: "staff_id" },
    patient: { table: "patients", key: "patient_id" },
  };

  const mapping = roleMap[role];
  if (!mapping) return res.status(400).json({ message: "Invalid role" });

  let connection;
  try {
    connection = await pool.getConnection();
    console.log("role:", role, "id:", id);

    // Lấy dữ liệu từ db
    const [rows] = await connection.query(
      `SELECT *, ?? as original_id FROM ?? WHERE ?? = ?`,
      [mapping.key, mapping.table, mapping.key, id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const row = rows[0];

    // Chuẩn hóa id chung
    let unifiedId;
    if (role === "doctor") unifiedId = row.doctor_id;
    else if (role === "staff") unifiedId = row.staff_id;
    else if (role === "patient") unifiedId = row.patient_id;

    // Trả về frontend
    res.json({
      id: unifiedId,
      full_name: row.full_name,
      date_of_birth: row.date_of_birth,
      email: row.email,
      phone: row.phone
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
});


// ---------------------- START SERVER ----------------------
app.listen(3000, () =>  {console.log("API chạy ở http://localhost:3000");});
