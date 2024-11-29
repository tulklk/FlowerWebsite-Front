import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagePosts.css';

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedFlower, setSelectedFlower] = useState(null); // State for selected flower
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserID(parsedUser.userID);
    }
  }, []);

  useEffect(() => {
    if (userID) {
      fetchPosts();
    }
  }, [userID]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/identity/posts/api/${userID}`);
      setPosts(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading posts:', error);
      setLoading(false);
    }
  };
//  Xóa bposst

  const deletePost = async (postID) => {
    try {
      await axios.delete(`http://localhost:8080/identity/posts/${postID}`);
      setPosts(posts.filter(post => post.postID !== postID));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const toggleHidePost = async (postID, isHidden) => {
    if (isHidden) return; // Prevent toggling if the post is already hidden
    try {
      await axios.put(`http://localhost:8080/identity/posts/${postID}/hide`);
      const updatedPosts = posts.map(post =>
        post.postID === postID ? { ...post, isHidden: true } : post
      );
      setPosts(updatedPosts);
      localStorage.setItem('posts', JSON.stringify(updatedPosts)); // Save updated visibility to localStorage
    } catch (error) {
      console.error('Error toggling post visibility:', error);
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
  };

  const handleSavePost = async () => {
    try {
      await axios.put(`http://localhost:8080/identity/posts/${selectedPost.postID}`, selectedPost);
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleEditFlower = (flower) => {
    setSelectedFlower(flower);
  };

  const handleSaveFlower = async () => {
    try {
      await axios.put(`http://localhost:8080/identity/flower/${selectedFlower.flowerID}`, selectedFlower);
      setSelectedFlower(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving flower:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, [name]: value });
    }
    if (selectedFlower) {
      setSelectedFlower({ ...selectedFlower, [name]: value });
    }
  };

  const closeEditForm = () => {
    setSelectedPost(null);
    setSelectedFlower(null);
  };

  return (
    <div className="manage-posts">
      <h2>Quản lý bài post của tôi</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.postID} className="post-container">
                <div className="post-item">
                  <h3 className="manage-post-title">Tiêu đề : {post.title}</h3>
                  <p>Mô tả : {post.description}</p> <h3></h3>
                  <p>Giá : {post.price} VNĐ</p>

                  <div className="post-actions">
                    <button onClick={() => deletePost(post.postID)}>Xóa bài post</button>
                    <button onClick={() => handleEditPost(post)}>Sửa bài post</button>
                    <button
                      onClick={() => toggleHidePost(post.postID, post.isHidden)}
                      disabled={post.isHidden}
                    >
                      {post.isHidden ? 'Đã ẩn' : 'Ẩn bài post'}
                    </button>
                  </div>
                </div>

                <div className="flower-posts-table-container">
                  <h4>Các loại hoa trong bài viết:</h4>
                  {post.flowerBatches.length > 0 ? (
                    <table className="flower-posts-table">
                      <thead>
                        <tr>
                          <th className="flower-posts-header">Tên hoa</th>
                          <th className="flower-posts-header">Số lượng</th>
                          <th className="flower-posts-header">Giá (VNĐ)</th>
                          <th className="flower-posts-header">Mô tả</th>
                          <th className="flower-posts-header">Sự kiện</th>
                          <th className="flower-posts-header">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {post.flowerBatches.map((flower) => (
                          <tr key={flower.flowerID} className="flower-posts-row">
                            <td className="flower-posts-cell">{flower.flowerName}</td>
                            <td className="flower-posts-cell">{flower.quantity}</td>
                            <td className="flower-posts-cell">{flower.price}</td>
                            <td className="flower-posts-cell">{flower.description}</td>
                            <td className="flower-posts-cell">{flower.category.eventName}</td>
                            <td className="flower-posts-cell">
                              <button className='edit-flower-button' onClick={() => handleEditFlower(flower)}>Sửa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Không có hoa nào trong bài viết.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Không có bài post nào.</p>
          )}
        </>
      )}

      {/* Edit Post Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={closeEditForm}>
          <div className="edit-post-form" onClick={(e) => e.stopPropagation()}>
            <h3>Chỉnh sửa bài post</h3>
            Tiêu đề :
            <input
              type="text"
              name="title"
              value={selectedPost.title}
              onChange={handleChange}
              placeholder="Tiêu đề"
            />
            Nội dung : 
            <textarea
              name="description"
              value={selectedPost.description}
              onChange={handleChange}
              placeholder="Nội dung"
            />
            Giá dự kiến : 
            <input
              type="number"
              name="price"
              value={selectedPost.price}
              onChange={handleChange}
              placeholder="Giá"
            />
            <button className="save-button" onClick={handleSavePost}>Lưu</button>
            <button onClick={closeEditForm}>Đóng</button>
          </div>
        </div>
      )}

      {/* Edit Flower Modal */}
      {selectedFlower && (
        <div className="modal-overlay" onClick={closeEditForm}>
          <div className="edit-post-form" onClick={(e) => e.stopPropagation()}>
            <h3>Chỉnh sửa hoa</h3>
            Loại hoa :
            <input
              type="text"
              name="flowerName"
              value={selectedFlower.flowerName}
              onChange={handleChange}
              placeholder="Tên hoa"
            />
            Số lượng :
            <input
              type="number"
              name="quantity"
              value={selectedFlower.quantity}
              onChange={handleChange}
              placeholder="Số lượng"
            />
            Giá : 
            <input
              type="number"
              name="price"
              value={selectedFlower.price}
              onChange={handleChange}
              placeholder="Giá"
            />
            Mô tả : 
            <textarea
              name="description"
              value={selectedFlower.description}
              onChange={handleChange}
              placeholder="Mô tả"
            />
            <button className="save-button" onClick={handleSaveFlower}>Lưu</button>
            <button onClick={closeEditForm}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePosts;
