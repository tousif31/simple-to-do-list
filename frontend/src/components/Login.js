import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/login', values);
      if (response.data.Status === 'Success') {
        localStorage.setItem('token', response.data.Token);
        navigate('/home');
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      console.log(err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="bg-white p-3 rounded w-25">
        <h2 className="text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Log in
          </button>
          <p className="mt-3">Don't have an account?</p>
          <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;