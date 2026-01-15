import React, { useState, useEffect } from "react";
import "../cssfile/Dashboard.css";
import { Calendar, Clock, FileText, Users, Activity, TrendingUp, Bell, StickyNote } from "lucide-react";
import { useAuth } from "./AuthContext";

function Dashboard() {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${dayName}, ngày ${day} tháng ${month} năm ${year}`;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Mock data - có thể thay thế bằng API calls
    const stats = [
        { title: 'Tổng bệnh nhân', value: '1,234', icon: Users, color: '#3b82f6', change: '+12%' },
        { title: 'Lịch hẹn hôm nay', value: '45', icon: Calendar, color: '#10b981', change: '+5' },
        { title: 'Bệnh án mới', value: '28', icon: FileText, color: '#f59e0b', change: '+8%' },
        { title: 'Hoạt động', value: '89%', icon: Activity, color: '#ef4444', change: '+2%' },
    ];

    const upcomingAppointments = [
        { time: '08:00', patient: 'Nguyễn Văn A', type: 'Khám tổng quát' },
        { time: '09:30', patient: 'Trần Thị B', type: 'Tái khám' },
        { time: '11:00', patient: 'Lê Văn C', type: 'Khám chuyên khoa' },
        { time: '14:00', patient: 'Phạm Thị D', type: 'Khám tổng quát' },
    ];

    const notes = [
        { id: 1, content: 'Nhắc nhở kiểm tra kết quả xét nghiệm cho bệnh nhân P001', date: 'Hôm nay' },
        { id: 2, content: 'Chuẩn bị tài liệu cho cuộc họp tuần tới', date: 'Ngày mai' },
        { id: 3, content: 'Cập nhật thông tin bệnh án điện tử', date: 'Tuần này' },
    ];

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-greeting">
                            Xin chào, <span className="user-name">{user?.username || 'Người dùng'}</span> 👋
                        </p>
                    </div>
                    <div className="date-time-card">
                        <div className="date-display">
                            <Calendar size={20} />
                            <span>{formatDate(currentDate)}</span>
                        </div>
                        <div className="time-display">
                            <Clock size={20} />
                            <span>{formatTime(currentDate)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="stat-card" style={{ '--accent-color': stat.color }}>
                            <div className="stat-icon-wrapper">
                                <Icon size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-title">{stat.title}</p>
                                <h3 className="stat-value">{stat.value}</h3>
                                <div className="stat-change">
                                    <TrendingUp size={14} />
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Appointments Section */}
                <div className="dashboard-card appointments-card">
                    <div className="card-header">
                        <div className="card-title-wrapper">
                            <Calendar size={20} />
                            <h2>Lịch hẹn hôm nay</h2>
                        </div>
                        <span className="badge">{upcomingAppointments.length}</span>
                    </div>
                    <div className="appointments-list">
                        {upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map((appointment, index) => (
                                <div key={index} className="appointment-item">
                                    <div className="appointment-time">{appointment.time}</div>
                                    <div className="appointment-details">
                                        <div className="appointment-patient">{appointment.patient}</div>
                                        <div className="appointment-type">{appointment.type}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">Không có lịch hẹn nào hôm nay</div>
                        )}
                    </div>
                </div>

                {/* Statistics Chart Section */}
                <div className="dashboard-card stats-chart-card">
                    <div className="card-header">
                        <div className="card-title-wrapper">
                            <Activity size={20} />
                            <h2>Thống kê</h2>
                        </div>
                    </div>
                    <div className="chart-placeholder">
                        <div className="chart-bars">
                            {[65, 80, 45, 90, 70, 55, 85].map((height, index) => (
                                <div key={index} className="chart-bar" style={{ height: `${height}%` }}></div>
                            ))}
                        </div>
                        <p className="chart-label">Biểu đồ thống kê tuần này</p>
                    </div>
                </div>

                {/* Notes Section */}
                <div className="dashboard-card notes-card">
                    <div className="card-header">
                        <div className="card-title-wrapper">
                            <StickyNote size={20} />
                            <h2>Ghi chú</h2>
                        </div>
                    </div>
                    <div className="notes-list">
                        {notes.length > 0 ? (
                            notes.map((note) => (
                                <div key={note.id} className="note-item">
                                    <div className="note-content">{note.content}</div>
                                    <div className="note-date">{note.date}</div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">Chưa có ghi chú nào</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card quick-actions-card">
                    <div className="card-header">
                        <div className="card-title-wrapper">
                            <Bell size={20} />
                            <h2>Tính năng nhanh</h2>
                        </div>
                    </div>
                    <div className="quick-actions-grid">
                        <div className="action-item">
                            <div className="action-icon" style={{ backgroundColor: '#3b82f6' }}>
                                <FileText size={24} />
                            </div>
                            <span>Tính năng 1</span>
                        </div>
                        <div className="action-item">
                            <div className="action-icon" style={{ backgroundColor: '#10b981' }}>
                                <Users size={24} />
                            </div>
                            <span>Tính năng 2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;