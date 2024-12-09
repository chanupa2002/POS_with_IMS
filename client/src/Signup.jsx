import React, { useState } from 'react';
import './styles/signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios'


function Signup() {

    const[name,setname] = useState();
    const[email,setemail] = useState();
    const[password,setpassword] = useState();

    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.post('http://localhost:3001/register', {name, email, password})
        .then(result=>console.log(result))
        .catch(err=>console.assertlog(err))
    }


  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h3 className="text-center mb-4">Sign Up</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your name"
                    required
                    onChange={(e)=>setname(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    required
                    onChange={(e)=>setemail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    required
                    onChange={(e)=>setpassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Sign Up
                </button>
              </form>
              <div className="text-center mt-3">
                <p>Already have an account?</p>
                <Link to="/login" className="btn btn-secondary">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
