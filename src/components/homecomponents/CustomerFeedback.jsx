// src/components/CustomerFeedback.js
import React from 'react';
import { Typography, Grid2, Card, CardContent, CardMedia, Rating, Box } from '@mui/material';
import './CustomerFeedback.css'; // Import the CSS file

const feedbackData = [
  {
    name: 'Trần Linh',
    rating: 5,
    comment: 'Hoa rất tươi, hương thơm dễ chịu, giao hàng nhanh, giá cả hợp lý.',
    image: 'path_to_flower_image_1.jpg',
    product: 'Bó hoa Tulip mix'
  },
  {
    name: 'Nguyên An',
    rating: 5,
    comment: 'Hoa được gói rất đẹp và cẩn thận, nhân viên chu đáo và nhiệt tình.',
    image: 'path_to_flower_image_2.jpg',
    product: 'Giỏ hoa Hồng Đỏ'
  },
  {
    name: 'Tuấn Trần',
    rating: 5,
    comment: 'Giao hàng rất nhanh, hoa vẫn tươi khi nhận, rất hài lòng.',
    image: 'path_to_flower_image_3.jpg',
    product: 'Bó hoa Ly Ly'
  }
];

const CustomerFeedback = () => {
  return (
    <Box className="feedback-section">
      <Typography variant="h4" gutterBottom>
        Khách hàng đã nói gì
      </Typography>

      <Grid2 container spacing={4} className="feedback-grid">
        {feedbackData.map((feedback, index) => (
          <Grid2 item xs={12} md={4} key={index} className="feedback-card">
            <Card>
              <CardContent>
                <Typography variant="h6" className="customer-name">
                  {feedback.name}
                </Typography>

                <Rating value={feedback.rating} readOnly className="rating" />
                <Typography variant="body2" color="textSecondary" className="customer-comment">
                  {feedback.comment}
                </Typography>
              </CardContent>

              <CardMedia
                component="img"
                height="140"
                image={feedback.image}
                alt={feedback.product}
              />

              <CardContent>
                <Typography variant="body1" className="customer-product">
                  {feedback.product}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default CustomerFeedback;
