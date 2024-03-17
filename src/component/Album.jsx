import React, { useState, useEffect } from 'react'
import NavBar from './nav/NavBar'
import { Container, Pagination,InputGroup, Form, Button, Table } from 'react-bootstrap'
import AlbumCSS from './style/Album.module.css'
import axios from 'axios'


function Album() {

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
                console.log(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getEmployee();
    }, [employee])


    return (
        <div>
            <NavBar />
            <Container>

                <div className={AlbumCSS.newCollectionBtn} >
                    <Button href="/newCollection" variant='primary' >New Collection</Button>
                </div>
        
                {employee ? (
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
                                              <Button href={`/tt/${data.employee_name}`} variant='success' style={{ width: '80%' }}>
                                                  {/* <FontAwesomeIcon icon={faChartLine} /> */}
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




            </Container>
        </div>
    )
}

export default Album