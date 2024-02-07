import React, { useState, useEffect } from 'react';
import NavBar from './nav/NavBar';
import { Container, InputGroup, Form, Button, Table } from 'react-bootstrap';
import ViewCSS from './style/ViewEmp.module.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// import { useHistory ,} from 'react-router-dom';

function ViewEmp() {

  const { name } = useParams();
  const styletest = {
    textAlign: "center"
  }
  const [imageUrls, setImageUrls] = useState([]);
  const [detectt, setDetect] = useState([])
  useEffect(() => {
    const getDetect = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/getEmpDetect/${name}`);
        if (Array.isArray(res.data)) {
          setDetect(res.data);
        } else {
          console.error('Data received is not an array:', res.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    // const fetchImages = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:3000/getImageFolder/${encodeURIComponent(name)}`);
    //     setImageUrls(response.data);
    //   } catch (error) {
    //     console.error('Error fetching images:', error);
    //   }
    // };
    // fetchImages();


    getDetect()
  }, [name]);
  const getImagePath = (name, single_img) => {
    const trimmedName = name.trim();
    return `http://localhost:3000/getDetectedSingleFaceFolder/${encodeURIComponent(trimmedName)}/${single_img}`;
  };

  // const getImageFolder = (name) => {
  //   const trimmedName = name.trim();
  //   return `http://localhost:3000/getImageFolder/${encodeURIComponent(trimmedName)}`;
  // };
  // console.log(detail)
  // if (!detail) {
  //   return <div><NavBar />May be it has a BUG!!</div>;
  // }

  return (
    <div>
      <NavBar />
      <h1 style={styletest}>Labels</h1>
      {/* <Container>
        <div>
          {imageUrls.map((url, index) => (
            
            <img key={index} src={url} alt={`Employee ${name} ${index + 1}`} style={{ margin: '10px' }} />
          ))}
        </div>
      </Container> */}
      <h1 style={styletest}>History</h1>
      <Container>
        <div className={ViewCSS.table}>
          <Table hover>
            <thead>
              <tr>
                <th></th>
                {/* <th>Name</th>  */}
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
                  <td><img width={100} height={100} style={{ borderRadius: '0.5rem' }} src={getImagePath(data.name, data.single_img)} alt="" /></td>
                </tr>
              ))}
            </tbody>
          </Table>

        </div>
      </Container>
    </div>
  );
}

export default ViewEmp;