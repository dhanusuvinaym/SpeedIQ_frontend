import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../Login/Login"; // Import your LoginPage component
import AdminPanel from "../AdminPanel/BulkUploadQuestions";
import Questions from "../QuizPage/Questions";
import UserPerformance from "../AdminPanel/UserPerformance";
import NavBar from "../NavigationBar/NavBar"

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/admin" element={<AdminPanel />} />
        <Route path="/quiz" element={< Questions />} />
        <Route path="/userPerformance" element={< UserPerformance />} /> */}
        <Route path="/nav" element={< NavBar />} />
        {/* Uncomment and add more routes as needed */}
        {/* <Route path="/test" element={<SomeOtherComponent />} /> */}
      </Routes>
    </Router>
  );
};

export default Routing;
