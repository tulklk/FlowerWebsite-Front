import React from 'react';
// import './BlogCard.css';

const BlogCard = ({ title, description, content }) => {
  return (
    <div className="blog">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={() => alert(content)} className="button-blog">Đọc Thêm</button>
    </div>
  );
};

export default BlogCard;
