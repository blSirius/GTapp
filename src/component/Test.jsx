import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import NavBar from './nav/NavBar';
import NewCollectionCSS from './style/NewCollection.module.css';
import ReactDOM from 'react-dom'
import Avatar from 'react-avatar-edit'
import 'cropperjs/dist/cropper.css';
// import './CropperStyles.module.css';

const Test = () => {

    const [file, setFile] = useState(null);
    const [folderName, setFolderName] = useState('');
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const cropperRef = useRef(null);
  
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
          fillColor: '#fff',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        }).toDataURL());
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
        if (!croppedImage) {
            window.alert('Please select a file before uploading.');
          console.error('Please select a file.');
          return;
        }
    
        createEmployeeFolder();
        createEmployeeDB();
      };
    
      const createEmployeeDB = async () => {
        try {
          const res = await axios.post('http://localhost:3000/createEmployee', { name});
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
      <NavBar/>
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
          />
        </div>
        <input type="file" onChange={handleFileChange} />
        <div></div>
        <button style={{marginTop: '20px',marginBottom: '20px'}}
         onClick={handleUpload}>Upload</button>
        {image && (
          <Cropper
            src={image}
            className={NewCollectionCSS['cropper-container']}
            style={{ height: 400, width: '100%' }}
            initialAspectRatio={1}
            guides={false}
            crop={onCrop}
            ref={cropperRef}
          />
        )}
        
        {croppedImage && (
          <div>
            <h3>Cropped Image:</h3>
            <img src={croppedImage} className={NewCollectionCSS.croppedImage} alt="Cropped" />
          </div>
        )}

        </Container>
      </>
    );
  };

export default Test;