import React from "react";
import "./QandA.css";

const articles = [
    {
        id: 1,
        title: "Phụ nữ có thai nên ăn gì để phòng tránh bệnh cúm?",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
    },
    {
        id: 2,
        title: "3 Giai đoạn dinh dưỡng cho bà bầu trong 9 tháng thai kì: Nên ăn gì? kiêng gì?",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop"
    },
    {
        id: 3,
        title: "Dấu hiệu nhận biết và cách phòng ngừa bệnh tiểu đường thai kỳ",
        image: "https://www.docosan.com/blog/wp-content/uploads/2025/01/dau-hieu-dai-thao-duong-thai-ky-12.jpg"
    },
    {
        id: 4,
        title: "Chế độ tập luyện an toàn cho phụ nữ mang thai",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
    },
    {
        id: 5,
        title: "Những điều cần biết về siêu âm thai nhi",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop"
    },
    {
        id: 6,
        title: "Chăm sóc sức khỏe tinh thần trong thai kỳ",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop"
    }
];

function QandA() {
    return (
        <div className="qanda-container">
            <div className="qanda-header">
                <h1>GIẢI ĐÁP Y HỌC</h1>
                <p className="qanda-subtitle">Những thông tin hữu ích về sức khỏe phụ nữ và thai kỳ</p>
            </div>
            <div className="articles-grid">
                {articles.map((article) => (
                    <article key={article.id} className="article-card">
                        <div className="article-image-wrapper">
                            <img 
                                src={article.image} 
                                alt={article.title}
                                className="article-image"
                                loading="lazy"
                            />
                        </div>
                        <div className="article-content">
                            <h2 className="article-title">{article.title}</h2>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default QandA;