import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Fab, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const API_BASE = 'http://localhost:8000';

function submitForm(contentType, data, setResponse) {
  axios({
    url: `${API_BASE}/muscle/`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': contentType,
    },
  }).then((response) => {
    setResponse(response.data);
  }).catch((error) => {
    setResponse('error');
  });
}

function App() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [action, setAct] = useState('');

  function uploadWithFormData() {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('action', action);

    submitForm('multipart/form-data', formData, (msg) => console.log(msg));
  }

  async function uploadWithJSON() {
    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    const data = {
      name,
      image: await toBase64(image),
      action,
    };

    submitForm('application/json', data, (msg) => console.log(msg));
    console.log(data);
  }
  const classes = useStyles();
  return (
    <>
      <form className={classes.root}>
        <TextField
          id="outlined-basic"
          label="Nombre"
          variant="outlined"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); }}
        />
        <TextField
          id="outlined-basic"
          label="Acción"
          variant="outlined"
          value={action}
          onChange={(e) => setAct(e.target.value)}
        />
        <label htmlFor="upload-photo">
          <input
            style={{ display: 'none' }}
            id="upload-photo"
            type="file"
            name="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <Fab color="primary" size="small" component="span" aria-label="add">
            <AddIcon />
          </Fab>
        </label>
        <Button variant="contained" color="primary" onClick={uploadWithJSON}>Upload With JSON</Button>
        <Button variant="contained" color="primary" onClick={uploadWithFormData}>Upload With Multipart/form-data</Button>
      </form>
    </>
  );
}

export default App;
