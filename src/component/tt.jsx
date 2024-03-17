import { useState, useRef, useEffect } from "react";
import NavBar from "./nav/NavBar";
import { Button,Table, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import './style/tt.css'
import Cropper from 'react-cropper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft,faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
// import NavBar from './nav/NavBar';
import * as faceapi from 'face-api.js';

const Example = () => {
  const { name } = useParams();
  const navigate = useNavigate()
  const [detectt, setDetect] = useState([])
  useEffect(() => {
    const getDetect = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API + `/getEmpDetect/${name}`);
        if (Array.isArray(res.data)) {
          setDetect(res.data);
        } else {
          console.error('Data received is not an array:', res.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    getDetect()
  }, [name]);

  const getImagePath = (name, path) => {
    return import.meta.env.VITE_API + `/labeled_images/${path}`;
  };
  const scrollableRef = useRef(null);
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [data, setData] = useState([])
  const [picpath, setPicpath] = useState([])
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addImgtoFolder = async () => {

    const imageElement = cropperRef.current;
    const cropper = imageElement?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();
    const faceDetections = await faceapi.detectAllFaces(croppedCanvas);
    if (faceDetections.length === 0) {
      window.alert('No face detected in the image. Please upload an image with a face.');
      return;
    } else if (faceDetections.length > 1) {
      window.alert('More than one face detected in the image. Please upload an image with only one face.');
      return;
    }

    const response = await fetch(croppedImage);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('croppedImage', blob, 'image.png'); // Ensure 'croppedImage' matches the server's expected field name
    formData.append('folderName', name);
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

    window.location.href = `/tt/${name}`;

  };



  const onCrop = () => {
    if (!image) {
      window.alert('Please select a file before uploading.');
      console.error('Please select a file.');
      return;
    }
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
    }).toDataURL('image/png'));
    // Specify the image format if it's not already PNG
    //  if(croppedImage){
    //   addImgtoFolder()
    //  }


    // console.log(croppedImage)
  };

  useEffect(() => {
    checkScroll();
    const MODEL_URL = '/models';
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ])
    // const imgShow =  loadLabeledImages(name);
    const getPic = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API + `/getFilePic/${name}`);
        if (Array.isArray(res.data)) {
          // console.log(res.data)
          setPicpath(res.data);
        } else {
          console.error('Data received is not an array:', res.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    getPic()

  }, []);

  //show the scroll button if our main container is smaller than our content width
  //Basically when our scroll bar is shown in overflow auto


  const checkScroll = () => {
    if (
      scrollableRef &&
      scrollableRef.current &&
      scrollableRef.current.scrollWidth > scrollableRef.current.clientWidth
    ) {
      setIsScrollVisible(true);
    } else {
      setIsScrollVisible(false);
    }
  };

  const onScroll = (offset) => {
    if (scrollableRef) {
      scrollableRef.current.scrollLeft += offset;
    }
  };

  return (
    <>
      <NavBar />
    <Container>
      <div>

        <div className="conAll">

            <div className='tb'>
              <Table hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>Expression</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {detectt.map((data, key) => (

                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{data.expression}</td>
                      <td>{data.date}</td>
                      <td>{data.time}</td>
                      <td><img width={100} height={100} style={{ borderRadius: '0.5rem' }} src={getImagePath(name,data.path)} alt="" /></td>
                    </tr>
                  ))}
                </tbody>
              </Table>

            </div>

          <div className="conPic">
            <button className="btnD" onClick={handleShow}>Add Image</button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title >Upload Image</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input className="jm" type="file" onChange={handleFileChange} />

                <div className='img-container'>
                  {image && (
                    <Cropper
                      src={image}
                      className='cropper-container'
                      initialAspectRatio={1}
                      guides={false}
                      crop={onCrop}
                      ref={cropperRef}
                    // onChange={onCrop}
                    />
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={addImgtoFolder}>
                  Upload Image
                </Button>
              </Modal.Footer>
            </Modal>
            <div className="">
            <div className="d-flex overflow-auto" style={{ alignItems: 'flex-end' }} ref={scrollableRef}>

              {picpath.map((prod, key) => {
                return <ProductCard Name={name} pathPic={prod} />
              })}
            </div>
            {isScrollVisible ? <ScrollButtons onScroll={onScroll} /> : null}
            </div>
          </div>

        </div>
      </div>
      </Container>
    </>
  );
};

const ScrollButtons = ({ onScroll }) => {
  return (
    <div
      className="d-flex align-items-center mt-5"
      style={{ cursor: "pointer" }}
    >
      {/* <FontAwesomeIcon icon={faChevronCircleLeft} fontSize={20} onClick={() => onScroll(-50)} />
      <FontAwesomeIcon icon={faChevronCircleRight} fontSize={20} onClick={() => onScroll(50)} />   */}

    </div>
  );
};

const ProductCard = ({ Name, pathPic }) => {
  const getImagePath = (name, path) => {
    return import.meta.env.VITE_API + `/getImageFolder/${name}/${path}`;
  };
  console.log(pathPic)
  const DeleteImg = async (name, path) => {
    try {
      const response = await axios.delete(import.meta.env.VITE_API + `/deleteImage/${name}/${path}`);
      setPicpath(currentPaths => currentPaths.filter(p => p !== path));

      console.log(response.data);
      // If successful, do something here, like updating state or UI
      window.location.href = `/tt/${name}`; // This will refresh the page
    } catch (error) {
      console.error('Error deleting image:', error);
      // Handle errors here, such as showing a message to the user
    }
    window.location.href = `/tt/${name}`;
  }
  return (
    <div className="eleCard">
      <div className="in">
      <img className="imgCard" style={{ borderRadius: '0.5rem' }} src={getImagePath(Name, pathPic)} alt="" />

      <button className="btnD" onClick={() => DeleteImg(Name, pathPic)}>Delete</button>
      </div>
      {/* <div>{prodDetails.description}</div> */}
    </div>
  );
};

export default Example;

