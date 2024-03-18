import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import NavBar from './nav/NavBar';
import NewCollectionCSS from './style/NewCollection.module.css';
// import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import { useNavigate } from "react-router-dom";


import ReactDOM from 'react-dom'
import Avatar from 'react-avatar-edit'
import 'cropperjs/dist/cropper.css';

const NewCollection = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);
  const [test, setTest] = useState([])
  const navigate = useNavigate()
  useState(() => {
    const getlabel = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API + '/api/labels');
        setTest(res.data);
        // console.log(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }
    getlabel();
  }, [test])



  const onCrop = () => {
    const imageElement = cropperRef.current;
    const cropper = imageElement?.cropper;
    setCroppedImage(cropper.getCroppedCanvas({
      width: 300, // Set the width of the cropped canvas
      height: 300, // Set the height of the cropped canvas
      minWidth: 100,
      minHeight: 100,
      maxWidth: 4096,
      maxHeight: 4096,
      fillColor: 'transparent', // Changed from '#fff' to 'transparent'
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    }).toDataURL('image/jpg')); // Specify the image format if it's not already PNG
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!folderName) {
      window.alert('Please enter name.');
      return;
    }
    if (!croppedImage) {
      window.alert('Please select a file before uploading.');
      console.error('Please select a file.');
      return;
    }

    const isFolderNameDuplicate = test.some(testItem => folderName === testItem.label);
    if (isFolderNameDuplicate) {
      window.alert('ชื่อ Folder ซ้ำ');
      return; // หยุดการทำงานหากพบชื่อซ้ำ
    }
    createEmployeeFolder();
    createEmployeeDB();
    // go to <Album />

    // navigate('/album')

  };

  const createEmployeeDB = async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_API + `/createEmployee/${folderName}`);
      console.log('create db successfully', res);
    }
    catch (err) {
      console.log('fail to create db', err.message);
    }
  }

  const createEmployeeFolder = async () => {
    const response = await fetch(croppedImage);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('croppedImage', blob, 'image.jpg'); // Ensure 'croppedImage' matches the server's expected field name
    formData.append('folderName', folderName);
    console.log(Array.from(formData));
    try {
      const response = await axios.post(import.meta.env.VITE_API + '/updateImageFolder', formData, {
        headers: {
          // Axios will set the correct content type for multipart/form-data automatically
        },
      });
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        <div style={{ marginTop: '50px' }} ></div>
        <div>
          <label htmlFor="">Name, folderName</label>
          <input
            type="text"
            placeholder="Name"
            value={folderName}
            className={NewCollectionCSS.label_input}
            onChange={(e) => setFolderName(e.target.value)}
            required />
        </div>
        <input type="file" onChange={handleFileChange} />

        <button style={{ marginTop: '20px', marginBottom: '20px' }}
          onClick={handleUpload}>Upload</button>
  <div className={NewCollectionCSS['img-container']}>
  {/* This div contains the original image with the cropper */}
  <div>
    <h3>Uncrop Img</h3>
    {image && (
      <Cropper
        src={image}
        className={NewCollectionCSS['cropper-container']}
        initialAspectRatio={1}
        guides={false}
        crop={onCrop}
        ref={cropperRef}
      />
    )}
  </div>

  {/* This div contains the cropped image */}
  {croppedImage && (
    <div>
      <h3>Cropped Image:</h3>
      <img src={croppedImage} className={NewCollectionCSS['croppedImage']} alt="Cropped" />
    </div>
  )}
</div>
      </Container>
    </>
  );
};

export default NewCollection;