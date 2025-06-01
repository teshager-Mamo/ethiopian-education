import React, { useRef, useMemo } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';

const UniversityCharts = ({ filteredData, theme, uniBarChartRef, uniPieChartRef, uniLineChartRef, uniGraduationBarChartRef, scoreDistributionBarChartRef }) => {
  const getUniBarChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { labels: ['No Data'], datasets: [{ label: 'Average Score', data: [0], backgroundColor: '#ccc' }] };
    }

    const ageGroups = [...new Set(filteredData.map((student) => student.age).filter(age => age))].sort();
    const averages = ageGroups.map((ageGroup) => {
      const ageData = filteredData.filter((student) => student.age === ageGroup);
      const validScores = ageData
        .map((student) => Number(student.score))
        .filter((score) => !isNaN(score) && score !== null && score !== undefined);
      return validScores.length > 0
        ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(2)
        : 0;
    });

    return {
      labels: ageGroups,
      datasets: [
        {
          label: 'Average Score',
          data: averages,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.dark,
          borderWidth: 1,
        },
      ],
    };
  };

  const getUniPieChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { labels: ['No Data'], datasets: [{ label: 'Student Distribution', data: [1], backgroundColor: '#ccc' }] };
    }

    const years = [...new Set(filteredData.map((student) => student.degreeawardeddate).filter(year => year))].sort();
    const yearCounts = years.map((year) => {
      return filteredData.filter((student) => student.degreeawardeddate === year).length;
    });

    return {
      labels: years,
      datasets: [
        {
          label: 'Student Distribution by Degree Awarded Year',
          data: yearCounts,
          backgroundColor: [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.chartAccent.main,
            '#4CAF50',
            '#FF9800',
          ],
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    };
  };

  const getUniLineChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { labels: ['No Data'], datasets: [{ label: 'Average Score Over Years', data: [0], borderColor: '#ccc' }] };
    }

    const years = [...new Set(filteredData.map((student) => student.degreeawardeddate).filter(year => year))].sort();
    const averageScores = years.map((year) => {
      const yearData = filteredData.filter((student) => student.degreeawardeddate === year);
      const validScores = yearData
        .map((student) => Number(student.score))
        .filter((score) => !isNaN(score) && score !== null && score !== undefined);
      return validScores.length > 0
        ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(2)
        : 0;
    });

    return {
      labels: years,
      datasets: [
        {
          label: 'Average Score Over Degree Awarded Years',
          data: averageScores,
          fill: false,
          borderColor: theme.palette.secondary.main,
          tension: 0.1,
        },
      ],
    };
  };

  const getUniGraduationBarChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { labels: ['No Data'], datasets: [{ label: 'Success Rate (%)', data: [0], backgroundColor: '#ccc' }] };
    }

    const departments = [...new Set(filteredData.map((student) => student.dept).filter(dept => dept))];
    const successRates = departments.map((dept) => {
      const deptData = filteredData.filter((student) => student.dept === dept);
      const totalStudents = deptData.length;
      const successfulStudents = deptData.filter((student) => student.status === 'excellent' || student.status === 'good').length;
      return totalStudents > 0 ? ((successfulStudents / totalStudents) * 100).toFixed(2) : 0;
    });

    return {
      labels: departments,
      datasets: [
        {
          label: 'Success Rate (%)',
          data: successRates,
          backgroundColor: theme.palette.chartAccent.main,
          borderColor: theme.palette.chartAccent.dark,
          borderWidth: 1,
        },
      ],
    };
  };

  const getScoreDistributionBarChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          { label: '0-1', data: [0], backgroundColor: '#ccc' },
          { label: '1-2', data: [0], backgroundColor: '#ccc' },
          { label: '2-3', data: [0], backgroundColor: '#ccc' },
          { label: '3-4', data: [0], backgroundColor: '#ccc' },
        ],
      };
    }

    const departments = [...new Set(filteredData.map((student) => student.dept).filter(dept => dept))];
    const scoreRanges = [
      { label: '0-1', min: 0, max: 1 },
      { label: '1-2', min: 1, max: 2 },
      { label: '2-3', min: 2, max: 3 },
      { label: '3-4', min: 3, max: 4 },
    ];

    const datasets = scoreRanges.map((range, index) => {
      const counts = departments.map((dept) => {
        const deptData = filteredData.filter((student) => student.dept === dept);
        const count = deptData.filter((student) => {
          const score = Number(student.score);
          return score >= range.min && score < range.max;
        }).length;
        return count;
      });

      return {
        label: range.label,
        data: counts,
        backgroundColor: [
          theme.palette.chartAccent.main,
          theme.palette.secondary.main,
          theme.palette.primary.main,
          '#4CAF50',
        ][index],
        borderColor: [
          theme.palette.chartAccent.dark,
          theme.palette.secondary.dark,
          theme.palette.primary.dark,
          '#388E3C',
        ][index],
        borderWidth: 1,
      };
    });

    return {
      labels: departments,
      datasets,
    };
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Average Score by Age
          </Typography>
          <div style={{ height: '300px' }}>
            <Bar
              ref={uniBarChartRef}
              data={getUniBarChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 4,
                    title: { display: true, text: 'Average Score', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#212121' },
                  },
                  x: {
                    title: { display: true, text: 'Age', color: '#212121' },
                    grid: { display: false },
                    ticks: { color: '#212121' },
                  },
                },
                plugins: {
                  legend: { position: 'top', labels: { color: '#212121' } },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
          <Typography variant="body2" sx={{ mt: 1, color: '#212121' }}>
            This chart compares the average scores of students across different age groups.
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Distribution by Degree Awarded Year
          </Typography>
          <div style={{ height: '300px' }}>
            <Pie
              ref={uniPieChartRef}
              data={getUniPieChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top', labels: { color: '#212121' } },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
          <Typography variant="body2" sx={{ mt: 1, color: '#212121' }}>
            This chart shows the distribution of students by the year they were awarded their degree.
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Average Score Over Degree Awarded Years
          </Typography>
          <div style={{ height: '300px' }}>
            <Line
              ref={uniLineChartRef}
              data={getUniLineChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 4,
                    title: { display: true, text: 'Average Score', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#212121' },
                  },
                  x: {
                    title: { display: true, text: 'Degree Awarded Year', color: '#212121' },
                    grid: { display: false },
                    ticks: { color: '#212121' },
                  },
                },
                plugins: {
                  legend: { position: 'top', labels: { color: '#212121' } },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
          <Typography variant="body2" sx={{ mt: 1, color: '#212121' }}>
            This chart illustrates the trend of average scores over the years degrees were awarded.
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Success Rate by Department
          </Typography>
          <div style={{ height: '300px' }}>
            <Bar
              ref={uniGraduationBarChartRef}
              data={getUniGraduationBarChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Success Rate (%)', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#212121' },
                  },
                  x: {
                    title: { display: true, text: 'Department', color: '#212121' },
                    grid: { display: false },
                    ticks: { color: '#212121' },
                  },
                },
                plugins: {
                  legend: { position: 'top', labels: { color: '#212121' } },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
          <Typography variant="body2" sx={{ mt: 1, color: '#212121' }}>
            This chart shows the percentage of students with a 'good' or 'excellent' status in each department.
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Score Distribution by Department
          </Typography>
          <div style={{ height: '300px' }}>
            <Bar
              ref={scoreDistributionBarChartRef}
              data={getScoreDistributionBarChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Number of Students', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#212121' },
                  },
                  x: {
                    title: { display: true, text: 'Department', color: '#212121' },
                    grid: { display: false },
                    ticks: { color: '#212121' },
                  },
                },
                plugins: {
                  legend: { position: 'top', labels: { color: '#212121' } },
                  tooltip: { enabled: true },
                },
                indexAxis: 'x',
                scales: {
                  x: {
                    stacked: true,
                    title: { display: true, text: 'Department', color: '#212121' },
                    grid: { display: false },
                    ticks: { color: '#212121' },
                  },
                  y: {
                    stacked: true,
                    title: { display: true, text: 'Number of Students', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#212121' },
                  },
                },
              }}
            />
          </div>
          <Typography variant="body2" sx={{ mt: 1, color: '#212121' }}>
            This chart shows the distribution of scores in different ranges (0-1, 1-2, 2-3, 3-4) for each department.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default UniversityCharts;
