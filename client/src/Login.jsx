import React, { useState } from 'react';
import './styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

function Login() {

  const [email,setemail] = useState();
  const [password,setpassword] = useState();
  const [username, setusername] = useState();
  const navigate = useNavigate();
  const [errmsg,seterrmsg] = useState('');

  const handleSubmit = (e) =>{
    e.preventDefault();
    axios.post('http://localhost:3001/login', {email,password})
    .then(result=>{
      console.log(result)
      if(result.data.status === 'success'){
        localStorage.setItem('username',result.data.user );
        localStorage.setItem('email',email );
        navigate('/menu')
      }
      else if(result.data.status === 'incorrect_password'){
        seterrmsg('Incorrect Password !')
      }
      else if(result.data.status === 'No_account_found'){
        seterrmsg('No account found !')
      }
    })
    .catch(err=>console.log(err))

  }



  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h3 className="text-center mb-4">Login</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
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
                <label htmlFor="password" className="form-label">Password</label>
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
                Login
              </button>
              <span className='errmsg'>{errmsg}</span>
            </form>
            <div className="text-center mt-3">
              <p>Don't have an account?</p>
              <Link to="/register" className="btn btn-secondary w-100">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
