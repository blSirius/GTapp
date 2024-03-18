import React from 'react'
import { useState, useRef, useEffect } from "react";
import NavBar from "./nav/NavBar";
import { Button, Table, Container, Pagination } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import './style/conclude.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faMagnifyingGlass,faQuestion,faLock, faChartLine, faUser, faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import Modal from 'react-bootstrap/Modal';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Conclude() {
    const [yester,setYester] = useState(false)
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [dateStart, setDateStart] = useState(null)
    const [dateStop, setDateStop] = useState(null)
    const [his, setHis] = useState([])
    const [tableex, setTableEx] = useState([])
    const scrollRef = useRef(null);
    const [employeeoff, setEmployeeoff] = useState([]);
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    const searchOnData = async () => {
        let nameOn = document.getElementById('on').value


        try {
            const url = new URL(import.meta.env.VITE_API + '/getEmployee');
            url.searchParams.append('name', nameOn);
            const res = await axios.get(url.toString());
            setEmployee(res.data);
            // console.log(res.data);
        }
        catch (err) {
            console.log(err);
        }

    }


    const handleShow = async (label) => {
        
        try {
            const startDate = document.getElementById('d1').value;
            const stopDate = document.getElementById('d2').value;
            const url = new URL(import.meta.env.VITE_API + '/getAllhistoryByDate');
            url.searchParams.append('dateStart', startDate);
            if (stopDate) {
                url.searchParams.append('dateStop', stopDate);
            }
            url.searchParams.append('emotion', label);
            const res = await axios.get(url.toString());
            // console.log(res.data)
            // Now we update the state and then immediately update the chart data
            if (res.data) {
                // console.log(res.data)
                setTableEx(res.data);
             } 
            else {
                setTableEx([]);
            }
        } catch (err) {
            console.log('Error fetching data:', err.message);
        }
        setShow(true)
    };
    const getImagePath = (single_img) => {
        // console.log(single_img)
        return import.meta.env.VITE_API + `/labeled_images/${single_img}`;
      };
    const chartOptions = {
        onClick: (event, elements, chart) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const label = chart.data.labels[index];
                handleShow(label)
                // alert(`${label}`);

            }
        },
    };
    useEffect(() => {
        // if(his.length==0){
        //     setHis([])
        //     return
        // }
        const expressionCounts = his.reduce((acc, { expression }) => {
            acc[expression] = (acc[expression] || 0) + 1;
            return acc;
        }, {});

        const data = {
            labels: Object.keys(expressionCounts),
            datasets: [
                {
                    label: 'Total Expressions',
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
    }, [his]);
    const [cunk,setCunk] = useState('0')
    useEffect(() => {
        const getAllhistory = async () => {
            try {
                // Constructing the URL with query parameters
                const url = new URL(import.meta.env.VITE_API + '/getAllhistory');
                // console.log(dateStart)
                // if (dateStart) url.searchParams.append('dateStart', dateStart);
                // if (dateStop) url.searchParams.append('dateStop', dateStop);

                const res = await axios.get(url.toString());
                setHis(res.data);
                // console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        const getEmployeeOff = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_API + '/getEmployeeOff');
                setEmployeeoff(res.data.length);
                // console.log(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        const getUnknown = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_API + '/getUnknownDetect');
                setCunk(res.data.length);
                console.log(res.data.length);
            }
            catch (err) {
                console.log(err);
            }
        }

        getAllhistory()
        getEmployeeOff()
        getUnknown()



    }, [])
    const [employee, setEmployee] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employee.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const [currentPageEx, setCurrentPageEx] = useState(1);
    const indexOfLastEx = currentPageEx * employeesPerPage;
    const indexOfFirstEx = indexOfLastEx - employeesPerPage;
    const currentEx = tableex.slice(indexOfFirstEx, indexOfLastEx);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    useState(() => {
        const getEmployee = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_API + '/getEmployee');
                setEmployee(res.data);
                // console.log(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getEmployee();
    }, [])
    const filterbydate = async () => {
        try {
            const startDate = document.getElementById('d1').value;
            const stopDate = document.getElementById('d2').value;
            if (!startDate) {
                console.log('No start date provided');
                return;
            }
            if (startDate > stopDate && stopDate) {
                alert('Start date cannot be greater than end date.');
                console.log('ngo');
                return
            }
            const url = new URL(import.meta.env.VITE_API + '/getAllhistoryByDate');
            url.searchParams.append('dateStart', startDate);
            if (stopDate) {
                url.searchParams.append('dateStop', stopDate);
            }
            const res = await axios.get(url.toString());

            // Now we update the state and then immediately update the chart data
            if (res.data) {
                setHis(res.data, () => {
                    // This callback ensures we are working with the updated state
                    updateChartData(res.data); // We'll define this function next
                });
            } else {
                setHis([]);
            }
        } catch (err) {
            console.log('Error fetching data:', err.message);
        }
    };

    const updateChartData = (historyData) => {
        const expressionCounts = historyData.reduce((acc, { expression }) => {
            acc[expression] = (acc[expression] || 0) + 1;
            return acc;
        }, {});

        const newData = {
            labels: Object.keys(expressionCounts),
            datasets: [
                {
                    label: 'Number of Expressions',
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

        setChartData(newData);
    };

    return (
        <div>
            <NavBar />

            <div className='tt'>

                <div className='fcon allcon'>
                    <div className="test p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                        <div className="text-center mt-3">

                            <h3 className="fs-2 ">
                                {employee.length}
                            </h3>
                            <p className="fs-5">Employee </p>
                        </div>
                        <FontAwesomeIcon className='faUser' size='4x' icon={faUser} />
                    </div>
                    <div className="test p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                        <div className="text-center mt-3">

                            <h3 className="fs-2 ">
                                {his.length}
                            </h3>
                            <p className="fs-5">Detections </p>
                        </div>
                        <FontAwesomeIcon className='faUser' size='4x' icon={faFaceSmile} />
                    </div><div className="test p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                        <div className="text-center mt-3">

                            <h3 className="fs-2 ">
                                {employeeoff ? employeeoff : '0'}
                            </h3>
                            <p className="fs-5">Off Status </p>
                        </div>
                        <FontAwesomeIcon className='faUser' size='4x' icon={faLock} />
                    </div><div className="test p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                        <div className="text-center mt-3">

                            <h3 className="fs-2 ">
                            {cunk ? cunk : 0}
                            </h3>
                            <p className="fs-5">Unknown Detect</p>
                        </div>
                        <FontAwesomeIcon className='faUser' size='4x' icon={faQuestion} />
                    </div>

                </div>
                <div className='scon allcon'>
                    {employee ? (

                        <div className='conTB' >
                            <div>
                            <div className='inin'>
                                <input id='on' placeholder='Search' style={{ width: '70%'}} type='text' />
                                <Button style={{ width: '10%', margin: '1rem' }} onClick={searchOnData} ><FontAwesomeIcon  icon={faMagnifyingGlass} /> </Button>
                            </div>
                                <Table className="tablef" hover>
                                    <thead>
                                        <tr>
                                            <th ></th>
                                            <th>Name</th>
                                            <th >Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentEmployees.map((data, key) => (
                                            <tr key={key}>
                                                <td>{indexOfFirstEmployee + key + 1}</td>
                                                <td>{data.employee_name}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <Button href={`/history/${data.employee_name}`} variant='success' style={{ width: '80%' }}>
                                                        <FontAwesomeIcon icon={faChartLine} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <div className="pagination-container">
                                    <Pagination>
                                        {[...Array(Math.ceil(employee.length / employeesPerPage)).keys()].map(number => (
                                            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                                                {number + 1}
                                            </Pagination.Item>
                                        ))}
                                    </Pagination>
                                </div>
                            </div>

                        </div>


                    ) : ''}

                    <div className='ch'>
                        <label>Date Length:</label>
                        <input id='d1' value={dateStart} onChange={(e) => setDateStart(e.target.value)} type='date' />
                        <label> -</label>
                        <input id='d2' value={dateStop} onChange={(e) => setDateStop(e.target.value)} type='date' />
                            <Button   onClick={filterbydate} style={{ width: '10%', marginLeft: '1rem' }}> <FontAwesomeIcon icon={faSearch} /></Button>
                        {chartData.datasets.length > 0 && (
                            <Bar data={chartData}
                                options={chartOptions}
                            />

                        )}

                    </div>
                    <Modal className='modalTest' show={show} onHide={handleClose}>
                        <Modal.Header className='modalBody' closeButton>
                            <Modal.Title >{/*currentEx[0].expression ? currentEx[0].expression :''*/} Expression Table</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                        
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        {/* <th>Exression</th> */}
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEx.map((data, key) => (

                                        <tr key={key}>
                                            <td>{key + 1}</td>
                                            <td>{data.name}</td>
                                            {/* <td>{data.expression}</td> */}
                                            <td>{data.date}</td>
                                            <td>{data.time}</td>
                                            <td><img style={{ borderRadius: '0.5rem' }} src={getImagePath(data.path)} alt="" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div className="pagination-container">
                                <Pagination>
                                    {[...Array(Math.ceil(tableex.length / employeesPerPage)).keys()].map(number => (
                                        <Pagination.Item key={number + 1} active={number + 1 === currentPageEx} onClick={() => paginate(number + 1)}>
                                            {number + 1}
                                        </Pagination.Item>
                                    ))}
                                </Pagination>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>



            </div>
        </div>
    )
}
