// src/App.js
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Change to HashRouter
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import DataUpload from './pages/DataUpload';
import HighSchoolDashboard from './pages/HighSchoolDashboard';
import UniversityDashboard from './pages/UniversityDashboard';
import Summary from './pages/Summary';
import About from './pages/About';

function App() {
  const [headerProps, setHeaderProps] = useState({});

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header {...headerProps} />
        <Routes>
          <Route path="/" element={<Home setHeaderProps={setHeaderProps} />} />
          <Route path="/upload" element={<DataUpload setHeaderProps={setHeaderProps} />} />
          <Route
            path="/highschool"
            element={<HighSchoolDashboard setHeaderProps={setHeaderProps} />}
          />
          <Route
            path="/university"
            element={<UniversityDashboard setHeaderProps={setHeaderProps} />}
          />
          <Route path="/summary" element={<Summary setHeaderProps={setHeaderProps} />} />
          <Route path="/about" element={<About setHeaderProps={setHeaderProps} />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;