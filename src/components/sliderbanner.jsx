import { useState, useEffect } from "react";
import "../banner.css";

const slides = [
  {
    title: "Thông báo quan trọng",
    desc: "Những cập nhật mới nhất từ bệnh viện.",
    link: "/tin-tuc"
  },
  {
    title: "Nghiên cứu khoa học",
    desc: "Các đề tài và công bố nổi bật.",
    link: "/nghien-cuu"
  },
  {
    title: "Quy trình khám bệnh",
    desc: "Hướng dẫn từng bước cho bệnh nhân.",
    link: "/quy-trinh"
  }
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);

  // tự động chuyển slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 5000); // 5 giây
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((index + 1) % slides.length);
  const prev = () =>
    setIndex((index - 1 + slides.length) % slides.length);

  return (
    <div className="banner">
      <div className="banner-content">
        <h2>{slides[index].title}</h2>
        <p>{slides[index].desc}</p>

        <a className="banner-btn" href={slides[index].link}>
          Xem chi tiết
        </a>
      </div>

      <button className="nav-btn left" onClick={prev}>‹</button>
      <button className="nav-btn right" onClick={next}>›</button>

      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
