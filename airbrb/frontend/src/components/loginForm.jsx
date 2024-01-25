
import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const Login = ({ e, p }) => {
  // 2 input fields and a submit button
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField name = 'email' label="Email" type="text" value={e} /><br />
      <br />
      <TextField name = 'password' label="Password" type="password" value={p} /><br />
      <br />
      <Button name = 'submit' variant="contained" >Login</Button>
    </>
  )
};

export default Login;
