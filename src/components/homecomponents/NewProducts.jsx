// src/homecomponents/NewProducts.js
import React, { useEffect, useState } from 'react';
import './NewProducts.css';

function NewProducts() {
  const [mostPurchasedFlowers, setMostPurchasedFlowers] = useState([]);

  useEffect(() => {
    // Fetch data from API
    fetch('http://localhost:8080/identity/flower/most-purchased')
      .then((response) => response.json())
      .then((data) => {
        // Store flower details, including flowerID, in state
        const flowers = data.map(item => ({
          flowerName: item.flowerBatch.flowerName,
          flowerID: item.flowerBatch.flowerID,
        }));
        setMostPurchasedFlowers(flowers);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="newProducts">
      <h2>Các loại hoa được tìm kiếm nhiều nhất</h2>
      <div className="productContainer">
        {mostPurchasedFlowers.map((flower, index) => (
          <div className="productItem" key={index}>
            <img
              src={`http://localhost:8080/identity/flowerImg/batch/${flower.flowerID}/image`}
              alt={flower.flowerName}
            />
            <p>{flower.flowerName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewProducts;
