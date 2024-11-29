import React, { useState } from 'react';
import axios from 'axios';
import CreateFlowerForm from './CreateFlowerForm';
import './CreatePos.css';

const CreatePostComponent = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [post, setPost] = useState({
    title: '',
    description: '',
    price: '',
    expiryDate: '',
    user: {
      userID: user ? user.userID : '',
    },
  });

  const [postID, setPostID] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Open confirmation modal
  const openConfirmationModal = () => {
    setConfirmModalVisible(true);
  };

  // Handle form submission when the user confirms
  const confirmSubmit = async () => {
    setConfirmModalVisible(false);
    try {
      const date = new Date(post.expiryDate);
      date.setUTCHours(0, 0, 0, 0);
      const expiryDateMidnight = date.toISOString();

      const formattedPost = {
        ...post,
        expiryDate: expiryDateMidnight,
      };

      const response = await axios.post('http://localhost:8080/identity/posts/', formattedPost);
      const createdPostID = response.data.postID;
      setPostID(createdPostID);

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        await axios.post(`http://localhost:8080/identity/img/${createdPostID}`, formData);
        setSuccessMessage('Đã tạo bài đăng thành công');
      } else {
        setSuccessMessage('Đã tạo bài đăng thành công!');
      }

      setError('');
    } catch (error) {
      console.error('Error creating post or uploading image:', error);
      setError('Không thể tạo bài đăng hoặc upload ảnh. Vui lòng thử lại.');
      setSuccessMessage('');
    }
  };

  // Handle submit button click to open the confirmation modal
  const handleSubmit = (e) => {
    e.preventDefault();
    openConfirmationModal();
  };

  return (
    <div className="create-post-component">
      <h2>Tạo Bài Đăng Mới</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Tiêu đề:
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mô tả:
          <textarea
            name="description"
            value={post.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Giá dự kiến:
          <input
            type="number"
            name="price"
            value={post.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Ngày hết hạn:
          <input
            type="date"
            name="expiryDate"
            value={post.expiryDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Chọn ảnh:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>

        <button type="submit">Tạo Bài Đăng</button>
        {error && <p className="error-message-post">{error}</p>}
        {successMessage && <p className="success-message-post">{successMessage}</p>}
      </form>

      {/* Show form to add flowers if the post is successfully created */}
      {postID && <CreateFlowerForm postID={postID} />}

      {/* Confirmation Modal */}
      {isConfirmModalVisible && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>Bạn có chắc chắn muốn tạo bài viết này không?</p>
            <div className="confirm-modal-buttons">
              <button onClick={confirmSubmit} className="confirm-btn">Có</button>
              <button onClick={() => setConfirmModalVisible(false)} className="cancel-btn">Không</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostComponent;
