import Dialog from '@mui/material/Dialog';
import React from 'react';
import Button from '@mui/material/Button';

export const Filter = () => {
  const [keywords, setKeywords] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const resetSearch = () => {
    setKeywords('');
  }
  const openDialog = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <>
      <button id = 'open' onClick={() => openDialog()}>Open dialog</button>
      <Dialog
        open = {open}
        onClose={handleClose}
      >
        Key Words:
        <input id = 'keyword' type="text" value={keywords} onChange={(event) => setKeywords(event.target.value)}/>
        <Button>Search</Button>
        <Button id = 'reset' onClick={() => resetSearch()}>Reset</Button>
        <Button id = 'close' onClick={() => handleClose()}>Close</Button>
      </Dialog>
    </>
  )
}
