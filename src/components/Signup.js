import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Signup(props) {

    const host = 'http://localhost:5000'

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password } = credentials;

        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        console.log(json);

        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Account created successfully", "success");
            navigate("/");

        }
        else {
            props.showAlert("Invalid Details", "danger");
        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='mt-2'>

            <h2>Create an account to use LogSpace</h2>

            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" name='name' id="name" onChange={onChange} />
                </div>
                <div className="my-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name='email' id="email" onChange={onChange} aria-describedby="emailHelp" />
                    <div id="email" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="my-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' id="password" minLength={5} required onChange={onChange} />
                </div>
                <div className="my-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name='cpassword' id="cpassword" minLength={5} required onChange={onChange} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
