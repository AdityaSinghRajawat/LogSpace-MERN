import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login(props) {

    const host = 'http://localhost:5000'

    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json);

        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged in successfully", "success");
            navigate("/");

        }
        else {
            props.showAlert("Invalid credentials", "danger");
        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='mt-3'>

            <h2>Login to continue to LogSpace</h2>

            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name='email' id="email" onChange={onChange} aria-describedby="emailHelp" />
                    <div id="email" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="my-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' id="password" onChange={onChange} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
