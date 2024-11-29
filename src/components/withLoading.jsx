import React, { useState, useEffect } from 'react';

const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Giả lập trạng thái loading với một timeout
      const timer = setTimeout(() => {
        setLoading(false); // Sau 2 giây, dừng hiển thị loading
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer khi component unmount
    }, []);

    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải dữ liệu...</p>
        </div>
      );
    }

    // Sau khi hết loading, hiển thị component chính
    return <WrappedComponent {...props} />;
  };
};

export default withLoading;
