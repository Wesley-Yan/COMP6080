
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const OtherListings = (props) => {
  const info = props.info.listing;
  const isSearchDate = props.searchDate;
  const numOfDays = props.numOfDays;
  const navigate = useNavigate();

  return (
    <div>
      <Card sx={{ maxWidth: 345 }} >
      <CardMedia
          sx={{ height: 140 }}
          image={info.thumbnail}
          title="green iguana"
          onClick={() => navigate('/listings/view/' + String(info.id), { state: { info, token: props.token, isSearchDate, numOfDays } })}
      />
      <CardContent onClick={() => navigate('/listings/view/' + String(info.id), { state: { info, token: props.token, isSearchDate, numOfDays } })}>
        <Typography gutterBottom variant="h5" component="div">
        {info.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {info.address.street}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {info.address.city}, {info.address.state}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        ${info.price} per night
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {Object.keys(info.metadata.bedroomProperty).length} Bedrooms & {info.metadata.numOfBath} Bathrooms
        </Typography>
        <Typography variant="body2" color="text.secondary">
        Total reviews: {Object.keys(info.reviews).length}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => navigate('/login')}>Book</Button>
      </CardActions>
      </Card>

    </div>
  );
}

export default OtherListings;
