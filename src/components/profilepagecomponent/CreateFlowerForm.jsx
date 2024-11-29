import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateFlowerForm = ({ postID }) => {
  const [flowers, setFlowers] = useState([
    {
      flowerType: 'Hoa bán theo lô',
      flowerName: '',
      quantity: '',
      status: 'Còn hàng',
      description: '',
      price: '',
      saleType: 'batch',
      eventType: 'Không',
      eventName: 'Không',
      eventFlowerPosting: {
        postID: postID,
      },
      category: {
        categoryID: '',
      },
    },
  ]);
  const [flowerIDs, setFlowerIDs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Điều khiển hiển thị pop-up
  const [popupMessage, setPopupMessage] = useState(''); // Thông điệp hiển thị trong pop-up
 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/identity/category/');

        // Filter for unique "Hoa bán theo lô" and "Hoa sự kiện" types only
        const uniqueCategories = response.data.filter((category, index, self) =>
          ["Hoa bán theo lô", "Hoa Sự Kiện"].includes(category.flowerType) &&
          index === self.findIndex(c => c.flowerType === category.flowerType)
        );

        // Set filtered categories and unique event names for selection
        setCategories(uniqueCategories);
        const events = response.data
          .filter(category => category.eventType === "Có")
          .map(category => category.eventName);
        setEventOptions([...new Set(events)]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleFlowerChange = (index, e) => {
    const { name, value } = e.target;
    const newFlowers = [...flowers];

    if (name === 'flowerType') {
      newFlowers[index] = {
        ...newFlowers[index],
        flowerType: value,
        eventType: 'Không', 
        eventName: 'Không',
      };
    } else if (name === 'categoryID') {
      newFlowers[index] = {
        ...newFlowers[index],
        category: {
          ...newFlowers[index].category,
          categoryID: value,
        },
      };
    } else {
      newFlowers[index] = {
        ...newFlowers[index],
        [name]: value,
      };
    }

    setFlowers(newFlowers);
  };


  const addFlower = () => {
    setFlowers([
      ...flowers,
      {
        flowerType: 'Hoa bán theo lô',
        flowerName: '',
        quantity: '',
        status: 'Còn hàng',
        description: '',
        price: '',
        saleType: 'batch',
        eventType: 'Không',
        eventName: 'Không',
        eventFlowerPosting: {
          postID: postID,
        },
        category: {
          categoryID: '',
        },
      },
    ]);
  };

  const removeFlower = (index) => {
    const newFlowers = flowers.filter((_, i) => i !== index);
    setFlowers(newFlowers);
    setFlowerIDs(flowerIDs.filter((_, i) => i !== index));
  };

  const openConfirmationModal = () => {
    setConfirmModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    openConfirmationModal();
  };

  const confirmSubmit = async () => {
    setConfirmModalVisible(false);
    try {
      const response = await axios.post('http://localhost:8080/identity/flower/', flowers);
      const createdFlowerIDs = response.data.map(flower => flower.flowerID);
      setFlowerIDs(createdFlowerIDs);
      setPopupMessage("Bạn đã tạo hoa thành công. Vui lòng thêm ảnh !");
      setShowPopup(true); 
      setError('');
    } catch (error) {
      console.error('Error creating flowers:', error);
      setError('Không thể tạo loại hoa. Vui lòng thử lại.');
      setSuccessMessage('');
    }
  };

  const cancelSubmit = () => {
    setConfirmModalVisible(false);
  };

  const handleImageUpload = async (flowerID, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:8080/identity/flowerImg/batch/${flowerID}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPopupMessage("Bạn đã thêm ảnh vào hoa thành công!");
      setShowPopup(true);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="create-flower-form">
      <h2>Thêm Các Loại Hoa Mới</h2>
      <form onSubmit={handleSubmit}>
        {flowers.map((flower, index) => (
          <div key={index} className="flower-form-group">
            <label>
              Tên hoa:
              <input
                type="text"
                name="flowerName"
                value={flower.flowerName}
                onChange={(e) => handleFlowerChange(index, e)}
                required
              />
            </label>

            <label>
              Số lượng:
              <input
                type="number"
                name="quantity"
                value={flower.quantity}
                onChange={(e) => handleFlowerChange(index, e)}
                required
              />
            </label>

            <label>
              Mô tả:
              <textarea
                name="description"
                value={flower.description}
                onChange={(e) => handleFlowerChange(index, e)}
                required
              />
            </label>

            <label>
              Giá:
              <input
                type="number"
                name="price"
                value={flower.price}
                onChange={(e) => handleFlowerChange(index, e)}
                required
              />
            </label>

            <label>
              Chọn loại hoa:
              <select
                name="categoryID"
                value={flower.category.categoryID}
                onChange={(e) => handleFlowerChange(index, e)}
                required
              >
                <option value="">Chọn loại hoa</option>
                {categories.map((category) => (
                  <option key={category.categoryID} value={category.categoryID}>
                    {category.flowerType}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Có sự kiện hay không:
              <select
                name="eventType"
                value={flower.eventType}
                onChange={(e) => handleFlowerChange(index, e)}
              >
                <option value="Không">Không</option>
                <option value="Có">Có</option>
              </select>
            </label>

            {flower.eventType === 'Có' && (
              <label>
                Tên sự kiện:
                <select
                  name="eventName"
                  value={flower.eventName}
                  onChange={(e) => handleFlowerChange(index, e)}
                  required
                >
                  <option value="">Chọn sự kiện</option>
                  {eventOptions.map((eventName, i) => (
                    <option key={i} value={eventName}>
                      {eventName}
                    </option>
                  ))}
                </select>
              </label>
            )}


            {flowerIDs[index] && (
              <div>
                <label>Thêm ảnh cho hoa :</label>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(flowerIDs[index], e.target.files[0])}
                />
              </div>
            )}

            {flowers.length > 1 && (
              <button type="button" onClick={() => removeFlower(index)}>
                Xóa Loại Hoa
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addFlower}>
          Thêm Loại Hoa Khác
        </button>

        <button type="submit">Tạo hoa</button>
        {error && <p className="error-message-post">{error}</p>}
        {successMessage && <p className="success-message-post">{successMessage}</p>}
      </form>

      {isConfirmModalVisible && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>Bạn có chắc chắn muốn tạo loại hoa này không?</p>
            <div className="confirm-modal-buttons">
              <button onClick={confirmSubmit} className="confirm-btn">Xác nhận</button>
              <button onClick={cancelSubmit} className="cancel-btn">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">✅</div>
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

    </div>
  );
};

export default CreateFlowerForm;
