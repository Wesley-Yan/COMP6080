
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';

const ErrorPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const close = async () => {
    navigate('/' + [state.route])
  };

  return (
    <>
      <h1>ErrorPage!</h1><br/>
      <h2>{state.message}</h2><br/>
      <Button id = 'close' variant="contained" onClick={close}>Close</Button>
    </>
  )
};

export default ErrorPage;
