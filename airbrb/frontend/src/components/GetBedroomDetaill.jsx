import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export const GetBeroomdetail = (props) => {
  const [numOfBed, setNumOfBed] = React.useState(null);

  // push 4 types of beds into lists based on #bedrooms
  const bedrooms = [];
  for (let i = 1; i <= numOfBed; i++) {
    bedrooms.push(<ListItem>Number of Kings in Room {i}:<input name = 'king' type='number'/></ListItem>);
    bedrooms.push(<ListItem>Number of Queens in Room {i}:<input name = 'queen' type='number' /></ListItem>);
    bedrooms.push(<ListItem>Number of Doubles in Room {i}:<input name = 'double' type='number' /></ListItem>);
    bedrooms.push(<ListItem>Number of Singles in Room {i}:<input name = 'single' type='number' /></ListItem>);
  }

  // a input field represent the number of bedrooms
  return (
    <>
    Number of Bedrooms:
    <input name = 'numOfBed' type="text" value={numOfBed} onChange={e => setNumOfBed(e.target.value)} /><br />

    <List>
      {bedrooms}
    </List>
    </>
  )
}
