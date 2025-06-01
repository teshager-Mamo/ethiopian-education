import React, { useState, useRef, useMemo, useContext } from 'react';
import { Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataContext } from '../context/DataContext';
import HighSchoolCharts from '../components/charts/HighSchoolCharts';
import SummaryStats from '../components/charts/SummaryStats';

const ethiopianMapUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/1200px-Flag_of_Ethiopia.svg.png';
const educationIconUrl = 'https://png.pngtree.com/png-vector/20230417/ourmid/pngtree-3d-graduation-cap-icon-vector-png-image_6704102.png';

const HighSchoolDashboard = () => {
  const { data, dataType } = useContext(DataContext);
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const subjectBarChartRef = useRef(null);
  const performancePieChartRef = useRef(null);
  const ageLineChartRef = useRef(null);
  const scatterChartRef = useRef(null);

  const filteredData = useMemo(() => {
    return data.filter((student) =>
      (selectedFilter === 'All' || student.predictionclass === selectedFilter) &&
      (genderFilter === 'All' || student.sex === genderFilter)
    );
  }, [data, selectedFilter, genderFilter]);

  const filterOptions = ['All', ...new Set(data.map((student) => student.predictionclass).filter(cls => cls))];
  const genderOptions = ['All', ...new Set(data.map((student) => student.sex).filter(sex => sex === 'Male' || sex === 'Female'))];

  const downloadCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + filteredData.map((row) => Object.values(row).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HighSchool_students_data_${selectedFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HighSchool_students_data_${selectedFilter}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadChartImage = (chartRef, fileName) => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `HighSchool_${fileName}_${selectedFilter}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (dataType !== 'HighSchool') {
    return (
      <Box sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Please upload High School data to view this dashboard. Navigate to the <a href="/upload">Upload Data</a> page.
        </Typography>
      </Box>
    );
  }

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
            background-size: _ode: 200% 200%, cover;
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
      <Box sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <SummaryStats data={filteredData} dataType={dataType} />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="filter-select-label" sx={{ color: '#212121' }}>
                Performance Category
              </InputLabel>
              <Select
                labelId="filter-select-label"
                value={selectedFilter}
                label="Performance Category"
                onChange={(e) => setSelectedFilter(e.target.value)}
                sx={{ background: 'rgba(255, 255, 255, 0.95)', color: '#212121', '& .MuiSvgIcon-root': { color: '#212121' }, backdropFilter: 'blur(5px)' }}
                aria-label="Filter data by performance category"
              >
                {filterOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="gender-filter-label" sx={{ color: '#212121' }}>
                Gender
              </InputLabel>
              <Select
                labelId="gender-filter-label"
                value={genderFilter}
                label="Gender"
                onChange={(e) => setGenderFilter(e.target.value)}
                sx={{ background: 'rgba(255, 255, 255, 0.95)', color: '#212121', '& .MuiSvgIcon-root': { color: '#212121' }, backdropFilter: 'blur(5px)' }}
                aria-label="Filter data by gender"
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {filteredData.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ textAlign: 'center', color: '#212121' }}>
                No data available for the selected filters.
              </Typography>
            </Grid>
          )}

          {filteredData.length > 0 && (
            <Grid item xs={12}>
              <Fade in={filteredData.length > 0}>
                <Paper elevation={6} sx={{ p: 3, borderRadius: 12, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
                  <HighSchoolCharts
                    filteredData={filteredData}
                    theme={theme}
                    subjectBarChartRef={subjectBarChartRef}
                    performancePieChartRef={performancePieChartRef}
                    ageLineChartRef={ageLineChartRef}
                    scatterChartRef={scatterChartRef}
                  />
                </Paper>
              </Fade>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default HighSchoolDashboard;