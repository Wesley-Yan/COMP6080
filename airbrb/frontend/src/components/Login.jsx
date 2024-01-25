
import React from 'react';
import { useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const Login = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.token) {
      navigate('/');
    }
  }, [props.token]);

  const login = async () => {
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email, password
      }),
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      navigate('/errorpage', { state: { message: 'login error!', route: 'login' } });
    } else if (data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      props.setToken(data.token);
      navigate('/');
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField name = 'email' label="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <br />
      <TextField name = 'password' label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <br />
      <Button name = 'submit' variant="contained" onClick={login}>Login</Button>
    </>
  )
};

export default Login;
