import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export const Block = ({ title, street, city, state, price, numOfBed, numOfBath }) => {
  return (
    <>
      <Card>
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {street}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {city}, {state}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        ${price} per night
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {numOfBed} Bedrooms & {numOfBath} Bathrooms
        </Typography>
        </CardContent>
      </Card>
    </>
  )
}
