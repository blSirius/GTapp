import React, { useState, useEffect } from 'react';
import NavBar from './nav/NavBar';
import { Container, InputGroup, Form, Button, Table } from 'react-bootstrap';
import AlbumCSS from './style/Album.module.css';
import axios from 'axios';
import { useParams,useNavigate  } from 'react-router-dom';
// import { useHistory ,} from 'react-router-dom';

function ViewEmp() {
  
  const { empID } = useParams();
  const [detail, setDetail] = useState(null);
  // const navigate = useNavigate();
  
  // if (!empID) {
  //   navigate('/album')
  // }
  useEffect(() => {
    const getEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/getEmployeeDetail/${empID}`);
        setDetail(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getEmployee();
  }, [empID]);
  console.log(detail)
  if (!detail) {
    return <div><NavBar />May be it has a BUG!!</div>;
  }

  return (
    <div>
      <NavBar />
      {/* Accessing properties directly since it's a single object */}
      <p>{detail.employee_name}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default ViewEmp;