// src/components/layout/Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ onDownloadCSV, onDownloadJSON, onDownloadCharts, chartRefs, dataType }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadChart = (ref, name) => {
    if (onDownloadCharts && ref) {
      onDownloadCharts(ref, name);
    }
    handleMenuClose();
  };

  // Only show the download menu if both onDownloadCSV and onDownloadJSON are provided
  const showDownloadMenu = onDownloadCSV && onDownloadJSON;

  return (
    <AppBar position="fixed" sx={{ background: '#008000' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff', fontWeight: 600 }}>
          Ethiopia Education Dashboard
        </Typography>
        <Link to="/" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/upload" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>
          Upload Data
        </Link>
        <Link to="/highschool" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>
          High School
        </Link>
        <Link to="/university" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>
          University
        </Link>
        <Link to="/summary" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>
          Summary
        </Link>
        <Link to="/about" style={{ color: '#fff', marginRight: 16, textDecoration: 'none' }}>
          About
        </Link>
        {showDownloadMenu && (
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MoreVert sx={{ color: '#FFD700' }} />
          </IconButton>
        )}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {chartRefs && dataType === 'HighSchool' && (
            <>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.subjectBarChartRef, 'subject_bar_chart')}>
                Download Subject Bar Chart
              </MenuItem>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.performancePieChartRef, 'performance_pie_chart')}>
                Download Performance Pie Chart
              </MenuItem>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.ageLineChartRef, 'age_line_chart')}>
                Download Age Line Chart
              </MenuItem>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.scatterChartRef, 'scatter_chart')}>
                Download Scatter Chart
              </MenuItem>
            </>
          )}
          {chartRefs && dataType === 'University' && (
            <>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.uniBarChartRef, 'uni_bar_chart')}>
                Download University Bar Chart
              </MenuItem>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.uniPieChartRef, 'uni_pie_chart')}>
                Download University Pie Chart
              </MenuItem>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.uniLineChartRef, 'uni_line_chart')}>
                Download University Line Chart
              </MenuItem>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.uniGraduationBarChartRef, 'uni_graduation_bar_chart')}>
                Download Success Rate Chart
              </MenuItem>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.scoreDistributionBarChartRef, 'score_distribution_bar_chart')}>
                Download Score Distribution Bar Chart
              </MenuItem>
            </>
          )}
          {chartRefs && (
            <>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.lineChartRef, 'line_chart')}>
                Download Line Chart
              </MenuItem>
              <MenuItem onClick={() => handleDownloadChart(chartRefs.pieChartRef, 'pie_chart')}>
                Download Pie Chart
              </MenuItem>
            </>
          )}
          {onDownloadCSV && <MenuItem onClick={() => { onDownloadCSV(); handleMenuClose(); }}>Download CSV</MenuItem>}
          {onDownloadJSON && <MenuItem onClick={() => { onDownloadJSON(); handleMenuClose(); }}>Download JSON</MenuItem>}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;