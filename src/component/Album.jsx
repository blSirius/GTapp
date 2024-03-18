import React, { useState, useEffect } from 'react'
import NavBar from './nav/NavBar'
import { Container, Pagination, InputGroup, Form, Button, Table } from 'react-bootstrap'
import AlbumCSS from './style/Album.module.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLockOpen, faCheck, faMagnifyingGlass, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'


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
                console.log(res.data);
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
    }, [])
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
    const searchOffData = async () => {
        let nameOn = document.getElementById('off').value


        try {
            const url = new URL(import.meta.env.VITE_API + '/getEmployeeOff');
            url.searchParams.append('name', nameOn);
            const res = await axios.get(url.toString());
            setEmployeeoff(res.data);
            // console.log(res.data);
        }
        catch (err) {
            console.log(err);
        }

    }
    const changeStatus = async (employee) => {
        if (window.confirm('Are you sure you want to change the status back to ON?')) {
            try {
                const res = await axios.post(import.meta.env.VITE_API + '/changeStatus', {
                    folderName: employee.employee_name,
                    status: 'ON',
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
            navigate('/album')
        }

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
                            <div className='inin'>
                                <input id='on' placeholder='Search' style={{ width: '70%' }} type='text' />
                                <Button style={{ width: '10%', margin: '1rem' }} ><FontAwesomeIcon onClick={searchOnData} icon={faMagnifyingGlass} /> </Button>
                            </div>


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
                    {employeeoff ? (
                        <div className={AlbumCSS.tb1container}>
                            <div className='inin'>
                                <input id='off' placeholder='Search' style={{ width: '70%' }} type='text' />
                                <Button style={{ width: '10%', margin: '1rem' }} ><FontAwesomeIcon onClick={searchOffData} icon={faMagnifyingGlass} /> </Button>
                            </div>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th ></th>
                                        <th>Name</th>
                                        <th colSpan={2}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEmployeesOff.map((data, key) => (
                                        <tr key={key}>
                                            <td>{indexOfFirstEmployeeOff + key + 1}</td>
                                            <td>{data.employee_name}</td>
                                            <td>
                                                <Button onClick={() => changeStatus(data, data.employee_name)} style={{ backgroundColor: 'green', width: '80%' }}>
                                                    <FontAwesomeIcon icon={faLockOpen} />
                                                </Button>
                                            </td>

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
                    ) : 'No status OFF'}


                </div>
            </Container>
        </div>

    )
}

export default Album