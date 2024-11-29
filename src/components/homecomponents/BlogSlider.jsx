import React, { useEffect, useState } from 'react'; 
import Slider from 'react-slick'; // Import Slider từ react-slick
import axios from 'axios'; // Import axios để gọi API
import './BlogSlider.css';

function BlogSlider() {
  const [blogs, setBlogs] = useState([]); // Khởi tạo state cho danh sách blog
  const [loading, setLoading] = useState(true); // Để hiển thị loading

  useEffect(() => {
    // Gọi API để lấy dữ liệu blog
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/identity/blog/');
        setBlogs(response.data); // Cập nhật state với dữ liệu blog nhận được
        setLoading(false); // Tắt loading sau khi dữ liệu được tải xong
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu blog:", error);
        setLoading(false); // Tắt loading ngay cả khi gặp lỗi
      }
    };

    fetchBlogs(); // Gọi hàm để lấy dữ liệu
  }, []);

  const settings = {
    dots: false,           // Hiển thị các chấm điều hướng dưới slider
    infinite: true,        // Lặp lại vô hạn
    speed: 500,            // Tốc độ chuyển ảnh
    slidesToShow: 3,       // Hiển thị 3 bài blog cùng lúc
    slidesToScroll: 1,     // Di chuyển từng bài một
    autoplay: true,        // Tự động chuyển bài blog
    autoplaySpeed: 3000,   // Thời gian mỗi lần tự động chuyển
    rtl: false,            // Chuyển từ phải sang trái
    responsive: [
      {
        breakpoint: 768, // Khi màn hình nhỏ hơn 768px
        settings: {
          slidesToShow: 1,  // Chỉ hiện 1 bài blog trên màn hình nhỏ
        },
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi dữ liệu đang được tải
  }

  return (
    <div className="about-blog">
      <h2 className='blog-title'>Từ Blog Của Chúng Tôi</h2>
      <Slider {...settings}>
        {blogs.map((blog) => (
          <div key={blog.blogID} className="blog-card">
            {/* Thêm hình ảnh nếu có */}
            {/* <img src={blog.imageUrl} alt={blog.blogName} /> */}
            <h3>{blog.blogName}</h3>
            <a href='/blog-page'>
              <button className='button-blog'>Đọc Thêm</button>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default BlogSlider;
