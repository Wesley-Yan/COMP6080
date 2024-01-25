
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';

export const BookingListings = (props) => {
  const info = props.info.listing;
  const isSearchDate = props.searchDate;
  const numOfDays = props.numOfDays;
  const navigate = useNavigate();
  const [openBook, setOpenBook] = React.useState(false);
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [bookings, setBookings] = React.useState({});
  // const [hasBook, setHasBook] = React.useState(false);
  const userEmail = localStorage.getItem('email');
  const renderBook = props.book;
  // const [hasReview, setHasReview] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const bookingIds = [];

  const handleClose = () => {
    setStart('');
    setEnd('');
    setOpenBook(false);
  }

  const checkDate = () => {
    if (start === '' || end === '' || end < start) {
      navigate('/errorpage', { state: { message: 'book error!', route: '' } });
    }
    const list = info.availability;

    for (let i = 0; i < Object.keys(list).length; i++) {
      if (list[i].start <= start && list[i].end >= end) {
        return true;
      }
    }
    return false;
  }

  const submitBook = async () => {
    checkDate();
    const dateRange = { start, end };
    const date1 = new Date(start);
    const date2 = new Date(end);

    const differenceInTime = date2.getTime() - date1.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const totalPrice = info.price * differenceInDays;

    const response = await fetch(`http://localhost:5005/bookings/new/${info.id}`, {
      method: 'POST',
      body: JSON.stringify({
        dateRange,
        totalPrice: Number(totalPrice)
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const data = await response.json();
    if (data.error) {
      navigate('/errorpage', { state: { message: 'book error!', route: '' } });
    }
    handleClose();
    setOpenConfirm(true);
    renderBook(true);
  }

  const getBookings = async () => {
    const response = await fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const data = await response.json();
    if (data.error) {
      navigate('/errorpage', { state: { message: 'book error!', route: '' } });
    } else if (data) {
      setBookings(data.bookings);
    }
  }

  useEffect(() => {
    getBookings();
  }, [])

  let flag = false;
  for (const key in bookings) {
    if (userEmail === bookings[key].owner && info.id === Number(bookings[key].listingId) && bookings[key].status === 'accepted') {
      bookingIds.push(bookings[key].id);
      flag = true;
    }
  }

  const [rate, setRate] = React.useState(0);
  const [reviewComments, setReviewComments] = React.useState('');

  const closeReview = () => {
    setOpenReview(false);
    setReviewComments('');
    setRate(0);
  }

  const closeConfirm = () => {
    setOpenConfirm(false);
  }

  const submitReview = async () => {
    const response = await fetch(`http://localhost:5005/listings/${info.id}/review/${bookingIds[0]}`, {
      method: 'PUT',
      body: JSON.stringify({
        review: { score: rate, comments: reviewComments }
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const data = await response.json();
    if (data.error) {
      // alert(data.error);
      navigate('/errorpage', { state: { message: 'Invalid listings details!', route: 'hostedlistings' } });
    }
    closeReview();
  }

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
            <Button id = 'book' onClick={() => setOpenBook(true)}>Book</Button>
            {flag && <Button onClick={() => setOpenReview(true)}>Review</Button>}
        </CardActions>
      </Card>
      <Dialog
        open = {openBook}
        onClose={handleClose}
      >
        Start Date:
        <TextField id = 'start' type = "date" onChange={(event) => setStart(event.target.value)}/>
        End Date:
        <TextField id = 'end' type = "date" onChange={(event) => setEnd(event.target.value)}/>
        <Button id = 'submitBook' onClick={() => submitBook()}>Book</Button>
        <Button onClick={() => handleClose()}>close</Button>
      </Dialog>
      <Dialog
        open = {openReview}
        onClose={closeReview}
      >
        Rate Score:
        <Rating
          name="simple-controlled"
          value={rate}
          onChange={(event, newValue) => {
            setRate(newValue);
          }}
        />
        Comments
        <input type="text" onChange={(event) => setReviewComments(event.target.value)}/>
        <Button onClick={() => submitReview()}>Submit Review</Button>
        <Button onClick={() => closeReview()}>close</Button>
      </Dialog>
      <Dialog
        open = {openConfirm}
        onClose={closeConfirm}
      >
        <Typography variant="body2" color="text.secondary">
        You have booked {info.title}.
        </Typography>
        <Button id = 'closeConfirm' onClick={() => closeConfirm()}>close</Button>
      </Dialog>
    </div>
  );
}

export default BookingListings;
