// src/components/CustomerReviews.js
import React from 'react';

const reviews = [
  { id: 1, name: 'Alice', review: 'The flowers were fresh and beautiful!', rating: 5 },
  { id: 2, name: 'Bob', review: 'Great service and timely delivery.', rating: 4 },
  { id: 3, name: 'Catherine', review: 'Highly recommend their roses!', rating: 5 },
];

const CustomerReviews = () => {
  return (
    <div className="customer-reviews">
      <h2>Customer Reviews</h2>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <h3>{review.name}</h3>
            <p>{review.review}</p>
            <p>Rating: {'★'.repeat(review.rating)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
