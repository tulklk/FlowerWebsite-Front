// src/homecomponents/Services.js
import React from 'react';
import './Services.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function Services() {
    return (
      <div className="services">
        <div className="service">
          <i className="fas fa-truck"></i> {/* Icon for delivery */}
          <h3>Giao Hoa Miễn Phí</h3>
          <p>Miễn phí các đơn giao nội thành</p>
        </div>
        <div className="service">
          <i className="fas fa-camera-retro"></i> {/* Icon for taking photos */}
          <h3>Chụp Hình Trước & Sau Khi Giao</h3>
          <p>Chụp hình hoàn thiện trước và sau khi giao</p>
        </div>
        <div className="service">
          <i className="fas fa-award"></i> {/* Icon for commitment and quality */}
          <h3>Cam Kết & Chất Lượng</h3>
          <p>Hoa đẹp và giống hình 90% so với mẫu</p>
        </div>
      </div>
    );
  }
  
  export default Services;
