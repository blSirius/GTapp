import React, { useState, useEffect, useRef } from 'react'
import NavBar from './nav/NavBar'
import { Button, Container, Pagination, Table } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './style/Search.css';
import { Pie, Bar } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

function Search() {
  const [his, setHis] = useState([])
  const scrollRef = useRef(null);
  const [detectt, setDetect] = useState([])
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  useEffect(() => {
    const expressionCounts = detectt.reduce((acc, { expression }) => {
      acc[expression] = (acc[expression] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(expressionCounts),
      datasets: [
        {
          data: Object.values(expressionCounts),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#AEBE51',
            '#0EFE51',
            '#00FFFF',
            // Add more colors as needed
          ],
        },
      ],
    };

    setChartData(data);
  }, [detectt]);

  const [employee, setEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = detectt.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useState(() => {
    const getEmployee = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API + '/getEmployee');
        setEmployee(res.data);
        console.log(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }
    getEmployee();
  }, [employee])


  const { name } = useParams();
  // console.log(name)
  const styletest = {
    textAlign: "center"
  }
  const [imageUrls, setImageUrls] = useState([]);

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
  const getImagePath = (single_img) => {
    console.log(single_img)
    return import.meta.env.VITE_API + `/labeled_images/${single_img}`;
  };

 
  return (
    <>
      <NavBar />
      <Container>


      <div className='ac'>
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
              {currentEmployees.map((data, key) => (

                <tr key={key}>
                  <td>{key + 1}</td>
                  <td>{data.expression}</td>
                  <td>{data.date}</td>
                  <td>{data.time}</td>
                  <td><img  style={{ borderRadius: '0.5rem' }} src={getImagePath(data.path)} alt="" /></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(Math.ceil(detectt.length / employeesPerPage)).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
        <div>
          <div>
          <h3>Expression Breakdown</h3>
          {chartData.datasets.length > 0 && (
            <Pie data={chartData} />
          )}
            </div>
            <div></div>
        </div>
      </div>
      </Container>
    </>
  );
}
export default Search