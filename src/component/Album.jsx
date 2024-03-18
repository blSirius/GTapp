import React, { useState, useEffect } from 'react'
import NavBar from './nav/NavBar'
import { Container, Pagination, InputGroup, Form, Button, Table } from 'react-bootstrap'
import AlbumCSS from './style/Album.module.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'


function Album() {
    const [employeeoff, setEmployeeoff] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageOff, setCurrentPageOff] = useState(1);
    const [employeesPerPage] = useState(5);
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employee.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const indexOfLastEmployeeOff = currentPageOff * employeesPerPage;
    const indexOfFirstEmployeeOff = indexOfLastEmployeeOff - employeesPerPage;
    const currentEmployeesOff = employeeoff.slice(indexOfFirstEmployeeOff, indexOfLastEmployee);
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const paginateOff = (pageNumber) => setCurrentPageOff(pageNumber);

    useEffect(() => {
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
        const getEmployeeOff = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_API + '/getEmployeeOff');
                setEmployeeoff(res.data);
                // console.log(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getEmployee();
        getEmployeeOff();
    }, [employee])
    const [employeeStatuses, setEmployeeStatuses] = useState(() =>
        currentEmployeesOff.reduce((acc, employee) => {
            acc[employee.employee_id] = employee.status; // Assuming each employee has a unique employee_id
            return acc;
        }, {})
    );
    const changeStatus = async (employee) => {
        const statusSelect = document.querySelector(`#status-${employee.employee_id}`);
        const newStatus = statusSelect.value;

        if (newStatus === 'ON') {
            if (window.confirm('Are you sure you want to change the status back to ON?')) {
                try {
                    const res = await axios.post(import.meta.env.VITE_API + '/changeStatus', {
                        folderName: employee.employee_name,
                        status: newStatus,
                    });
                    console.log(res.data);

                    // Assuming you want to navigate somewhere after status change
                    // navigate('/album'); 
                } catch (error) {
                    console.error('Error changing status:', error);
                }
                try {
                    const response = await axios.post(import.meta.env.VITE_API + '/updateStatusDB', { folderName: employee.employee_name, status: 'ON' });
                    console.log(response.data);
                    navigate('/album')
                    // Handle any additional UI updates or notifications here
                  } catch (error) {
                    console.error('Error renaming folder:', error);
                    // Handle displaying the error to the user here
                  }
            } else {
                // If the user cancels the confirmation, revert the select to 'OFF'
                statusSelect.value = 'OFF';
            }
        } else {
            // Handle the 'OFF' case as needed
        }

        // Update the employeeStatuses state to reflect the new status
        setEmployeeStatuses((prevStatuses) => ({
            ...prevStatuses,
            [employee.employee_id]: newStatus,
        }));
    };

    return (
        <div>
            <NavBar />
            <Container>

                <div className={AlbumCSS.newCollectionBtn} >
                    <Button href="/newCollection" variant='primary' >New Collection <FontAwesomeIcon icon={faPlus} /></Button>
                </div>
                <div className={AlbumCSS.bigcontainer}>
                    {employee ? (
                        <div className={AlbumCSS.tb1container}>
                            <Table hover>
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
                                                <Button href={`/tt/${data.employee_name}`} variant='success' style={{ width: '80%' }}>
                                                    <FontAwesomeIcon icon={faPen} />
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
                    ) : ''}
                    {employee ? (
                        <div className={AlbumCSS.tb1container}>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th ></th>
                                        <th>Name</th>
                                        <th colSpan={3}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEmployeesOff.map((data, key) => (
                                        <tr key={key}>
                                            <td>{indexOfFirstEmployeeOff + key + 1}</td>
                                            <td>{data.employee_name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <select name="status" id={`status-${data.employee_id}`} value={employeeStatuses[data.employee_id]} onChange={() => changeStatus(data)}>
                                                    <option value="OFF">off</option>
                                                    <option value="ON">on</option>
                                                </select>
                                            </td>
                                            {employeeStatuses[data.employee_id] === 'ON' && (
                                                <td style={{ textAlign: 'center' }}>
                                                    <Button onClick={() => changeStatus(data, data.employee_name)} style={{ backgroundColor: 'green', width: '80%' }}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </Button>
                                                </td>
                                            )}
                                            <td style={{ textAlign: 'center' }}>
                                                <Button href={`/tt/${data.employee_name}`} variant='success' style={{ backgroundColor: 'red', width: '80%' }}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div className="pagination-container">
                                <Pagination>
                                    {[...Array(Math.ceil(employeeoff.length / employeesPerPage)).keys()].map(number => (
                                        <Pagination.Item key={number + 1} active={number + 1 === currentPageOff} onClick={() => paginateOff(number + 1)}>
                                            {number + 1}
                                        </Pagination.Item>
                                    ))}
                                </Pagination>
                            </div>



                        </div>
                    ) : ''}


                </div>
            </Container>
        </div>

    )
}

export default Album