import React from "react";
import "../cssfile/Dashboard.css";

function Dashboard()
{ return (
<div className="dashboard-container">
    <div className="styling">
        <h1>Dashboard</h1>
    </div>
    <div className="dashboard_func_bord">
    <div className="group1">
    <div className="calendar_today">
      Thứ, ngày tháng năm 20
      <br></br> 
      Xin chào, 
    </div>
    <div className="cases">
        <h2>Lịch hẹn hôm nay:</h2>
    </div>
     <div className="notes">
        <h2>Ghi chú</h2>
    </div>
    </div>
    <div className="desktop">
            <h2>Thống kê</h2>
    </div>
    <div className="group2">
    <div className="workspace_func_1">
        <h2>Tính năng 1</h2>
    </div>
    <div className="workspace_func_2">
        <h2>Tính năng 2</h2>
    </div>
    </div>
    </div>
</div>
)
}
export default Dashboard;