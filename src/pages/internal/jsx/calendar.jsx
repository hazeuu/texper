import React from "react";
import { useState } from "react";
import "../cssfile/calendar.css";

function calendaring()
{
    const [appointments, setAppointments] = useState([
  ]);

  const [form, setForm] = useState({ tags: "", time: "", date: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form } : a))
      );
      setEditingId(null);
    } else {
      setAppointments((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setForm({time: "", date: "",tags: ""});
  };

  const handleDelete = (id) =>
    setAppointments((prev) => prev.filter((a) => a.id !== id));

  const handleEdit = (a) => {
    setEditingId(a.id);
    setForm({ tags: a.tags, time: a.time, date: a.date });
  };
    
return(
        <div className="calendarize"><h1>Tạo lịch hẹn</h1>
        <p>Lưu ý trong quá trình đặt lich:<br></br>
        Lựa chọn thật kĩ thời gian trước khi quyết định đặt lịch và tới khám đúng thời gian đã hẹn để quá trình khám diễn ra thuận lợi nhất.<br></br>
        Sau khi đặt lịch thành công, Email xác nhận sẽ được gửi trong vòng 48h. <br></br>
        Vui lòng kiểm tra Email hoặc quay trở lại trang này để biết thêm chi tiết về lịch hẹn và các thay đổi khác nếu có.</p>
    <div className="p-6">
      {/* Form thêm/sửa */}
      <form
        onSubmit={handleSubmit}
        className="stlying_calendar"
      >
         <h2>Chọn ngày khám:</h2>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        /> 
         <br></br>
         <h2>Thời gian hẹn gặp:</h2>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="Giờ (HH:mm)"
          required
        />
       <br></br> <h2>Mô tả chi tiết triệu chứng đi kèm:</h2>
        <textarea
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Mô tả chi tiết triệu chứng. Ví dụ đau ở đâu, kéo dài bao lâu,..."
          required
          maxLength={200}
        />
        <button
          type="submit"
        >
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      {/* Danh sách lịch hẹn */}
      <div className="grid gap-4">
        {appointments.map((a) => (
          <div
            key={a.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{a.name}</h3>
              <p className="text-gray-600">
                Lịch hẹn: {a.time} - ngày {a.date}. <br></br>
                Triệu chứng đi kèm: {a.tags}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => alert("Gửi tin nhắn!")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Gửi
              </button>
              <button
                onClick={() => handleEdit(a)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div></div>
  );
}
export default calendaring;