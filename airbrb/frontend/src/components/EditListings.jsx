
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

// import convertFile from './CreateListings';
import fileToDataUrl from '../helper';

export const EditListings = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const orgininfo = location.state.info;
  const listingId = orgininfo.id;
  const token = location.state.token;

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
  const [propertyImages, setPropertyImages] = useState([]);

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
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token]);

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
      propertyImages,
    })
  }, [propertyType, numOfBath, bedroomProperty, amenities, propertyImages]);

  React.useEffect(() => {
    if (orgininfo) {
      setTitle(orgininfo.title || '');
      setStreet(orgininfo.address.street || '');
      setCity(orgininfo.address.city || '');
      setState(orgininfo.address.state || '');
      setPostcode(orgininfo.address.postcode || '');
      setCountry(orgininfo.address.country || '');
      setPrice(orgininfo.price || null);
      setPropertyType(orgininfo.metadata.propertyType || '');
      setNumOfBath(orgininfo.metadata.numOfBath || null);
      setBedroomProperty(orgininfo.metadata.bedroomProperty || {});
      setAmenities(orgininfo.metadata.amenities || '');
      setNumOfBed(Object.keys(orgininfo.metadata.bedroomProperty).length || null);
      setThumbnail(orgininfo.thumbnail || null);
    }
  }, [orgininfo]);

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
  const bedrooms = [];
  for (let i = 1; i <= numOfBed; i++) {
    // bedrooms.push(<input type='text' placeholder='Number of Beds'/>);
    bedrooms.push(<ListItem>Number of Kings in Room {i}:<input type='number' value = {bedroomProperty[i]?.king || ''} onChange={e => changeBedProperty(i, 'king', e.target.value)}/></ListItem>);
    bedrooms.push(<ListItem>Number of Queens in Room {i}:<input type='number' value = {bedroomProperty[i]?.queen || ''} onChange={e => changeBedProperty(i, 'queen', e.target.value)}/></ListItem>);
    bedrooms.push(<ListItem>Number of Doubles in Room {i}:<input type='number' value = {bedroomProperty[i]?.double || ''} onChange={e => changeBedProperty(i, 'double', e.target.value)}/></ListItem>);
    bedrooms.push(<ListItem>Number of Singles in Room {i}:<input type='number' value = {bedroomProperty[i]?.single || ''} onChange={e => changeBedProperty(i, 'single', e.target.value)}/></ListItem>);
  }

  const update = async () => {
    const imageCopy = propertyImages.filter(element => element !== '');
    setPropertyImages(imageCopy);

    const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        address,
        price,
        thumbnail,
        metadata
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.error) {
      // alert(data.error);
      navigate('/errorpage', { state: { message: 'Invalid listings details', route: 'hostedlistings' } });
    } else if (data) {
      navigate('/hostedlistings');
    }
  }
  const cancel = () => {
    navigate('/hostedlistings');
  }

  const handleFileChange = (file, index) => {
    if (file) {
      fileToDataUrl(file)
        .then(dataUrl => {
          const newPropertyImages = [...propertyImages];
          newPropertyImages[index] = dataUrl;
          setPropertyImages(newPropertyImages);
        })
        .catch(error => {
          navigate('/errorpage', { state: { message: error, route: 'hostedlistings' } });
        });
    }
  };

  const addFileInput = () => {
    setPropertyImages([...propertyImages, '']);
  };

  const fileInputs = propertyImages.map((propertyImage, index) => (
    <div key={index}>
      <input
        type="file"
        onChange={(e) => handleFileChange(e.target.files[0], index)}
      />
    </div>
  ));

  return (
    <>
      <h2>Edit Listing</h2>
      Thumbnail:
      <img src={thumbnail} alt="profile-img" /> <br/>
      <input type="file" onChange={convertFile} /><br/>
      Title:
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} /><br />

      Address: <br />
      <input type="text" placeholder = "Street" value={street} onChange={e => setStreet(e.target.value)} /><br />
      <input type="text" placeholder = "City" value={city} onChange={e => setCity(e.target.value)} /><br />
      <input type="text" placeholder = "State" value={state} onChange={e => setState(e.target.value)} /><br />
      <input type="text" placeholder = "Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} /><br />
      <input type="text" placeholder = "Country" value={country} onChange={e => setCountry(e.target.value)} /><br />
      Price:
      <input type="number" value={price} onChange={e => setPrice(e.target.value)} /><br />
      Property Type:
      <input type="text" value={propertyType} onChange={e => setPropertyType(e.target.value)} /><br />

      Number of Bathrooms:
      <input type="text" value={numOfBath} onChange={e => setNumOfBath(e.target.value)} /><br />

      Number of Bedrooms:
      <input type="text" value={numOfBed} onChange={e => setNumOfBed(e.target.value)} /><br />

      <List>
          {bedrooms}
      </List>

      Amenities:
      <input type="text" value={amenities} onChange={e => setAmenities(e.target.value)} /><br />

      property Images:
      {fileInputs}
      <button onClick={addFileInput}>Add another image</button>

      <Button onClick={() => update()}>Update Change</Button>
      <Button onClick={() => cancel()}>Cancel</Button>
    </>
  )
}

export default EditListings;
