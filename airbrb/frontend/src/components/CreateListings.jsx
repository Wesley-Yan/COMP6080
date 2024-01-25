
import React from 'react';
import { useNavigate } from 'react-router-dom';

import fileToDataUrl from '../helper';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export const CreateListings = (props) => {
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState({});
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [price, setPrice] = React.useState(null);
  const [thumbnail, setThumbnail] = React.useState('');
  const [metadata, setMetadata] = React.useState({});
  const [propertyType, setPropertyType] = React.useState('');
  const [numOfBath, setNumOfBath] = React.useState(null);
  const [bedroomProperty, setBedroomProperty] = React.useState({});
  const [amenities, setAmenities] = React.useState('');
  const [numOfBed, setNumOfBed] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token]);

  const isFormValid = () => {
    const valuesToCheck = [
      title, street, city, state, postcode, country,
      price, thumbnail, propertyType, numOfBath, amenities, numOfBed
    ];

    // Check if any value is falsy (empty string, null, undefined, etc.)
    const hasInvalidValue = valuesToCheck.some(value => !value);

    // For objects, you might want to check if they are empty
    const isAddressEmpty = Object.keys(address).length === 0;
    const isMetadataEmpty = Object.keys(metadata).length === 0;
    const isBedroomPropertyEmpty = Object.keys(bedroomProperty).length === 0;

    // If any value is invalid or any object is empty, the form is not valid
    return !hasInvalidValue && !isAddressEmpty && !isMetadataEmpty && !isBedroomPropertyEmpty;
  };

  const submitCreateListing = async () => {
    if (!isFormValid()) {
      navigate('/errorpage', { state: { message: 'Invalid listings details!', route: 'createlistings' } });
    } else {
      const response = await fetch('http://localhost:5005/listings/new', {
        method: 'POST',
        body: JSON.stringify({
          title,
          address,
          price,
          thumbnail,
          metadata
        }),
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + props.token
        }
      });
      const data = await response.json();
      if (data.error) {
        // alert(data.error);
        navigate('/errorpage', { state: { message: 'Invalid listings details!', route: 'createlistings' } });
      } else if (data) {
        navigate('/hostedlistings');
      }
    }
  };

  const changeBedProperty = (idx, type, value) => {
    const newBedroomProperties = { ...bedroomProperty };

    if (!newBedroomProperties[idx]) {
      newBedroomProperties[idx] = {};
    }
    if (newBedroomProperties[idx]) {
      newBedroomProperties[idx] = { ...newBedroomProperties[idx], [type]: value };
    }

    // Set the state with the new array
    setBedroomProperty(newBedroomProperties);
  }

  React.useEffect(() => {
    setAddress({
      street,
      city,
      state,
      postcode,
      country,
    })
  }, [street, city, state, postcode, country]);

  React.useEffect(() => {
    setMetadata({
      propertyType,
      numOfBath,
      bedroomProperty,
      amenities,
    })
  }, [propertyType, numOfBath, bedroomProperty, amenities]);

  const bedrooms = [];
  for (let i = 1; i <= numOfBed; i++) {
    bedrooms.push(<ListItem>Number of Kings in Room {i}:<input name = 'king' type='number' onChange={e => changeBedProperty(i, 'king', e.target.value)}/></ListItem>);
    bedrooms.push(<ListItem>Number of Queens in Room {i}:<input name = 'queen' type='number' onChange={e => changeBedProperty(i, 'queen', e.target.value)}/></ListItem>);
    bedrooms.push(<ListItem>Number of Doubles in Room {i}:<input name = 'double' type='number' onChange={e => changeBedProperty(i, 'double', e.target.value)}/></ListItem>);
    bedrooms.push(<ListItem>Number of Singles in Room {i}:<input name = 'single' type='number' onChange={e => changeBedProperty(i, 'single', e.target.value)}/></ListItem>);
  }

  const convertFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      fileToDataUrl(file)
        .then(dataUrl => {
          setThumbnail(dataUrl);
        })
        .catch(error => {
          navigate('/errorpage', { state: { message: error, route: 'hostedlistings' } });
        });
    }
  }

  return (
    <>
      <h2>Create Listings</h2>
      Title:
      <input name = 'title' type="text" value={title} onChange={e => setTitle(e.target.value)} /><br />

      Address: <br />
      <input name = 'street' type="text" placeholder = "Street" value={street} onChange={e => setStreet(e.target.value)} /><br />
      <input name = 'city' type="text" placeholder = "City" value={city} onChange={e => setCity(e.target.value)} /><br />
      <input name = 'state' type="text" placeholder = "State" value={state} onChange={e => setState(e.target.value)} /><br />
      <input name = 'postcode' type="text" placeholder = "Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} /><br />
      <input name = 'country' type="text" placeholder = "Country" value={country} onChange={e => setCountry(e.target.value)} /><br />
      Price:
      <input name = 'price' type="number" value={price} onChange={e => setPrice(e.target.value)} /><br />
      Thumbnail:
      <input type="file" onChange={convertFile} /><br/>

      Property Type:
      <input name = 'propertyType' type="text" value={propertyType} onChange={e => setPropertyType(e.target.value)} /><br />

      Number of Bathrooms:
      <input name = 'numOfBath' type="text" value={numOfBath} onChange={e => setNumOfBath(e.target.value)} /><br />

      Number of Bedrooms:
      <input name = 'numOfBed' type="text" value={numOfBed} onChange={e => setNumOfBed(e.target.value)} /><br />

      <List>
        {bedrooms}
      </List>

      Amenities:
      <input name = 'amenity' type="text" value={amenities} onChange={e => setAmenities(e.target.value)} /><br />

      <button id = 'submit' type="button" onClick={submitCreateListing}>Submit</button>
      </>
  )
}

export default CreateListings;
