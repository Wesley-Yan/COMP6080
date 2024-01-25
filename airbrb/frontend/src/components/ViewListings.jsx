
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

export const ViewListings = (props) => {
  const location = useLocation();
  const listingInfo = location.state.info;
  const isSearchDate = location.state.isSearchDate;

  const numOfDays = location.state.numOfDays;
  const listingMetadata = listingInfo.metadata;
  const numOfBedroom = Object.keys(listingMetadata.bedroomProperty).length
  const [openImage, setOpenImage] = React.useState(false);
  const [reviewRatings, setReviewRatings] = React.useState(0);
  let numOfBeds = 0;

  const [itemData, setItemData] = React.useState([]);

  useEffect(() => {
    let rate = 0;
    const length = (listingInfo.reviews).length;
    if (length !== 0) {
      for (const item of listingInfo.reviews) {
        rate = rate + Number(item.score);
      }
      rate = rate / length;
      setReviewRatings(rate);
    }
  }, []);

  useEffect(() => {
    const newItemData = [];
    for (const item in listingMetadata.propertyImages) {
      newItemData.push({ img: listingMetadata.propertyImages[item] });
    }
    setItemData(newItemData);
  }, [listingMetadata.propertyImages]);

  const handleClose = () => {
    setOpenImage(false);
  }
  for (let i = 1; i <= numOfBedroom; i++) {
    numOfBeds += listingMetadata.bedroomProperty[i].king ? Number(listingMetadata.bedroomProperty[i].king) : 0;
    numOfBeds += listingMetadata.bedroomProperty[i].queen ? Number(listingMetadata.bedroomProperty[i].queen) : 0;
    numOfBeds += listingMetadata.bedroomProperty[i].double ? Number(listingMetadata.bedroomProperty[i].double) : 0;
    numOfBeds += listingMetadata.bedroomProperty[i].single ? Number(listingMetadata.bedroomProperty[i].single) : 0;
  }

  return (
    <>
      View Listing
      <Box sx = { { marginLeft: 2 } }>
        <Typography gutterBottom variant="h5" component="div">
        {listingInfo.title}
        </Typography>
        <img src={listingInfo.thumbnail} alt="" />
        <button onClick={() => setOpenImage(true)}>Show All Images</button>
        <Typography variant="body1" color="text.secondary">
        {listingMetadata.propertyType} in {listingInfo.address.street}, {listingInfo.address.city}, {listingInfo.address.state}
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
        {numOfBedroom} bedrooms, {numOfBeds} beds, {listingMetadata.numOfBath} bathrooms
        </Typography>
        <Typography gutterBottom variant="body2" component="div">
        {listingMetadata.amenities}
        </Typography>
        {isSearchDate &&
          <Typography gutterBottom variant="body2" component="div">
          Total: ${listingInfo.price * Number(numOfDays)}
          </Typography>
        }
        {!isSearchDate &&
            <Typography gutterBottom variant="body2" component="div">
            ${listingInfo.price} per night
            </Typography>
        }
        Review Ratings: <Rating name="half-rating-read" value={reviewRatings} precision={0.5} readOnly />

        <Paper elevation={3} sx={ { maxWidth: 600, padding: 2, marginTop: 2 } }>
          <Typography sx = { { marginLeft: 1 } } variant="h6" component="h2" >
            Reviews
          </Typography>
          <List>
              {listingInfo.reviews.map((review, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                    <React.Fragment>
                      {/* <Typography component="legend">Score:</Typography> */}
                      <Rating value={review.score} readOnly />
                    </React.Fragment>
                    }
                    secondary={
                    <Typography variant="body2" color="text.primary">
                      Comments: {review.comments}
                    </Typography>
                    }
                  />
                  </ListItem>
                  {index < listingInfo.reviews.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
          </List>
        </Paper>
      </Box>
      <Dialog
        open = {openImage}
        onClose={handleClose}
      >
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
          <img
            src={`${item.img}`}
            loading="lazy"
          />
          </ImageListItem>
        ))}
        </ImageList>
        <Button onClick={() => handleClose()}>close</Button>
      </Dialog>
    </>
  )
}

export default ViewListings;
