import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { registerRoute } from '../utils/APIRoutes';
import axios from 'axios';
import NavBar from '../components/NavBar';
import 'react-toastify/dist/ReactToastify.css';

import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox
} from 'mdb-react-ui-kit';

export default function App() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = values;
      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        if (data.status === true) {
          localStorage.setItem('chat-user', JSON.stringify(data.user));
          localStorage.setItem('chat-token', JSON.stringify(data.token));
          navigate("/setAvatar");
        }
      } catch (error) {
        toast.error(error.response.data.msg, toastOptions);
        console.error("Error sending data to the server:", error);
      }
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;

    if (email.trim() === "" || username.trim() === "" || password.trim() === "") {
      toast.error("Please enter a valid username, email, and password", toastOptions);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", toastOptions);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password should be the same", toastOptions);
      return false;
    }

    if (password.length < 8) {
      toast.error("Password length must be at least 8 characters", toastOptions);
      return false;
    }

    const commonPasswords = ["12345678", "password", "qwerty", "111111"];
    if (commonPasswords.some(commonPassword => password.toLowerCase().includes(commonPassword))) {
      toast.error("Please choose a stronger password", toastOptions);
      return false;
    }

    return true;
  };

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

  return (
    <>
      <NavBar />
      <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
        <div className='mask'></div>
        <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
          <MDBCardBody className='px-5'>
            <h2 className="text-uppercase text-center mb-5">Create an account</h2>
            <form onSubmit={(event) => handleSubmit(event)}>
              <MDBInput wrapperClass='mb-4' label='Username' size='lg' id='form1' type='text'
                name='username' onChange={(e) => handleChange(e)} />
              <MDBInput wrapperClass='mb-4' label='Your Email' size='lg' id='form2' type='email'
                name='email' onChange={(e) => handleChange(e)} />
              <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form3' type='password'
                name='password' onChange={(e) => handleChange(e)} />
              <MDBInput wrapperClass='mb-4' label='Repeat your password' size='lg' id='form4' type='password'
                name='confirmPassword' onChange={(e) => handleChange(e)} />
              <div className='d-flex flex-row justify-content-center mb-4'>
                <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I agree all statements in Terms of service' />
              </div>
              <MDBBtn className='mb-4 w-100' size='lg' type='submit'>Register</MDBBtn>
            </form>
            <span className='mt-3 my-auto'>
              have an account? <Link to='/Login'>Login</Link>
            </span>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <ToastContainer />
    </>
  );
};


