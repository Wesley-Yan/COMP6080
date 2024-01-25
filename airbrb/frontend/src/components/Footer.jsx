import React from 'react';

import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Typography
      variant="caption"
      display="block"
      gutterBottom
      sx={{
        textAlign: 'center',
      }}
    >
      Airbrb 2023 Â©
    </Typography>
  )
}

export default Footer;
