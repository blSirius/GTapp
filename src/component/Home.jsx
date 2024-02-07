// import React from 'react'
import ViewCSS from './style/ViewEmp.module.css';
import NavBar from './nav/NavBar'
import { Container, Table } from 'react-bootstrap'
import { useUserAuth } from '../context/UserAuthContext';
import styles from './style/HomeStyle.module.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
function Home() {
    const { user } = useUserAuth();
    const [detect, setDetect] = useState([]);
    useEffect(() => {
        const getDetect = async () => {
            try {
                const res = await axios.get('http://localhost:3000/getFaceDetectedHome');
                setDetect(res.data);
                console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getDetect();
    }, []);
    const getImagePath = (name, single_img) => {
        const trimmedName = name.trim();
        return `http://localhost:3000/getDetectedSingleFaceFolder/${encodeURIComponent(trimmedName)}/${single_img}`;
    };
    return (
        <>
            <NavBar />
            <div>
                
      
                    <Container>
                        <div className={ViewCSS.table}>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th> 
                                        <th>Expression</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detect.map((data, key) => (

                                        <tr key={key}>
                                            <td>{key + 1}</td>
                                            <td>{data.name}</td>
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
        </>
    )
}

export default Home