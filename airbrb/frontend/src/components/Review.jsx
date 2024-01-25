import React from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

export const Review = ({ score, comments }) => {
  return (
    <>
      <Rating value={score} readOnly />
      <Typography variant="body2" color="text.primary">
        Comments: {comments}
      </Typography>
    </>
  )
};
