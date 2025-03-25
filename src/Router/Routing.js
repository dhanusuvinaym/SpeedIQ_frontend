import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../Login/Login"; // Import your LoginPage component
import NavBar from "../NavigationBar/NavBar"

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/nav" element={< NavBar />} />
      </Routes>
    </Router>
  );
};

export default Routing;
