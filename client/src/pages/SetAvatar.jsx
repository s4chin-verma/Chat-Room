import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify"
import { setAvatarRoute } from '../utils/APIRoutes'
import { Buffer } from 'buffer'
import { MDBBtn, MDBContainer, MDBCard, MDBCol, MDBCardBody } from 'mdb-react-ui-kit'
import Loader from '../assets/loader4.gif'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'
import axios from 'axios'

export default function SetAvatar() {
  const api = "https://api.multiavatar.com/LGNekVSU1yxvBi";
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
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

  useEffect(() => {
    if (!localStorage.getItem('chat-user')) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please Select an Avatar", toastOptions);
    }
    else {
      const user = await JSON.parse(localStorage.getItem("chat-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, { image: avatar[selectedAvatar] });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-user', JSON.stringify(user));
        // await toast,error("Avatar set successfully. Please log in again to start the chat", toastOptions);
        navigate("/");
      } else {
        toast.error("Error setting Avatar, please try again", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          const buffer = Buffer.from(response.data,);
          data.push(buffer.toString('base64'));
        }
        setAvatar(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching avatar data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {
        isLoading ?
          <div className='custom-card mx-5 d-flex justify-content-center align-items-center' style={{ borderRadius: '25px', minHeight: '100vh' }}>
            <img src={Loader} alt="Loader" />
          </div>
          :
          <div>
            <MDBContainer fluid>
              <MDBCard className='custom-card m-5' style={{ borderRadius: '25px' }}>
                <MDBCardBody className='d-flex flex-column align-items-center justify-content-center'>
                  <MDBCol md='10' lg='7'>
                    <Container >
                      <div className='my-5'>
                        <h1 className='fw-bold'>Pick an avatar as your profile picture</h1>
                      </div>
                      <div className='d-flex justify-content-center my-2'>
                        {avatar.map((avatarData, index) => {
                          return (
                            <div className="avatar mx-3" style={{
                              border: selectedAvatar === index ? "0.2rem solid #4e0eff" : "0.2rem solid #FAF6F0"
                            }}
                              key={index}>
                              <img style={{ height: '6rem', transition: '0.5s ease-in-out' }}
                                src={`data:image/svg+xml;base64, ${avatarData}`}
                                alt="avatar"
                                onClick={() => { setSelectedAvatar(index) }}
                              />
                            </div>)
                        })}
                      </div>
                      <div className='my-5 d-flex justify-content-center'>
                        <MDBBtn
                          color="primary"
                          onClick={setProfilePicture}
                          disabled={selectedAvatar === undefined}> Set as Profile picture </MDBBtn>
                      </div>
                    </Container>
                  </MDBCol>
                </MDBCardBody>
              </MDBCard>
            </MDBContainer >
          </div>
      }<ToastContainer />
    </>
  );
}

const Container = styled.div`
  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 5rem;
    transition: 0.5s ease-in-out;
    cursor: pointer;
  }
  
  @media (max-width: 576px) {
    .d-flex.justify-content-center.my-2 {
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .avatar.mx-3 {
      margin: 5px;
      cursor: pointer; 
    }
  }
`;
