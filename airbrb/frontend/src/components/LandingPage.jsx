
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import BookingListings from './BookingListings';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { getAllBookings } from './BookingRequests';
import OtherListings from './OtherListings';
import Grid from '@mui/material/Grid';

const LandingPage = (props) => {
  const navigate = useNavigate();
  const [publishedListingInfo, setPublishedListingInfo] = React.useState([]);
  const [userBookingInfo, setUserBookingInfo] = React.useState([]);
  const [bookingList, setBookingList] = React.useState([]);
  const [otherList, setOtherList] = React.useState([]);
  const [openSearch, setOpenSearch] = React.useState(false);
  const [numOfBedroom, setnumOfBedroom] = React.useState([0, 11]);
  const [price, setPrice] = React.useState([0, 501]);
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [isSearch, setIsSearch] = React.useState(false);
  const [keywords, setKeywords] = React.useState('');
  const [isSearchDate, setIsSearchDate] = React.useState(false);
  const [numOfDays, setNumOfDays] = React.useState(0);
  const [isBook, setIsBook] = React.useState(false);

  const handleChangeBed = (event, newValue) => {
    setnumOfBedroom(newValue);
  };

  const bedroomValuetext = (value, max) => {
    return value === max ? '10+' : `${value}`;
  }

  const handleChangePrice = (event, newValue) => {
    setPrice(newValue);
  };

  const priceValuetext = (value, max) => {
    return value === max ? '500+' : `${value}`;
  }

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
      // alert(data.error);
      navigate('/errorpage', { state: { message: 'Unable to get listings!', route: 'login' } });
    } else if (data) {
      return data.listings;
    }
  }

  const checkNumOfBedroom = (num) => {
    if (num >= numOfBedroom[0] && (num <= numOfBedroom[1] || (numOfBedroom[1] === 11))) {
      return true;
    }
    return false;
  }

  const checkPrice = (num) => {
    if (num >= price[0] && (num <= price[1] || (price[1] === 501))) {
      return true;
    }
    return false;
  }

  const checkDate = (list) => {
    if (start === '' || end === '') {
      return true;
    }
    for (let i = 0; i < Object.keys(list).length; i++) {
      if (list[i].start <= start && list[i].end >= end) {
        return true;
      }
    }
    return false;
  }

  const checkKeyWords = (title, address) => {
    if (keywords === '') {
      return true;
    }

    if (title.toLowerCase().includes(keywords.toLowerCase()) ||
      address.street.toLowerCase().includes(keywords.toLowerCase()) ||
      address.city.toLowerCase().includes(keywords.toLowerCase()) ||
      address.state.toLowerCase().includes(keywords.toLowerCase()) ||
      address.postcode.toLowerCase().includes(keywords.toLowerCase()) ||
      address.country.toLowerCase().includes(keywords.toLowerCase())) {
      return true;
    }

    return false;
  }
  const getUserBookingInfo = async (data) => {
    const infoList = []
    const userEmail = localStorage.getItem('email');
    for (const item of data) {
      if (item.owner === userEmail) {
        infoList.push(item);
      }
    }

    setUserBookingInfo(infoList);
  }

  const getPublishedListingInfo = async (data) => {
    const infoList = []
    for (const item of data) {
      const response = await fetch(`http://localhost:5005/listings/${item.id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + props.token
        }
      });
      const data = await response.json();
      if (data.error) {
        navigate('/errorpage', { state: { message: 'Unable to get listings!', route: '' } });
      } else if (data) {
        if (data.listing.published && checkNumOfBedroom(Object.keys(data.listing.metadata.bedroomProperty).length) &&
          checkPrice(data.listing.price) && checkDate(data.listing.availability) &&
          checkKeyWords(data.listing.title, data.listing.address)) {
          const list = data;
          list.listing.id = item.id;
          infoList.push(list);
        }
      }
    }
    infoList.sort((a, b) => a.listing.title.toLowerCase().localeCompare(b.listing.title.toLowerCase()));
    setPublishedListingInfo(infoList);
  }

  useEffect(() => {
    setIsSearch(false);
    setIsBook(false);
    getAllListsings(props).then(data => {
      getPublishedListingInfo(data);
    });
    if (props.token) {
      getAllBookings(props, navigate).then(data => {
        getUserBookingInfo(data);
      });
    }
  }, [isSearch, isBook])

  const handleClose = () => {
    setOpenSearch(false);
  }

  const checkDateError = () => {
    if (start > end) {
      return false;
    }
    return true;
  }

  const submitSearch = () => {
    if (!checkDateError()) {
      resetSearch();
      handleClose();
      navigate('/errorpage', { state: { message: 'date input errror!', route: '' } });
    }
    setIsSearch(true);
    handleClose();
    if (start !== '' && end !== '') {
      setIsSearchDate(true);
      const date1 = new Date(start);
      const date2 = new Date(end);

      const differenceInTime = date2.getTime() - date1.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);

      setNumOfDays(differenceInDays);
    } else {
      setIsSearchDate(false);
    }
  }

  const resetSearch = () => {
    setnumOfBedroom([0, 11]);
    setPrice([0, 501]);
    setKeywords('');
    setStart('');
    setEnd('');
  }

  useEffect(() => {
    if (props.token) {
      const upList = [];
      const downList = [];

      for (const item of publishedListingInfo) {
        let check = 0;
        for (const element of userBookingInfo) {
          if (Number(item.listing.id) === Number(element.listingId)) {
            upList.push(item);
            check = 1;
            break;
          }
        }
        if (check === 0) {
          downList.push(item);
        }
      }
      upList.sort((a, b) => a.listing.title.toLowerCase().localeCompare(b.listing.title.toLowerCase()));
      downList.sort((a, b) => a.listing.title.toLowerCase().localeCompare(b.listing.title.toLowerCase()));
      setBookingList(upList);
      setOtherList(downList);
    }
  }, [publishedListingInfo, userBookingInfo])

  return (
    <>
      <div>
        <h1>Landing Page</h1>
        <Button onClick={() => setOpenSearch(true)}>Search & Filter</Button>
        {props.token &&
          <Grid container spacing={2}>
            {
              bookingList.map((item) => {
                return (<Grid item xs={12} sm={6} md={4} lg={3} key={item.id}><BookingListings info = {item} token = {props.token} searchDate = {isSearchDate} numOfDays = {numOfDays} book = {setIsBook}/></Grid>)
              })
            }
            {
              otherList.map((item) => {
                return (<Grid item xs={12} sm={6} md={4} lg={3} key={item.id}><BookingListings info = {item} token = {props.token} searchDate = {isSearchDate} numOfDays = {numOfDays} book = {setIsBook}/></Grid>)
              })
            }
          </Grid>
        }
        {!props.token &&
          publishedListingInfo.map((item, idx) => {
            return (<OtherListings key = {idx} info = {item} token = {props.token} searchDate = {isSearchDate} numOfDays = {numOfDays} book = {setIsBook}/>)
          })
        }
          <Dialog
            open = {openSearch}
            onClose={handleClose}
          >
            Key Words:
            <input type="text" value={keywords} onChange={(event) => setKeywords(event.target.value)}/>
            Number of Bedrooms:
            <Box sx={{ width: 300, margin: 2 }}>
              <Slider
                getAriaLabel={() => 'Temperature range'}
                value={numOfBedroom}
                onChange={handleChangeBed}
                valueLabelDisplay="auto"
                getAriaValueText={bedroomValuetext}
                min={0}
                max={11}
                valueLabelFormat={(numOfBedroom) => bedroomValuetext(numOfBedroom, 11)}
              />
            </Box>
            Start Date:
            <TextField value={start} type = "date" onChange={(event) => setStart(event.target.value)}/>
            End Date:
            <TextField value={end} type = "date" onChange={(event) => setEnd(event.target.value)}/>
            Price per night:
            <Box sx={{ width: 300, margin: 2 }}>
              <Slider
                getAriaLabel={() => 'Temperature range'}
                value={price}
                onChange={handleChangePrice}
                valueLabelDisplay="auto"
                getAriaValueText={priceValuetext}
                min={0}
                max={501}
                valueLabelFormat={(price) => priceValuetext(price, 501)}
              />
            </Box>
            <Button onClick={() => submitSearch()}>Search</Button>
            <Button onClick={() => resetSearch()}>Reset</Button>
            <Button onClick={() => handleClose()}>Close</Button>
          </Dialog>
      </div>
    </>
  )
}

export default LandingPage;
