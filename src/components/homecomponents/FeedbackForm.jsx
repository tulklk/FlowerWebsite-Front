// src/components/FeedbackForm.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Rating, Grid2, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const FeedbackForm = ({ userID, sellerID, submitFeedback }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === '') {
      setError('Please provide a rating and a comment.');
      return;
    }

    const feedbackData = {
      userID,
      sellerID,
      comment,
      rating,
      createdAt: new Date(),
    };

    submitFeedback(feedbackData);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 'auto', boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Leave Feedback
      </Typography>

      <Grid2 container spacing={2}>
        {/* Rating */}
        <Grid2 item xs={12}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
              setError('');
            }}
            size="large"
          />
        </Grid2>

        {/* Comment */}
        <Grid2 item xs={12}>
          <TextField
            label="Comment"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Grid2>

        {/* Submit Button */}
        <Grid2 item xs={12}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSubmit}
            fullWidth
          >
            Submit Feedback
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default FeedbackForm;
