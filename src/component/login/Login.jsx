import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useUserAuth } from '../../context/UserAuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useUserAuth();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/home');
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Container>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                </form>
            </Container>
        </>
    );
}
export default Login;