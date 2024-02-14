import React, { useState, useEffect } from 'react'
import NavBar from './nav/NavBar'
import { Container, InputGroup, Form, Button, Table } from 'react-bootstrap'
import AlbumCSS from './style/Album.module.css'
import axios from 'axios'


function Album() {

    const [employee, setEmployee] = useState([]);
    const styletest = {
        textAlign: "center"
    }
    useState(() => {
        const getEmployee = async () => {
            try {
                const res = await axios.get('http://localhost:3000/getEmployee');
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
                    <div className={AlbumCSS.table}>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                        
                                    {/* <th>Email</th> */}
                                    <th style={styletest} colSpan="2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employee.map((data, key) => (
                                    
                                    <tr key={key}>
                                        <td>{key+1}</td>
                                        <td>{data.employee_name}</td>

                                        {/* <td>{data.employee_email}</td> */}
                                        <td style={{ textAlign: 'center' }}>
                                        <Button href={`/viewEmp/${data.employee_name}`} variant='success' style={{ width: '80%' }}>View</Button>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Button href={`/deleteEmp/${data.employee_id}`} variant='danger' style={{ width: '80%' }}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ) : ''}




            </Container>
        </div>
    )
}

export default Album