import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(import.meta.env.VITE_API + '/register', {
                username,
                password,
                status,
            });

            console.log('User registered:', response.data);
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <>
            <Container>
                <h1>Registration</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Status:
                        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Register</button>
                </form>
            </Container>
        </>
    );
}

export default Register;
