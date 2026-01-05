import React, { useState, useMemo, useEffect } from "react";
import "../cssfile/calendar.css";
import { useAuth } from "../jsx/AuthContext";


function Remindering({ role }) {
    console.log("Role hiện tại:", role);
  const { user } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const [filters, setFilters] = useState({
    searchPatient: "",
    searchDoctor: "",
    date: "",
  });

  useEffect(() => {
  const fetchAppointments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const response = await fetch("http://localhost:3000/api/patients-appointments", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("API error", err);
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected response", data);
      return;
    }

    const mapped = data.map(item => ({
      id: item.appointment_id,
      patientName: item.patientName || "Bệnh nhân",
      phone: item.patientPhone || "",
      email: item.patientEmail || "",
      time: new Date(item.appointment_datetime).toLocaleString("vi-VN", { hour12: false }),
      tags: item.symptom_text,
      doctor: item.doctor || "Đang chờ phân công",
      status: item.status || "pending",
    }));

    setAppointments(mapped);
  } catch (err) {
    console.error("Lỗi lấy lịch hẹn:", err);
  }
};

  fetchAppointments();
}, []);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ---- ACTIONS -----

  
  const markDone = (id) => {
    if (role !== "doctor" && role !== "nurse") return;
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Đã khám" } : item
      )
    );
  };

  const cancelAppointment = (id) => {
    if (role !== "patient") return;
    const ok = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?");
    if (!ok) return;
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Bệnh nhân hủy" } : item
      )
    );
  };

const [form, setForm] = useState({ tags: "", time: "", date: "" });
const [editingId, setEditingId] = useState(null);

const handleChange = (e) =>
  setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();

 try {
      if (!form.date || !form.time || !form.tags) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
      }

      // Gửi dữ liệu lên backend
      const response = await fetch(
        "http://localhost:3000/api/patients-appointments",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({patient_id: user?.id || 0,
          appointment_datetime: `${form.date} ${form.time}`,
          symptom_text: form.tags,})
        }
      );

      const data = await response.json();
      await fetchAppointments();

      setAppointments((prev) => [
        ...prev,
        {
          id: data.appointment_id,
          patientName: user?.name || "Bệnh nhân",
          time: `${form.date} ${form.time}`,
          doctor: "Đang chờ phân công",
          status: "pending",
          patientId: user?.id || 0,
          tags: form.tags,
        },
      ]);

      setForm({ tags: "", time: "", date: "" });
      setShowCreateForm(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Lỗi kết nối server");
    }


  if (editingId) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === editingId ? { ...a, ...form } : a
      )
    );
    setEditingId(null);
  } else {
    setAppointments((prev) => [
      ...prev,
      {
        id: Date.now(),
        patientName: user?.name || "Bệnh nhân",
        time: `${form.date} ${form.time}`,
        doctor: "Đang chờ phân công",
        status: "Chưa khám",
        patientId: user?.id || 0,
        tags: form.tags,
      },
    ]);
  }

  setForm({ tags: "", time: "", date: "" });
  setShowCreateForm(false);
};

  const reschedule = (id) => {
    if (role !== "receptionist") return;
    alert("Lễ tân sẽ mở modal đổi lịch (TODO)");
  };

  // >>> NEW: receptionist delete
const deleteAppointment = (id) => {
  if (role !== "receptionist") return;

  const ok = window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?");
  if (!ok) return;

  setAppointments((prev) => prev.filter((item) => item.id !== id));
};




  // ---- FILTER -----

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchPatient = item.patientName
        .toLowerCase()
        .includes(filters.searchPatient.toLowerCase());

      const matchDoctor = item.doctor
        .toLowerCase()
        .includes(filters.searchDoctor.toLowerCase());

      const matchDate = filters.date
        ? item.time.startsWith(filters.date)
        : true;

      return matchPatient && matchDoctor && matchDate;
    });
  }, [appointments, filters]);

  return (
    <div className="appointment-container">
      <h1>LỊCH HẸN KHÁM BỆNH</h1>

      {/* FILTER + CREATE (patient) */}
      <div className="filter-row">
        <input
          type="text"
          name="searchPatient"
          placeholder="Lọc theo tên bệnh nhân"
          value={filters.searchPatient}
          onChange={handleFilterChange}
        />

        <input
          type="text"
          name="searchDoctor"
          placeholder="Lọc theo bác sĩ"
          value={filters.searchDoctor}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="date"
          placeholder="Lọc theo ngày"
          value={filters.date}
          onChange={handleFilterChange}
        />

        {/* >>> NEW: Only patient can see */}
        {role === "patient" && (
          <button className="create-btn" onClick={() => setShowCreateForm(true)}>
            Tạo lịch mới
          </button>
        )}
      </div>

{showCreateForm && role === "patient" && (
  <div className="calendarize">
    <form onSubmit={handleSubmit} className="stlying_calendar">
        <div className="splitter_calendar">
            <b>Lưu ý:</b>Vui lòng miêu tả chi tiết (tối đa 200 chữ) về tình trạng hiện tại
            đang gặp phải. <br></br>Lịch hẹn đã chọn chỉ là dự kiến. Sau khi đặt lịch xong, 
            hãy chú ý Email để được xác nhận về lịch hẹn cuối cùng.
        <div className="no">
      <h3>Chọn ngày khám:</h3>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />
    </div>
    <div className="no">
      <h3>Thời gian hẹn:</h3>
      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        required
      />
    </div>      
    <div className="no">
      <h3>Mô tả triệu chứng:</h3>
      <textarea
        name="tags"
        value={form.tags}
        onChange={handleChange}
        required
        maxLength={200}
        placeholder="Mô tả chi tiết triệu chứng…"
      />
    </div>
    </div>
      <div className="calendar_button">
        <button type="submit">
          {editingId ? "Cập nhật" : "Đặt lịch"}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowCreateForm(false);
            setEditingId(null);
          }}
        >
          Hủy
        </button>
      </div>
    </form>
  </div>
)}


      <table className="appointment-table">
        <thead>
  <tr>
    <th>STT</th>
    <th>Tên bệnh nhân</th>
    {role !== "patient" && <th>Số điện thoại</th>}
    {role !== "patient" && <th>Email</th>}
    <th>Thời gian hẹn</th>
    <th>Mô tả tình trạng</th>
    <th>Bác sĩ phụ trách</th>
    <th>Trạng thái</th>
    {(role === "doctor" || role === "nurse") && <th>Đánh dấu đã khám</th>}
    {role === "receptionist" && <th>Thao tác</th>}
    {role === "patient" && <th>Hành động</th>}
  </tr>
</thead>

        <tbody>
          {filteredAppointments.map((row, index) => (
            <tr key={row.id}>
              <th>{index + 1}</th>
              <th>{row.patientName}</th>
               {role !== "patient" && <th>{row.phone}</th>}
               {role !== "patient" && <th>{row.email}</th>}
              <th>{row.time}</th>
              <th>{row.tags}</th>
              <th>{row.doctor}</th>
              <th>{row.status}</th>

              {(role === "doctor" || role === "nurse") && (
                <th>
                  <button
                    className="done-btn"
                    disabled={row.status === "Đã khám"}
                    onClick={() => markDone(row.id)}
                  >
                    {row.status === "Đã khám" ? "Hoàn tất" : "Đã khám"}
                  </button>
                </th>
              )}

              {role === "receptionist" && (
                    <th className="actions-cell">
                        <button onClick={() => assign(row.id)}>
            Phân công
          </button>
                    <button onClick={() => reschedule(row.id)}>
                Đổi lịch
                    </button>

                    <button
                    onClick={() => deleteAppointment(row.id)}>
                Xóa
                </button>
                </th>
                )}

              {role === "patient" && (
                <th>
                  <button
                    disabled={row.status !== "Chưa khám"}
                    onClick={() => cancelAppointment(row.id)}
                  >
                    Hủy lịch
                  </button>
                </th>
              )}
            </tr>
          ))}

          {filteredAppointments.length === 0 && (
            <tr>
              <th colSpan="9" className="empty-row">
                Không có dữ liệu phù hợp
              </th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Remindering;
