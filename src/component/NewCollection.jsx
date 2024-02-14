import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import NavBar from './nav/NavBar';
import NewCollectionCSS from './style/NewCollection.module.css';

const NewCollection = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // Re-add this state for the image preview
  // const [email, setEmail] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [square, setSquare] = useState({ x: 0, y: 0, size: 50 }); // Default square state

  // const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (imagePreview && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = new Image();
      
      // When the image is loaded, draw it on the canvas
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        
        // Draw a square based on the square state
        ctx.beginPath();
        ctx.rect(square.x, square.y, square.size, square.size);
        ctx.strokeStyle = 'red';
        ctx.stroke();
      };

      // Set the source of the image to be the image preview URL
      image.src = imagePreview;
    }
  }, [imagePreview, square]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    setStartPoint({ x: offsetX, y: offsetY });
  };

  const drawSquare = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    // Calculate the size based on the distance from the starting point
    const size = Math.max(Math.abs(offsetX - startPoint.x), Math.abs(offsetY - startPoint.y));
    setSquare({ x: startPoint.x, y: startPoint.y, size });
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Create a URL for the file
    const previewURL = URL.createObjectURL(selectedFile);
    setImagePreview(previewURL); // Update the image preview URL
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
      <NavBar />
      <Container className={NewCollectionCSS.container} >
        <div style={{ marginTop: '100px' }} ></div>
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

        <br />
        <input type="file" onChange={handleFileChange} />
        <br />
        <br />
        <canvas 
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={drawSquare}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          className={NewCollectionCSS.canvas}
        />
        {/* {imagePreview && (
          <img
            src={imagePreview}
            alt="Image Preview"
            className={NewCollectionCSS.imagePreview} // You might need to add some CSS for this
          />
        )} */}
        {/* Image preview will be shown here */}
        <button className={NewCollectionCSS.button} onClick={handleUpload}>Upload</button>
      </Container>
    </>
  );
};

export default NewCollection;