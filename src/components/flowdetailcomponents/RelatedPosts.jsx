import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RelatedPosts.css";

function RelatedPosts({ currentProductId }) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentProductId]);

  const getRandomPosts = (posts, numberOfPosts) => {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfPosts);
  };

  const handlePostClick = (id) => {
    navigate(`/flower/${id}`);
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/identity/posts/");
      const filteredPosts = response.data
        .filter(flower => flower.postID !== currentProductId)
        .map(flower => ({
          ...flower,
          imageURL: `http://localhost:8080/identity/img/${flower.postID}`
        }));

      const randomPosts = getRandomPosts(filteredPosts, 4);
      setRelatedPosts(randomPosts);
      setLoading(false);
    } catch (error) {
      setError("Failed to load related products. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải các sản phẩm liên quan...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="related-section">
      <h3>Các bài post khác</h3>
      <div className="related-post-grid">
        {relatedPosts.map((item, index) => (
          <div
            className="related-post-card"
            key={index}
            onClick={() => handlePostClick(item.postID)}
          >
            <img
              src={item.imageURL}
              alt={item.title}
              className="related-post-image"
            />
            <h3 className="related-post-title">{item.title}</h3>
            <p className="related-post-price">Giá: {item.price.toLocaleString()} VNĐ</p>
            <p className="related-post-description">{item.description}</p>
            <p className="related-post-detail">Xem chi tiết</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedPosts;
