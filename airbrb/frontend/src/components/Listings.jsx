
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

export const Listings = (props) => {
  // const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [openPublish, setOpenPublish] = React.useState(false);
  const [dateRange, setDateRange] = React.useState(['']);
  const [dateValue, setDateValue] = React.useState([]);
  const [reviewRatings, setReviewRatings] = React.useState(0);

  const info = props.info.listing;
  const renderDel = props.del;
  const renderPub = props.pub;

  useEffect(() => {
    let rate = 0;
    const length = (info.reviews).length;
    if (length !== 0) {
      for (const item of info.reviews) {
        rate = rate + Number(item.score);
      }
      rate = rate / length;
      setReviewRatings(rate);
    }
  }, []);

  const deleteListing = async (id, navigate) => {
    const response = await fetch(`http://localhost:5005/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const data = await response.json();
    if (data.error) {
      navigate('/errorpage', { state: { message: 'Unable to get listings!', route: 'hostedlistings' } });
    }
    renderDel(true);
  }

  const handleClose = () => {
    setOpenPublish(false);
    setDateRange(['']);
    setDateValue([]);
  }

  const addDateRange = () => {
    setDateRange([...dateRange, '']);
  };

  const removeDateRange = (index) => {
    let newDateRange = [...dateRange];
    newDateRange = newDateRange.filter((item, idx) => idx !== index);
    setDateRange(newDateRange);
    let newDateValue = [...dateValue];
    newDateValue = newDateValue.filter((item, idx) => idx !== index);
    setDateRange(newDateValue);
  }

  const setDate = (type, idx, value) => {
    const dateRangeCopy = { ...dateValue };

    dateRangeCopy[idx] = { ...dateRangeCopy[idx], [type]: value };
    setDateValue(dateRangeCopy);
  }

  const dateRanges = dateRange.map((dateRange, index) => (
    <div key={index}>
      Start Date:
      <TextField type = 'date' id = 'start' onChange={(event) => setDate('start', index, event.target.value)}/>
      End Date:
      <TextField type = 'date' id = 'end' onChange={(event) => setDate('end', index, event.target.value)}/>
      <Button onClick={() => removeDateRange(index)}>delete</Button>
    </div>
  ));

  const checkDateRange = () => {
    if (dateValue.length === 0) {
      return false;
    }
    for (const item in dateValue) {
      if (dateValue[item].start === undefined || dateValue[item].end === undefined) {
        return false;
      }
      if (dateValue[item].start > dateValue[item].end) {
        return false;
      }
    }
    return true;
  }
  const submitPublish = async () => {
    if (!checkDateRange()) {
      handleClose();
      navigate('/errorpage', { state: { message: 'date input errror!', route: 'hostedlistings' } });
    } else {
      const response = await fetch(`http://localhost:5005/listings/publish/${info.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          availability: dateValue,
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
      } else if (data) {
        navigate('/hostedlistings');
      }

      handleClose();
      renderPub(true);
    }
  }

  const unPublishListing = async () => {
    const response = await fetch(`http://localhost:5005/listings/unpublish/${info.id}`, {
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
      navigate('/hostedlistings');
    }

    renderPub(true);
  }

  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={info.thumbnail}
          title="green iguana"
        />
        <CardContent>
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
          <Rating name="half-rating-read" value={reviewRatings} precision={0.5} readOnly />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => navigate('/listings/edit/' + String(info.id), { state: { info, token: props.token } })}>Edit</Button>
          {info.published && <Button size="small" id = 'unpublish' onClick={() => unPublishListing()}>Unpublish</Button>}
          {!(info.published) && <Button size="small" id = 'publish' onClick={() => setOpenPublish(true)}>Publish</Button>}
          <Button size="small" onClick={() => deleteListing(info.id, navigate)}>Delete</Button>
          <Button size="small" onClick={() => navigate('/listings/requests/' + String(info.id), { state: { info, token: props.token } })}>Booking</Button>
        </CardActions>
      </Card>
      <Dialog
        open = {openPublish}
        onClose={handleClose}
      >
        {/* Start Date:
        <TextField type = "date" />
        End Date:
        <TextField type = "date" /> */}
        {dateRanges}
        <button onClick={() => addDateRange()}>Add another date range</button>
        publish
        <Button id = 'submitPublish' onClick={() => submitPublish()}>Publish</Button>
        <Button onClick={() => handleClose()}>close</Button>
      </Dialog>
    </div>

  );
}

export default Listings;
