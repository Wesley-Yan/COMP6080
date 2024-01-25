
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Listings from './Listings';
import Grid from '@mui/material/Grid';

const getHostedListsingId = (lists, hostedlistingId) => {
  const userEmail = localStorage.getItem('email');
  for (const list of lists) {
    if (list.owner === userEmail) {
      hostedlistingId.push(
        list.id
      );
    }
  }
};

const HostedListings = (props) => {
  const navigate = useNavigate();
  let hostedlistingId = [];
  const [hostedListingInfo, setHostedListingInfo] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [isPublish, setIsPublish] = useState(false);
  React.useEffect(() => {
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token]);

  const getAllListsings = async (props) => {
    const response = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const data = await response.json();
    if (data.error) {
      navigate('/errorpage', { state: { message: 'Unable to get listings!', route: 'login' } });
    } else if (data) {
      return data.listings;
    }
  }

  useEffect(() => {
    setIsPublish(false);
    setIsDelete(false);
    hostedlistingId = [];
    getAllListsings(props).then(data => {
      if (data) {
        getHostedListsingId(data, hostedlistingId);
        getHostedListingInfo();
      }
    });
  }, [isDelete, isPublish]);

  const getHostedListingInfo = async () => {
    const infoList = []
    for (const id of hostedlistingId) {
      const response = await fetch(`http://localhost:5005/listings/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + props.token
        }
      });
      const data = await response.json();
      if (data.error) {
        // alert(data.error);
        navigate('/errorpage', { state: { message: 'Unable to get listings!', route: '' } });
      } else if (data) {
        const list = data;
        list.listing.id = id;
        infoList.push(list);
      }
    }
    setHostedListingInfo(infoList);
  }
  const createListings = () => {
    navigate('/createlistings');
  };

  return (
    <>
      <h1>HostedListings</h1>
      <Grid container spacing={2}>
      {
        hostedListingInfo.map((item) => {
          return (<Grid item xs={12} sm={6} md={4} lg={3} key={item.id}><Listings info = {item} del = {setIsDelete} pub = {setIsPublish} token = {props.token}/></Grid>)
        })
      }
      </Grid>
      <Button id = 'createListing' variant="contained" onClick={createListings}>Create Listings</Button>
    </>
  )
};

export default HostedListings;
