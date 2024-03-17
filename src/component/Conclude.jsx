import React from 'react'
import { useState, useRef, useEffect } from "react";
import NavBar from "./nav/NavBar";
import { Button, Table, Container, Pagination } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import './style/conclude.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faCalendarAlt, faChartLine, faUser, faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Conclude() {
    const [dateStart, setDateStart] = useState(null)
    const [dateStop, setDateStop] = useState(null)
    const [his, setHis] = useState([])
    const scrollRef = useRef(null);
    const [chartData, setChartData] = useState({
        datasets: [],
    });
    const chartOptions = {
        scales: {
            x: {
                barThickness: 20, // Use this to set the thickness of the bar
                categoryPercentage: 0.5, // Alternatively, adjust the category percentage
                barPercentage: 0.5, // and the bar percentage
            }
        },
        // Additional customization options can be added here
    };
    const ChartData = () =>{
        const expressionCounts = his.reduce((acc, { expression }) => {
            acc[expression] = (acc[expression] || 0) + 1;
            return acc;
        }, {});

        const data = {
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

        setChartData(data);
    
    }
    useEffect(() => {
        const expressionCounts = his.reduce((acc, { expression }) => {
            acc[expression] = (acc[expression] || 0) + 1;
            return acc;
        }, {});

        const data = {
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

        setChartData(data);
    }, [his]);

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

        getAllhistory()
        
 
    }, [dateStart, dateStop])
    const [employee, setEmployee] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employee.slice(indexOfFirstEmployee, indexOfLastEmployee);

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
            if (!dateStart || (!dateStop && !dateStart)) {
                console.log('no date');
                return;
            }
            // console.log(dateStart);
            // console.log(dateStop);
            const url = new URL(import.meta.env.VITE_API + '/getAllhistoryByDate');
            url.searchParams.append('dateStart', dateStart);
            url.searchParams.append('dateStop', dateStop); // Corrected line
            const res = await axios.get(url.toString());
            console.log(res.data)
            // setHis(res.data); // This triggers the useEffect hook that depends on `his`, which should update the chart data.
        } catch (err) {
            console.log('ERROR IS', err.message);
        }
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
                                {employee.length}
                            </h3>
                            <p className="fs-5">Employee </p>
                        </div>
                        <FontAwesomeIcon className='faUser' size='4x' icon={faUser} />
                    </div><div className="test p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                        <div className="text-center mt-3">

                            <h3 className="fs-2 ">
                                {employee.length}
                            </h3>
                            <p className="fs-5">Employee </p>
                        </div>
                        <FontAwesomeIcon className='faUser' size='4x' icon={faUser} />
                    </div>

                </div>
                <div className='scon allcon'>
                    {employee ? (

                        <div className='conTB' >
                            <div>
                                <Table className="table" hover>
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
                        <input onChange={(e) => setDateStart(e.target.value)} type='date' />
                        <label> -</label>
                        <input onChange={(e) => setDateStop(e.target.value)} type='date' />
                        <FontAwesomeIcon onClick={filterbydate} icon={faSearch} />
                        {chartData.datasets.length > 0 && (
                            <Bar  data={chartData}
                                options={chartOptions}
                            />
                        )}
                        {/* <input type='text' /> */}
                    </div>
                </div>



            </div>
        </div>
    )
}
