import React, { useState } from "react";
import "../about.css";

export default function About() {
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "Thông tin chung" },
        { id: "history", label: "Lịch sử" },
        { id: "functions", label: "Chức năng & Nhiệm vụ" },
        { id: "achievements", label: "Thành tích" },
        { id: "vision", label: "Định hướng" }
    ];

    return (
        <div className="about-container">
            {/* Hero Section */}
            <div className="about-hero">
                <h1 className="about-title">Bệnh viện Phụ Sản Trung Ương</h1>
                <p className="about-subtitle">
                    Bệnh viện chuyên khoa hạng I về chuyên ngành Sản Phụ khoa
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="about-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div className="about-content">
                {/* General Information */}
                {activeTab === "general" && (
    <div className="content-section fade-in">
        {/* Header Card */}
        <div className="general-header-card">
            <div className="header-meta">
                <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span><h1 className="hospital-name">Thành lập: 19/7/1955</h1></span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">🏥</span>
                    <span><div className="hospital-name-en">Bệnh viện hạng I chuyên khoa</div></span>
                </div>
            </div>
        </div>

        {/* Contact & Location Section */}
        <div className="contact-location-grid">
            <div className="contact-card">
                <div className="card-icon-large">📍</div>
                <h3>Địa chỉ</h3>
                <p>Số 1 Triệu Quốc Đạt, phường Cửa Nam, TP Hà Nội</p>
            </div>

            <div className="contact-card">
                <div className="card-icon-large">📞</div>
                <h3>Liên hệ</h3>
                <div className="contact-details">
                    <div className="contact-item">
                        <strong>Hotline:</strong> 19001029
                    </div>
                    <div className="contact-item">
                        <strong>Fax:</strong> (024) 38254638
                    </div>
                    <div className="contact-email">
                        📧 vanthu@benhvienphusantrunguong.org.vn
                    </div>
                </div>
            </div>
        </div>

        {/* Leadership Section */}
        <div className="leadership-section">
            <h2 className="section-title-new">Ban Lãnh đạo</h2>
            
            {/* Director */}
            <div className="director-main-card">
                <div className="director-icon">👨‍⚕️</div>
                <div className="director-role">Giám đốc</div>
                <div className="director-image"><img src="http://benhvienphusantrunguong.org.vn/stores/news_dataimages/bvpstwadministrator/012024/03/15/medium/GD_Nguyen_Duy_Anh_1.jpg"></img></div>
                <div className="director-name">
                TTND.GS.TS.BS Nguyễn Duy Ánh</div>
            </div>

            {/* Deputy Directors */}
            <div className="deputy-section">
                <h3 className="deputy-title">Phó Giám đốc</h3>
                <div className="deputy-grid">
                    <div className="deputy-card">
                        <div className="deputy-image"><img src="http://benhvienphusantrunguong.org.vn/stores/news_dataimages/bvpstwadministrator/092022/27/14/medium/le_hoai_chuong_chuan___Copy.jpg"></img></div>
                        PGS. TS Lê Hoài Chương</div>
                    <div className="deputy-card">
                        <div className="deputy-image"><img src="http://benhvienphusantrunguong.org.vn/stores/news_dataimages/bvpstwadministrator/092022/29/13/medium/le_dinh_cuong_3.jpg"></img> </div>
                        Ths. BS Lê Đình Cường</div>
                    <div className="deputy-card">
                        <div className="deputy-image"><img src="http://benhvienphusantrunguong.org.vn/stores/news_dataimages/bvpstwadministrator/092022/29/15/medium/a_Du_1_1.jpg"></img> </div>
                        PGS. TS Vũ Văn Du</div>
                    <div className="deputy-card">
                        <div className="deputy-image"><img src="http://benhvienphusantrunguong.org.vn/stores/news_dataimages/nvcong/062025/17/09/nh_up_web_5.jpg"></img> </div>
                        PGS. TS Nguyễn Thị Thu Hà</div>
                </div>
            </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
            <h2 className="section-title-new">Quy mô nhân sự</h2>

            <div className="stats-grid">
                <div className="stat-card-main">
                    <div className="stat-number-large">1,552</div>
                    <div className="stat-label">Tổng nhân sự</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👨‍⚕️</div>
                    <div className="stat-number">205</div>
                    <div className="stat-label">Bác sĩ</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👩‍⚕️</div>
                    <div className="stat-number">448</div>
                    <div className="stat-label">Điều dưỡng</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🤱</div>
                    <div className="stat-number">300</div>
                    <div className="stat-label">Hộ sinh</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔬</div>
                    <div className="stat-number">110</div>
                    <div className="stat-label">Kỹ thuật viên</div>
                </div>
            </div>
        </div>

        {/* Capacity Section */}
        <div className="capacity-section-new">
            <h2 className="section-title-new">Cơ sở vật chất</h2>

            <div className="facility-grid">
                <div className="facility-card">
                    <div className="facility-icon">🛏️</div>
                    <div className="facility-number">1000</div>
                    <div className="facility-label">Giường bệnh</div>
                </div>

                <div className="facility-card">
                    <div className="facility-icon">🏥</div>
                    <div className="facility-number">14</div>
                    <div className="facility-label">Khoa lâm sàng</div>
                </div>

                <div className="facility-card">
                    <div className="facility-icon">🔬</div>
                    <div className="facility-number">09</div>
                    <div className="facility-label">Khoa cận lâm sàng</div>
                </div>

                <div className="facility-card">
                    <div className="facility-icon">⚕️</div>
                    <div className="facility-number">09</div>
                    <div className="facility-label">Phòng chức năng</div>
                </div>

                <div className="facility-card">
                    <div className="facility-icon">🏛️</div>
                    <div className="facility-number">07</div>
                    <div className="facility-label">Trung tâm</div>
                </div>
            </div>

            <div className="facility-description">
                <p>
                    Bệnh viện có hệ thống trang thiết bị phục vụ khám bệnh, chữa bệnh được đầu tư theo 
                    hướng hiện đại, chuyên sâu. Các khoa, phòng, trung tâm được trang bị đầy đủ các hệ 
                    thống máy xét nghiệm sinh hoá, huyết học, miễn dịch... trong đó có nhiều hệ thống 
                    xét nghiệm mới được các quốc gia có nền y học tiên tiến trên thế giới đưa vào sử dụng.
                </p>
            </div>
        </div>
    </div>
)}

                {/* History */}
                {activeTab === "history" && (
                    <div className="content-section fade-in">
                        <div className="history-timeline">
                            <div className="timeline-item">
                                <div className="timeline-year">1955</div>
                                <div className="timeline-content">
                                    <h3>Thành lập Bệnh viện "C"</h3>
                                    <p>
                                        Ngày 19/7/1955, Bác sĩ Hoàng Tích Trí, Bộ Trưởng Bộ Y tế ký Nghị định 
                                        615-ZYO/NĐ/3A quy định tổ chức các cơ quan kế cận và trực thuộc Bộ, 
                                        chính thức thành lập bệnh viện "C" đặt nền móng đầu tiên cho bệnh viện 
                                        Phụ - Sản Trung ương ngày nay.
                                    </p>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-year">1960</div>
                                <div className="timeline-content">
                                    <h3>Tổ chức lại theo hướng chuyên khoa</h3>
                                    <p>
                                        Ngày 08/11/1960, Bộ Y tế có QĐ 708/BYT sửa đổi, tổ chức lại bệnh viện "C" 
                                        theo hướng chuyên khoa phụ sản.
                                    </p>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-year">1966</div>
                                <div className="timeline-content">
                                    <h3>Đổi tên thành Viện Bảo vệ Bà mẹ và Trẻ sơ sinh</h3>
                                    <p>
                                        Ngày 14/5/1966, Thủ tướng Chính phủ Phạm Văn Đồng ký Quyết định số 88/CP 
                                        đổi tên bệnh viện "C" thành Viện Bảo vệ Bà mẹ và Trẻ sơ sinh. Lần đầu tiên 
                                        tại Việt Nam có một Viện chuyên ngành nghiên cứu tình trạng sinh lý, 
                                        bệnh lý của phụ nữ, của các bà mẹ và trẻ sơ sinh.
                                    </p>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-year">2003</div>
                                <div className="timeline-content">
                                    <h3>Đổi tên thành Bệnh viện Phụ - Sản Trung ương</h3>
                                    <p>
                                        Ngày 18/6/2003, Bộ trưởng Bộ Y tế ký Quyết định 2212/QĐ-BYT đổi tên Viện 
                                        Bảo vệ Bà mẹ và Trẻ sơ sinh thành bệnh viện Phụ - Sản Trung ương trực thuộc 
                                        Bộ Y tế, tiếp tục thực hiện những chức năng, nhiệm vụ trước đây với những 
                                        đòi hỏi cao hơn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Functions & Duties */}
                {activeTab === "functions" && (
                    <div className="content-section fade-in">
                        <div className="functions-grid">
                            <div className="function-card">
                                <h3>Chức năng</h3>
                                <ul className="function-list">
                                    <li>Khám bệnh, cấp cứu, chữa bệnh về chuyên ngành phụ khoa, sản khoa, sơ sinh</li>
                                    <li>Đào tạo, tham gia đào tạo, chỉ đạo tuyến và hợp tác quốc tế về chuyên ngành phụ khoa, sản khoa, sơ sinh</li>
                                    <li>Nghiên cứu khoa học, triển khai ứng dụng khoa học, công nghệ, kỹ thuật hiện đại để khám, chữa bệnh và chăm sóc sức khỏe nhân dân</li>
                                </ul>
                            </div>

                            <div className="function-card">
                                <h3>Nhiệm vụ</h3>
                                <ul className="function-list">
                                    <li>Cấp cứu, khám, chữa bệnh về chuyên ngành phụ khoa, sản khoa, sơ sinh</li>
                                    <li>Đào tạo</li>
                                    <li>Nghiên cứu khoa học và phát triển công nghệ</li>
                                    <li>Chỉ đạo tuyến</li>
                                    <li>Hợp tác quốc tế</li>
                                    <li>Quản lý đơn vị</li>
                                </ul>
                            </div>
                        </div>

                        <div className="capacity-section">
                            <h2 className="section-title">Quy mô, năng lực, trang thiết bị</h2>
                            <div className="capacity-grid">
                                <div className="capacity-item">
                                    <div className="capacity-number">1000</div>
                                    <div className="capacity-label">Giường bệnh nội trú</div>
                                </div>
                                <div className="capacity-item">
                                    <div className="capacity-number">09</div>
                                    <div className="capacity-label">Phòng chức năng</div>
                                </div>
                                <div className="capacity-item">
                                    <div className="capacity-number">14</div>
                                    <div className="capacity-label">Khoa lâm sàng</div>
                                </div>
                                <div className="capacity-item">
                                    <div className="capacity-number">09</div>
                                    <div className="capacity-label">Khoa cận lâm sàng</div>
                                </div>
                                <div className="capacity-item">
                                    <div className="capacity-number">07</div>
                                    <div className="capacity-label">Trung tâm</div>
                                </div>
                            </div>
                            <p className="capacity-description">
                                Bệnh viện có hệ thống trang thiết bị phục vụ khám bệnh, chữa bệnh được đầu tư theo 
                                hướng hiện đại, chuyên sâu. Các khoa, phòng, trung tâm được trang bị đầy đủ các hệ 
                                thống máy xét nghiệm sinh hoá, huyết học, miễn dịch... trong đó có nhiều hệ thống 
                                xét nghiệm mới được các quốc gia có nền y học tiên tiến trên thế giới đưa vào sử dụng.
                            </p>
                        </div>
                    </div>
                )}

                {/* Achievements */}
                {activeTab === "achievements" && (
                    <div className="content-section fade-in">
                        <h2 className="section-title">Thành tích đạt được</h2>
                        <div className="achievements-grid">
                            <div className="achievement-card highlight">
                                <div className="achievement-icon">⭐</div>
                                <h3>Anh hùng Lao động</h3>
                                <p>Năm 2010</p>
                            </div>

                            <div className="achievement-card">
                                <div className="achievement-icon">🏅</div>
                                <h3>Huân chương Độc lập hạng Ba</h3>
                                <p>Năm 2008</p>
                            </div>

                            <div className="achievement-card">
                                <div className="achievement-icon">🥇</div>
                                <h3>Huân chương Lao động hạng Nhất</h3>
                                <p>Năm 2002 và 1985</p>
                            </div>

                            <div className="achievement-card">
                                <div className="achievement-icon">🥈</div>
                                <h3>Huân chương Lao động hạng Hai</h3>
                                <p>Năm 1982</p>
                            </div>

                            <div className="achievement-card">
                                <div className="achievement-icon">🥉</div>
                                <h3>Huân chương Lao động hạng Ba</h3>
                                <p>Năm 1976</p>
                            </div>

                            <div className="achievement-card">
                                <div className="achievement-icon">🚩</div>
                                <h3>Cờ Thi đua của Chính phủ</h3>
                                <p>Năm 2019, 2020</p>
                            </div>

                            <div className="achievement-card">
                                <div className="achievement-icon">🚩</div>
                                <h3>Cờ Thi đua của Bộ Y tế</h3>
                                <p>Năm 2013, 2016, 2018</p>
                            </div>

                            <div className="achievement-card">
                                <div className="achievement-icon">📜</div>
                                <h3>Tập thể Lao động xuất sắc</h3>
                                <p>Nhiều năm liên tục</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vision */}
                {activeTab === "vision" && (
                    <div className="content-section fade-in">
                        <h2 className="section-title">Định hướng phát triển</h2>
                        <div className="vision-content">
                            <p className="vision-text">
                                Nhìn lại chặng đường phát triển trong những năm qua, cán bộ viên chức bệnh viện 
                                luôn tự hào trong bất kỳ hoàn cảnh nào những người thầy thuốc bệnh viện Phụ - Sản 
                                Trung ương luôn giữ vững phẩm chất tốt đẹp của người cán bộ y tế, trau dồi y đức, 
                                tận tuỵ phục vụ người bệnh.
                            </p>
                            <p className="vision-text">
                                Dưới sự lãnh đạo của Đảng bộ bệnh viện và sự phấn đấu nỗ lực của tập thể VCNLĐ, 
                                bệnh viện Phụ - Sản Trung ương đã có những tiến bộ vượt bậc. Công tác quản lý của 
                                bệnh viện được hoàn thiện, quyền làm chủ của VCNLĐ, của người bệnh và gia đình người 
                                bệnh được phát huy, nội bộ đoàn kết nhất trí, chất lượng chuyên môn ngày càng được 
                                nâng cao.
                            </p>
                            <div className="vision-goals">
                                <h3>Mục tiêu phát triển</h3>
                                <ul className="goals-list">
                                    <li>Tiếp tục phát huy những thế mạnh của bệnh viện</li>
                                    <li>Đoàn kết dưới sự lãnh đạo của Đảng bộ, Ban Giám đốc và các đoàn thể</li>
                                    <li>Hoàn thành xuất sắc mọi nhiệm vụ được giao</li>
                                    <li>Xây dựng bệnh viện Phụ - Sản Trung ương trở thành địa chỉ khám, chữa bệnh hàng đầu của ngành y tế Việt Nam và quốc tế</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Notice */}
            <div className="about-footer">
                <p className="footer-notice">
                    Đây là sản phẩm phục vụ môn học Kỹ thuật phần mềm ứng dụng - ET3260<br />
                    Đại học Bách khoa Hà Nội<br />
                    Giảng viên hướng dẫn: Th.S Hoàng Quang Huy
                </p>
                <p className="team-info">
                    <strong>Nhóm 03:</strong><br />
                    03. Nguyễn Thế Anh - 20223752<br />
                    13. Đặng Duy Đạt - 2023<br />
                    45. Trần Đức Mạnh - 2022
                </p>
            </div>
        </div>
    );
}
