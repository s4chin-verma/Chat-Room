import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import Register from "./pages/Register"
import SetAvatar from "./pages/SetAvatar"
import Login from "./pages/Login"
// import Temp from "./components/Temp"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        {/* <Route path="/temp" element={<Temp />} /> */}
      </Routes>
    </BrowserRouter>
  )
}
