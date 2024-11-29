import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Menu.css";
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import b1 from '../assets/banner-post.png';
import dayjs from 'dayjs'; // if using dayjs to manage various formats
// import Navbar from "../components/Navbar.jsx";

function Menu() {
  const [flowerList, setFlowerList] = useState([]); 
  const [category, setCategory] = useState("Tất cả hoa"); 
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true); 
  const [filteredFlowers, setFilteredFlowers] = useState([]); 
  const [priceFilter, setPriceFilter] = useState(""); 
  const [sortOrder, setSortOrder] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [flowersPerPage] = useState(16); 
  const postCardRef = useRef([]); 
  const [showPopup, setShowPopup] = useState(false); 
  const [popupMessage, setPopupMessage] = useState('');


  // Lấy danh sách hoa khi component được tải
  useEffect(() => {
    fetchFlowerList();
    fetchCategoryList();
  }, []);

  // Lấy dữ liệu từ API Spring Boot
  const fetchFlowerList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/identity/posts/visible-postings");
      const flowersWithImages = response.data.map(flower => ({
        ...flower,
        imageURL: `http://localhost:8080/identity/img/${flower.postID}` // Tạo URL ảnh từ postID
      }));
      setFlowerList(flowersWithImages); // Lưu danh sách hoa kèm URL ảnh
      setFilteredFlowers(flowersWithImages); // Khởi tạo danh sách đã lọc
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu: ", error);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/identity/category/");
      setCategoryList(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu danh mục: ", error);
    }
  };

  // Lọc bài post theo danh mục sự kiện hoặc tên hoa
  const filterByCategory = (eventName) => {
    if (eventName === "Tất cả bài post") {
      setFilteredFlowers(flowerList);
    } else {
      // Lọc bài post chứa loại hoa được chọn
      const filtered = flowerList.filter(flower =>
        flower.flowerBatches.some(batch => batch.category?.eventName === eventName)
      );
      setFilteredFlowers(filtered);
    }
    setCategory(eventName);
  };

  // Lọc bài post theo tên hoa (khi nhấn vào tên hoa)
  const filterByFlowerName = (flowerName) => {
    const filtered = flowerList.filter(flower =>
      flower.flowerBatches.some(batch => batch.flowerName === flowerName)
    );
    setFilteredFlowers(filtered);  // Hiển thị các bài post chứa hoa được chọn
  };

  // Xử lý khi nhấn vào bài viết khi bài viết hết hạn
  const handlePostClick = (flower) => {
    if (dayjs(flower.expiryDate).isValid() && dayjs(flower.expiryDate).isBefore(dayjs())) {
      // alert("Bài sự kiện đã hết hạn"); 
      setPopupMessage("Bài sự kiện đã hết hạn !");
      setShowPopup(true);
    } else {
      navigate(`/flower/${flower.postID}`);
    }
  };



  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Mô phỏng độ trễ khi tải
    return () => clearTimeout(timer);
  }, []);

  // Logic lọc theo khoảng giá
  const filterByPrice = (value) => {
    setPriceFilter(value); // Thiết lập khoảng giá đã chọn

    let filtered = [...flowerList];
    if (value === "<100k") {
      filtered = filtered.filter((flower) => flower.price < 100000);
    } else if (value === "100k-500k") {
      filtered = filtered.filter((flower) => flower.price >= 100000 && flower.price <= 500000);
    } else if (value === ">500k") {
      filtered = filtered.filter((flower) => flower.price > 500000);
    }

    // Áp dụng sắp xếp nếu đã chọn thứ tự sắp xếp
    if (sortOrder) {
      filtered = sortFlowers(filtered, sortOrder);
    }

    setFilteredFlowers(filtered);
  };

  // Logic sắp xếp theo giá tăng dần hoặc giảm dần
  const sortFlowers = (flowers, order) => {
    if (order === "asc") {
      return flowers.sort((a, b) => a.price - b.price);
    } else if (order === "desc") {
      return flowers.sort((a, b) => b.price - a.price);
    }
    return flowers;
  };

  // Xử lý sắp xếp theo giá
  const handleSortChange = (value) => {
    setSortOrder(value); // Thiết lập thứ tự sắp xếp đã chọn

    let sortedFlowers = sortFlowers([...filteredFlowers], value);
    setFilteredFlowers(sortedFlowers);
  };

  // Logic phân trang
  const indexOfLastFlower = currentPage * flowersPerPage;
  const indexOfFirstFlower = indexOfLastFlower - flowersPerPage;
  const currentFlowers = filteredFlowers.slice(indexOfFirstFlower, indexOfLastFlower);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý nút trước và sau
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredFlowers.length / flowersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Intersection Observer API để xử lý các hiệu ứng cuộn
  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  };

  const observer = new IntersectionObserver(callback, {
    threshold: 0.1 // Kích hoạt khi 10% của phần tử được nhìn thấy
  });

  useEffect(() => {
    const currentPosts = postCardRef.current;
    currentPosts.forEach(post => {
      if (post) observer.observe(post);
    });

    // Dọn dẹp observer khi component bị hủy
    return () => {
      currentPosts.forEach(post => {
        if (post) observer.unobserve(post);
      });
    };
  },);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Tạo số trang dựa trên độ dài của danh sách hoa đã lọc
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredFlowers.length / flowersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    // <div><Navbar/>
    <div className="shop-container">

      <div className="sidebar-post-exchange">
        <h3 className="sidebar-title">Danh mục hoa</h3>
        <hr className="sidebar-divider" />
        <ul className="category-list">
          {/* Mục hiển thị tất cả bài post */}
          <li onClick={() => filterByCategory("Tất cả bài post")}>
            <span>Tất cả bài post</span>
          </li>

          {categoryList
            .filter((category) => category.eventName && category.eventName !== "Không") // Lọc các danh mục có eventName và không phải "Không"
            .map((category, index) => (
              <li key={index} onClick={() => filterByCategory(category.eventName)}>
                <span>{category.eventName}</span>
              </li>
            ))}


          {/* Hiển thị danh sách tên các loài hoa duy nhất */}
          <h3 className="sidebar-title">Tên hoa</h3>
          <hr className="sidebar-divider" />
          <ul className="flower-list">
            {[...new Set(flowerList
              .flatMap(flower => flower.flowerBatches.map(batch => batch.flowerName)))] // Lấy tất cả tên hoa từ các flowerBatches
              .filter(flowerName => flowerName)  // Bỏ qua tên hoa rỗng hoặc không xác định
              .map((flowerName, index) => (
                <li key={index} onClick={() => filterByFlowerName(flowerName)}>
                  <span>{flowerName}</span>
                </li>
              ))}
          </ul>
        </ul>
      </div>

      {/* Nội dung chính */}
      <div className="main-content">
        <img src={b1} alt="" className="banner-post" />
        <div className="breadcrumb">
          <Link to="/" className="home-link-breadcrumb">Trang chủ</Link>
          <span> / </span>
          <span>Posting / {category}</span>
        </div>

        {/* Bộ lọc và sắp xếp */}
        <div className="filter-sort-bar">
          <select
            className="filter-dropdown"
            value={priceFilter}
            onChange={(e) => filterByPrice(e.target.value)}
          >
            <option value="">Lọc theo giá</option>
            <option value="<100k">Dưới 100k</option>
            <option value="100k-500k">100k - 500k</option>
            <option value=">500k">Trên 500k</option>
          </select>

          <select
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sắp xếp</option>
            <option value="asc">Giá: Thấp đến Cao</option>
            <option value="desc">Giá: Cao đến Thấp</option>
          </select>
        </div>

        <div className="post-grid">
          {currentFlowers.map((flower, index) => (
            <div
              className="post-card scroll-appear"
              key={index}
              ref={(el) => (postCardRef.current[index] = el)}
              onClick={() => handlePostClick(flower)} // Pass the flower object
            >
              <img src={flower.imageURL} alt={flower.title} className="post-card-image" />
              <h3>{flower.title}</h3>
              <p className="discount-price">Giá dự kiến: {flower.price.toLocaleString()} VNĐ</p>
              <p>
                {flower.flowerBatches[0]?.category?.eventName === "Không"
                  ? "Bán hoa theo lô"
                  : flower.flowerBatches[0]?.category?.eventName || "Bán theo lô"}
              </p>

              <p className="feature-content">{flower.description}</p>
              <p className="e-date">
                Ngày sự kiện kết thúc : {dayjs(flower.expiryDate).isValid() ? dayjs(flower.expiryDate).format('DD/MM/YYYY') : 'Không xác định'}
              </p>

              <button className="feature-detail-button">Xem chi tiết</button>
            </div>
          ))}
        </div>
        {/* Phân trang */}
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-arrow"
          >
            &laquo;
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={number === currentPage ? "active" : ""}
            >
              {number}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredFlowers.length / flowersPerPage)}
            className="pagination-arrow"
          >
            &raquo;
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">❌</div>
            <h2>Thông báo</h2>
            <p className="popup-message">{popupMessage}</p>
            <button
              className="close-button-popup"
              onClick={() => {
                setShowPopup(false); // Close the popup
              }}>
              Đóng
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
    // </div>
  );
}

export default Menu;
