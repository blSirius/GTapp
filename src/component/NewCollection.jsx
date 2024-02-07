import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import axios from 'axios';
import NavBar from './nav/NavBar';
import NewCollectionCSS from './style/NewCollection.module.css'

const NewCollection = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');

  // const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // const previewURL = URL.createObjectURL(selectedFile);
    // setImagePreview(previewURL);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('Please select a file.');
      return;
    }

    createEmployeeFolder();
    createEmployeeDB();
  };

  const createEmployeeDB = async () => {
    try {
      const res = await axios.post('http://localhost:3000/createEmployee', { name, username });
      console.log('create db successfully', res);
    }
    catch (err) {
      console.log('fail to create db', err.message);
    }
  }

  const createEmployeeFolder = async () => {
    const formData = new FormData();
    console.log(file);
    formData.append('labels', file);
    formData.append('folderName', folderName || 'defaultFolder');

    try {
      const { data } = await axios.post('http://localhost:3000/updateImageFolder', formData);
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error:', error.message || 'Failed to upload image.');
    }
  }

  return (
    <>
      <NavBar />
      <Container className={NewCollectionCSS.container} >
        <div style={{ marginTop: '100px' }} ></div>
        <div>
          <label htmlFor="">Name ,folderName</label>
          <input type="text" placeholder="Name" value={folderName} className={NewCollectionCSS.label_input}
            onChange={(e) => {
              const newValue = e.target.value;
              setFolderName(newValue);
              setName(newValue);
            }}
          />
        </div>
        <div>
          <label htmlFor="">Username</label>
          <input type="text" placeholder="Username" value={username} className={NewCollectionCSS.label_input}
            onChange={(e) => setUsername(e.target.value)}
          />

        </div>
        {/* <div>
          <label htmlFor="">Email</label>
          <input type="email" placeholder="Email" value={email} className={NewCollectionCSS.label_input}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div> */}

        <br />
        <input type="file" onChange={handleFileChange} />
        <br />
        {/* {imagePreview && <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%' }} />} */}
        <br />
        <button className={NewCollectionCSS.button} onClick={handleUpload}>Upload</button>

      </Container>
    </>
  );
};

export default NewCollection;