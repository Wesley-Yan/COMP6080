import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import LocationOnIcon from '@mui/icons-material/LocationOn';

import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import HostedListings from './components/HostedListings';
import CreateListings from './components/CreateListings';
import ErrorPage from './components/ErrorPage';
import EditListings from './components/EditListings';
import LandingPage from './components/LandingPage';
import ViewListings from './components/ViewListings';
import BookingRequests from './components/BookingRequests';

// const LandingPage = () => {
//   //const navigate = useNavigate();
//   //navigate('/login');
//   return <>Hi</>
// }

const PageList = () => {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checktoken = localStorage.getItem('token');
    if (checktoken) {
      setToken(checktoken);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  }

  const pages = token
    ? ['LandingPage', 'Logout', 'HostedListings']
    : ['LandingPage', 'Register', 'Login'];

  return (
    <>

      <Routes>
        <Route path="/" element={<LandingPage token={token} setToken={setToken} />} />
        <Route path="/register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/login" element={<Login token={token} setToken={setToken} />} />
        {/* <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} /> */}
        <Route path="/hostedlistings" element={<HostedListings token={token} setToken={setToken} />} />
        <Route path="/createlistings" element={<CreateListings token={token} setToken={setToken} />} />
        <Route path="/errorpage" element={<ErrorPage token={token} setToken={setToken} />} />
        <Route path="/listings/edit/:listingId" element={<EditListings token={token} setToken={setToken} />} />
        <Route path="/listings/view/:listingId" element={<ViewListings token={token} setToken={setToken} />} />
        <Route path="/listings/requests/:listingId" element={<BookingRequests token={token} setToken={setToken} />} />
      </Routes>

      <br />
      <br />
      <hr />
      <Box>
        <BottomNavigation
        showLabels
        value={''}
        onChange={(event, newValue) => {
          if (pages[newValue] === 'Logout') {
            logout();
          } else if (pages[newValue] === 'LandingPage') {
            navigate('/');
          } else {
            navigate(`/${pages[newValue].toLowerCase()}`);
          }
        }}
        >
          {pages.map((page, idx) => {
            return (
              <BottomNavigationAction key = {idx} id = {page} label={page} icon={<RestoreIcon />} />
            )
          })}
        </BottomNavigation>
      </Box>
      <hr />

      <Footer />

      </>
  );
}

export default PageList;
