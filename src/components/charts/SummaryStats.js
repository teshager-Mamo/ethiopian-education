// src/components/charts/SummaryStats.js
import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

const SummaryStats = ({ data, dataType }) => {
  const totalStudents = data.length;
  const avgScore = data.length > 0
    ? (data.reduce((sum, student) => sum + Number(student[dataType === 'HighSchool' ? 'average' : 'score']), 0) / data.length).toFixed(2)
    : 0;
  const passRate = data.length > 0
    ? (data.filter(student => (dataType === 'HighSchool' ? student.average >= 50 : student.status !== 'poor')).length / data.length * 100).toFixed(2)
    : 0;

  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h6">Summary Statistics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body1">Total Students</Typography>
            <Typography variant="h5">{totalStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body1">Average Score</Typography>
            <Typography variant="h5">{avgScore}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body1">Success Rate (%)</Typography>
            <Typography variant="h5">{passRate}%</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryStats;