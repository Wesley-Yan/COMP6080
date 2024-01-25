
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

export const PendingBookings = (props) => {
  const info = props.info;
  const isPending = props.isPending;
  const renderAction = props.renderAction;
  const navigate = useNavigate();

  const acceptBooking = async () => {
    const response = await fetch(`http://localhost:5005/bookings/accept/${info.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const data = await response.json();
    if (data.error) {
      // alert(data.error);
      navigate('/errorpage', { state: { message: 'Invalid listings details!', route: 'hostedlistings' } });
    } else if (data) {
      renderAction(true);
    }
  }

  const declineBooking = async () => {
    const response = await fetch(`http://localhost:5005/bookings/decline/${info.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const data = await response.json();
    if (data.error) {
      // alert(data.error);
      navigate('/errorpage', { state: { message: 'Invalid listings details!', route: 'hostedlistings' } });
    } else if (data) {
      renderAction(true);
    }
  }

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        {/* <Grid item xs={3}>
        <Typography variant="body1">{info.id}</Typography>
        </Grid> */}
        <Grid item xs={4}>
        <Typography variant="body1">{info.owner}</Typography>
        </Grid>
        <Grid item xs={4}>
        <Typography variant="body1">{info.dateRange.start} - {info.dateRange.end}</Typography>
        </Grid>
        {isPending && (
          <>
          <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={() => acceptBooking()}>
              Accept
          </Button>
          </Grid>
          <Grid item xs={2}>
          <Button variant="outlined" color="secondary" onClick={() => declineBooking()}>
              Deny
          </Button>
          </Grid>
          </>
        )}
        {!isPending && (
          <>
          <Grid item xs={2}>
          {/* <Typography variant="body1">{info.status}</Typography> */}
          <Chip label={info.status} color= {info.status === 'accepted' ? 'success' : 'error'} sx = { { minWidth: 80 } }/>
          </Grid>
          </>
        )}
      </Grid>
    </>
  )
}

export default PendingBookings;
