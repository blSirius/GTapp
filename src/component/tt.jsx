import { useState, useRef, useEffect } from "react";
import NavBar from "./nav/NavBar";
import { Button, Table, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
// import './style/tt.css'
import EditEmpCSS from './style/tt.module.css'
import Cropper from 'react-cropper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
// import NavBar from './nav/NavBar';
import * as faceapi from 'face-api.js';

const Example = () => {

  const { name } = useParams();
  const navigate = useNavigate()
  const [folderName, setFolderName] = useState(null)
  const [status, setStatus] = useState('on')
  const [alllabelname, setAlllabelname] = useState([])
  const [Emp, setEmp] = useState([])
  useEffect(() => {
    const getEmpDetail = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API + `/getEmployeeDetail/${name}`);
        console.log(res)
        setEmp(res.data)
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    getEmpDetail()
  }, []);

  useState(() => {
    const MODEL_URL = '/models';
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ])
    const getlabel = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API +'/api/labels');
        setAlllabelname(res.data);
        // console.log(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }
    getlabel();
  }, [alllabelname])
  const scrollableRef = useRef(null);
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
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

  const changeName = async () => {
    const isFolderNameDuplicate = alllabelname.some(testItem => folderName === testItem.label);
    if (isFolderNameDuplicate) {
      window.alert('ชื่อ Folder ซ้ำ');
      return; // หยุดการทำงานหากพบชื่อซ้ำ
    }
    if (!folderName) {
      window.alert('กรุณาใส่ชื่อ');
      return;
    }
    const oldFolderName = name; 
    const newFolderName = folderName;

    try {
      const response = await axios.post(import.meta.env.VITE_API + '/renameFolder', { oldName: oldFolderName, newName: newFolderName });
      console.log(response.data);
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
    try {
      const response = await axios.post(import.meta.env.VITE_API + '/updateEmployeeName', { oldName: oldFolderName, newName: newFolderName });
      console.log(response.data);
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
    navigate('/album')
  }
  const changeStatus = async () => {
    const statusSelect = document.getElementById('sta');
    const status = statusSelect.value;

    try {
      const res = await axios.post(import.meta.env.VITE_API + '/changeStatus', { folderName: name, status: status });
      console.log(res.data);
    } catch (error) {
      console.error('Error changing status:', error);
    }
    try {
      const response = await axios.post(import.meta.env.VITE_API + '/updateStatusDB', { folderName: name, status: status });
      console.log(response.data);
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
    navigate('/album')
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
    formData.append('croppedImage', blob, 'image.jpg'); // Ensure 'croppedImage' matches the server's expected field name
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
    }).toDataURL('image/jpg'));
  };

  useEffect(() => {
    checkScroll();
    const MODEL_URL = '/models';
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ])
    const getPic = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API + `/getFilePic/${name}`);
        if (Array.isArray(res.data)) {
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
          <div className={EditEmpCSS.conAll}>
         
              <div className={EditEmpCSS.fc}>
                <div className={EditEmpCSS.size1}>
                  <div>
                    <h3 htmlFor="">Name: {name}</h3>
                    <h4 >สถานะ: {Emp.status}</h4>
                  </div>
                </div>
                <div className={EditEmpCSS.conPic}>
                  <button className={EditEmpCSS.btnD} onClick={handleShow}>Add Image</button>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title >Upload Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <input className={EditEmpCSS.jm} type="file" onChange={handleFileChange} />
                      <div className='img-container'>
                        {image && (
                          <Cropper
                            src={image}
                            className='cropper-container'
                            initialAspectRatio={1}
                            guides={false}
                            crop={onCrop}
                            ref={cropperRef}
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
          
                    <div className="d-flex overflow-auto" style={{ alignItems: 'flex-end' }} ref={scrollableRef}>

                      {picpath.map((prod, key) => {
                        return <ProductCard Name={name} pathPic={prod} piclength={picpath.length} />
                      })}
                    </div>
                    {isScrollVisible ? <ScrollButtons onScroll={onScroll} /> : null}
               
                </div>
              </div>
              <div className={EditEmpCSS.sc}>

                <div className={EditEmpCSS.size}>
                  <div>
                    <h3 htmlFor="">Edit name: </h3>
                    <input
                      type="text"
                      placeholder="Name"

                      onChange={(e) => setFolderName(e.target.value)}
                      required />
                  </div>
                  <button style={{
                    marginTop: '20px',
                    marginBottom: '20px',
                    border: '0.3px solid gray'

                  }} onClick={changeName}>Edit</button>
                </div>
                <div className={EditEmpCSS.size}>
                  <div>
                    <h4 >Change status: </h4>
                    <select name="status" id="sta">
                      <option value="ON">ON</option>
                      <option value="OFF">OFF</option>
                    </select>
                  </div>
                  <button style={{
                    marginTop: '20px',
                    marginBottom: '20px',
                    border: '0.3px solid gray'
                  }} onClick={changeStatus}>Change</button>
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
    </div>
  );
};

const ProductCard = ({ Name, pathPic,piclength }) => {
  const getImagePath = (name, path) => {
    return import.meta.env.VITE_API + `/getImageFolder/${name}/${path}`;
  };
  const DeleteImg = async (name, path) => {
    if(piclength===1){
      window.alert('ต้องมีภาพอย่างน้อย 1 รูปภาพ')
      return
    }
    try {
      const response = await axios.delete(import.meta.env.VITE_API + `/deleteImage/${name}/${path}`);
      setPicpath(currentPaths => currentPaths.filter(p => p !== path));

      console.log(response.data);
      window.location.href = `/tt/${name}`;
    } catch (error) {
      console.error('Error deleting image:', error);
    }
    window.location.href = `/tt/${name}`;
  }
  return (
    <div className={EditEmpCSS.eleCard}>
      <div className={EditEmpCSS.in}>
        <img className={EditEmpCSS.imgCard} style={{ borderRadius: '0.5rem' }} src={getImagePath(Name, pathPic)} alt="" />

        <button className={EditEmpCSS.btnD} onClick={() => DeleteImg(Name, pathPic)}>Delete</button>
      </div>
    </div>
  );
};

export default Example;

