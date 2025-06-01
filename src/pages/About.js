// src/pages/About.js
import React from 'react';
import { Box, Typography, Paper, Fade } from '@mui/material';

const ethiopianMapUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/1200px-Flag_of_Ethiopia.svg.png';
const educationIconUrl = 'https://png.pngtree.com/png-vector/20230417/ourmid/pngtree-3d-graduation-cap-icon-vector-png-image_6704102.png';

const About = () => (
  <Box sx={{ flexGrow: 1, p: 4, mt: 8 }} className="dashboard-container">
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
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Fade in={true} timeout={{ enter: 1000 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 12, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            About the Ethiopia Education Visualization 
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#212121' }}>
            The Ethiopia Education Visualization Project is designed to help educators, researchers, and policymakers analyze and visualize educational data for High School and University students in Ethiopia. By providing interactive dashboards, this tool aims to uncover trends, identify areas for improvement, and support data-driven decision-making in the education sector.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121', mt: 3 }}>
            Project Goals
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#212121' }}>
            - Provide a user-friendly platform to upload and visualize educational data.<br />
            - Offer detailed insights into student performance, absenteeism, and success rates.<br />
            - Support both High School and University data with tailored visualizations.<br />
            - Enable data export in CSV and JSON formats, and chart downloads as PNG images.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121', mt: 3 }}>
            Data Requirements
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#212121' }}>
            To use this tool, upload a CSV file with the following columns:<br />
            <strong>High School Data:</strong> English, Math, Civic, Average, Predictioclass, Absent, Rank, Age, Sex (optional).<br />
            <strong>University Data:</strong> Dept, Batch, Score, DegreeAwardedDate, Status, Stype, UniversityName (optional), Sex (optional).<br />
            Ensure your data is clean and matches the expected format to avoid errors during upload.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121', mt: 3 }}>
            Contact
          </Typography>
          <Typography variant="body1" sx={{ color: '#212121' }}>
            For questions, feedback, or contributions, please reach out at <a href="mailto:support@ethiopiaedu.org">teshagermamo13@gmail.com</a>.
          </Typography>
        </Paper>
      </Fade>
    </Box>
  </Box>
);

export default About;