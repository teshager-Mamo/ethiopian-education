// src/pages/Home.js
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const ethiopianMapUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/1200px-Flag_of_Ethiopia.svg.png';
const educationIconUrl = 'https://png.pngtree.com/png-vector/20230417/ourmid/pngtree-3d-graduation-cap-icon-vector-png-image_6704102.png';

const Home = ({ setHeaderProps }) => {
  // Reset header props on Home page (no download menu)
  React.useEffect(() => {
    setHeaderProps({});
  }, [setHeaderProps]);

  return (
    <Box sx={{ flexGrow: 1, p: 4 }} className="dashboard-container">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }

          @keyframes float {
            0% { transform: translateY(0px) rotateY(30deg); }
            50% { transform: translateY(-10px) rotateY(30deg); }
            100% { transform: translateY(0px) rotateY(30deg); }
          }

          @keyframes shine {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .dashboard-container {
            position: relative;
            background: linear-gradient(135deg, rgba(245, 247, 250, 0.95) 0%, rgba(220, 230, 255, 0.9) 100%), url(${ethiopianMapUrl});
            background-size: 200% 200%, cover;
            background-position: center, center;
            background-repeat: no-repeat, no-repeat;
            background-attachment: fixed, fixed;
            animation: shine 15s ease-in-out infinite;
            overflow: hidden;
          }

          .dashboard-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url(${ethiopianMapUrl}) no-repeat center;
            background-size: cover;
            opacity: 0.1;
            filter: grayscale(50%);
            transform: perspective(1000px) rotateX(10deg);
            z-index: -1;
          }

          .dashboard-container::after {
            content: '';
            position: absolute;
            top: 30px;
            right: 30px;
            width: 220px;
            height: 220px;
            background: url(${educationIconUrl}) no-repeat center;
            background-size: contain;
            opacity: 0.25;
            transform: perspective(800px) rotateY(40deg) rotateX(20deg);
            filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
            animation: float 6s ease-in-out infinite;
            z-index: -1;
          }
        `}
      </style>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Ethiopia Education Visualization 
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Explore and visualize educational data for High School and University students in Ethiopia. Upload your data to get started!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/upload"
          sx={{ fontSize: '1.2rem', py: 1.5, px: 4 }}
        >
          Upload Data
        </Button>
      </Box>
    </Box>
  );
};

export default Home;