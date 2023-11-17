import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify"
import { io } from "socket.io-client";
import { loginRoute } from '../utils/APIRoutes'
import axios from 'axios'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-toastify/dist/ReactToastify.css'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
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
      const { username, email, password } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          email,
          password,
        });

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }

        if (data.status === true) {
          localStorage.setItem('chat-user', JSON.stringify(data.user));
          localStorage.setItem('chat-token', data.token);
          setTimeout(() => {
            localStorage.clear();
          }, 100000);
          navigate('/');
        }
      } catch (error) {
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
      <MDBContainer fluid>
        <MDBCard className='text-black mt-5' style={{ borderRadius: '25px' }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                <form onSubmit={(event) => handleSubmit(event)}>
                  <div className='d-flex justify-content-center align-items-center mt-2 mb-4'>
                    <p className="h1 fw-bold mx-1 mx-md-4">Log In</p>
                  </div>
                  <div className="d-flex flex-row align-items-center mb-4 ">
                    <MDBIcon fas icon="user me-3" size='lg' />
                    <MDBInput label='Username' id='form1' type='text' className='w-100' name='username' onChange={(e) => handleChange(e)} />
                  </div>
                  <div className="d-flex flex-row align-items-center mb-4">
                    <MDBIcon fas icon="lock me-3" size='lg' />
                    <MDBInput label='Password' id='form3' type='password' name='password' onChange={(e) => handleChange(e)} />
                  </div>
                  <div className='d-flex justify-content-center align-items-center flex-column text-center'>
                    <MDBBtn className='m-2 pl-pr-5' size='lg' type="submit">Login</MDBBtn>
                    <span className='mt-3'>
                      Don't have an account? <Link to='/register'>Register</Link>
                    </span>
                  </div>
                </form>
              </MDBCol>
              <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <ToastContainer />
    </>
  );
}
