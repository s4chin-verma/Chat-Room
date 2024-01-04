import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify"
import { loginRoute } from '../utils/APIRoutes'
import axios from 'axios'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'react-toastify/dist/ReactToastify.css'
import Navbar from "../components/NavBar"
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox
}
  from 'mdb-react-ui-kit';

export default function Login() {

  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });

        if (data.status === true) {
          localStorage.setItem('chat-user', JSON.stringify(data.user));
          localStorage.setItem('chat-token', JSON.stringify(data.token));
          setTimeout(() => {
            localStorage.clear();
          }, 100000);
          navigate('/');
        }
      } catch (error) {
        toast.error(error.response.data.msg, toastOptions);
        console.error('Error sending data to the server:', error);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem('chat-user')) {
      navigate("/");
    }
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: "#fff",
      color: "#333",
      fontSize: "16px",
      border: "1px solid #555",
      borderRadius: "8px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    },
  };

  const handleValidation = () => {
    const { username, password } = values;
    if (username.trim() === "" || password.trim() === "") {
      toast.error("Please enter a valid username and password", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Navbar />
      <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
        <div className='mask'></div>
        <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
          <MDBCardBody className='px-5'>
            <h2 className="text-uppercase text-center mb-5">LOGIN</h2>
            <form onSubmit={(event) => handleSubmit(event)}>
              <MDBInput wrapperClass='mb-4' label='Username' size='lg' id='form1' type='text'
                name='username' onChange={(e) => handleChange(e)} />
              <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form3' type='password'
                name='password' onChange={(e) => handleChange(e)} />
              <div className='d-flex flex-row justify-content-center mb-4'>
                <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I agree all statements in Terms of service' />
              </div>
              <MDBBtn className='mb-4 w-100' size='lg' type='submit'>Login</MDBBtn>
            </form>
            <span className='mt-3 my-auto'>
              Don't have an account? <Link to='/register'>Register</Link>
            </span>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <ToastContainer />
    </>
  );
}
