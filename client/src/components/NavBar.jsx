import React from 'react';
import NavLogo from '../assets/chat-room.png';
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarLink,
    MDBBtn,
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

export default function App() {
    return (
        <>
            <MDBNavbar light bgColor='light'>
                <MDBContainer fluid>
                    <MDBNavbarBrand href='#'>
                        <img src={NavLogo} height='30' alt='C-R' loading='lazy' />
                        {' '}
                        Chat-Room
                    </MDBNavbarBrand>
                    <MDBNavbarLink to='/login'>
                        <MDBBtn outline color="success" className='me-2' type='button'>
                            Login
                        </MDBBtn>
                    </MDBNavbarLink>
                </MDBContainer>
            </MDBNavbar>
        </>
    );
}
