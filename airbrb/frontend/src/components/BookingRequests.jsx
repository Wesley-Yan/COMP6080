
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import PendingBookings from './PendingBookings';

export const getAllBookings = async (props, navigate) => {
  const response = await fetch('http://localhost:5005/bookings', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + props.token
    }
  });
  const data = await response.json();
  if (data.error) {
    navigate('/errorpage', { state: { message: 'Unable to get bookings!', route: 'hostedlistings' } });
  } else if (data) {
    return data.bookings;
  }
}

const getAllBookingsForSingleListing = (data, listingId) => {
  const infoList = [];
  for (const booking in data) {
    if (data[booking].listingId === listingId) {
      infoList.push(data[booking])
    }
  }
  return infoList;
};

export const BookingRequests = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const listInfo = location.state.info;
  const [diffDays, setDiffDays] = React.useState('');
  const [diffHours, setDiffHours] = React.useState('');
  const [bookingInfo, setBookingInfo] = React.useState([]);
  const [totalBookingDays, setTotalBookingDays] = React.useState('');
  const [totalBookingProfit, setTotalBookingProfit] = React.useState('');

  const [pendingBookings, setPendingBookings] = React.useState([]);
  const [historyBookings, setHistoryBookings] = React.useState([]);
  const [hasAction, setHasAction] = React.useState(false);

  useEffect(() => {
    setHasAction(false);
    const currentDate = new Date();
    const specifiedDate = new Date(listInfo.postedOn);
    const timeDifference = currentDate - specifiedDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    setDiffDays(daysDifference);
    setDiffHours(hoursDifference);

    const fetchBookings = async () => {
      const data = await getAllBookings(props, navigate);
      if (data) {
        setBookingInfo(getAllBookingsForSingleListing(data, listInfo.id));
      }
    };

    fetchBookings();
  }, [listInfo, hasAction]);

  useEffect(() => {
    setHasAction(false);
    let totalDays = 0;
    const pendings = [];
    const history = []
    for (const booking of bookingInfo) {
      if (booking.status === 'accepted') {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);
        let start = '';
        let end = '';
        if (booking.dateRange.start < firstDayOfYear) {
          start = firstDayOfYear;
        } else {
          start = new Date(booking.dateRange.start);
        }
        if (booking.dateRange.end > lastDayOfYear) {
          end = firstDayOfYear;
        } else {
          end = new Date(booking.dateRange.end);
        }
        const timeDifference = end - start;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        totalDays = totalDays + daysDifference;
        history.push(booking);
      } else if (booking.status === 'pending') {
        pendings.push(booking);
      } else {
        history.push(booking);
      }
    }
    setTotalBookingDays(totalDays);
    setTotalBookingProfit(totalDays * listInfo.price);
    setPendingBookings(pendings);
    setHistoryBookings(history);
  }, [bookingInfo, hasAction]);

  return (
    <>
      <h2>booking requests</h2>
      <Button size="small" onClick={() => navigate('/hostedlistings')}>Back</Button>
      {listInfo.postedOn && <Typography variant="body1" sx={ { margin: 1 } }>This listing has been publised for {diffDays} days {diffHours} hours</Typography>}
      {!listInfo.postedOn && <Typography variant="body1" sx={ { margin: 1 } }>This listing has not been published</Typography>}
      <Typography variant="body1" sx={ { margin: 1 } }>This year the listing has been booked for {totalBookingDays} days, and earns ${totalBookingProfit}</Typography>
      <Typography variant="h5" sx={ { margin: 1 } }>{'Current Bookings'}</Typography>
      <Paper elevation={2} sx={ { padding: 2, margin: 1 } }>
        <Grid container alignItems="center" spacing={2} sx = { { mb: 2 } }>
          <Grid item xs={4}>
          <Typography variant="body1">{'Booking name'}</Typography>
          </Grid>
          <Grid item xs={4}>
          <Typography variant="body1">{'Booking range'}</Typography>
          </Grid>
          <Grid item xs={2}>
          <Typography variant="body1">{'Action'}</Typography>
          </Grid>
        </Grid>
        {pendingBookings.map((item, idx) => {
          return (<PendingBookings key = {idx} info = {item} isPending = {true} token = {props.token} renderAction = {setHasAction}/>)
        })}
      </Paper>
      <Typography variant="h5" sx={ { margin: 1 } }>{'History Bookings'}</Typography>
      <Paper elevation={2} sx={ { padding: 2, margin: 1 } }>
          <Grid container alignItems="center" spacing={2} sx = { { mb: 2 } }>
            <Grid item xs={4}>
            <Typography variant="body1">{'Booking name'}</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant="body1">{'Booking range'}</Typography>
            </Grid>
            <Grid item xs={2}>
            <Typography variant="body1">{'Status'}</Typography>
            </Grid>
          </Grid>
          {historyBookings.map((item, idx) => {
            return (<PendingBookings key = {idx} info = {item} isPending = {false} token = {props.token}/>)
          })}
      </Paper>
    </>
  )
}

export default BookingRequests;
