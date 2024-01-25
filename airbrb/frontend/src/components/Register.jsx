
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.token) {
      navigate('/');
    }
  }, [props.token]);

  const register = async () => {
    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email, password, name
      }),
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      //   alert(data.error);
      navigate('/errorpage', { state: { message: 'Regitser error!', route: 'register' } });
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      props.setToken(data.token);
      navigate('/');
    }
  };

  return (
    <>
      <h2>Register</h2>
      Email:
        <input name = 'email' type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
      Password:
        <input name = 'password' type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      Name:
        <input name = 'name' type="text" value={name} onChange={e => setName(e.target.value)} /><br />

      <button name = 'submit' type="button" onClick={register}>Register</button>
    </>
  )
};

export default Register;
