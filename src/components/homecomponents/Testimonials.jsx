import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./Testimonials.css";

function Testimonials() {  
  const [testimonials, setTestimonialsState] = useState([]);

  // Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("http://localhost:8080/identity/api/feedback/all");
      const data = await response.json();
      setTestimonialsState(data); 
    } catch (error) {
      console.error("Lỗi khi tải phản hồi:", error);
      setTestimonialsState([]);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
//hàm tính theo số đánh giá sẽ hiện ra số số
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="about-testimonials">
      <h2>Khách hàng nói gì</h2>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-slide" key={index}>
            <p>"{testimonial.comment}"</p>  
            <h3>{testimonial.user?.username || "Ẩn danh"}</h3> 
            <h3>{renderStars(testimonial.rating)}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Testimonials;
