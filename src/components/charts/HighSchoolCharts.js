import React, { useRef, useMemo } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

const HighSchoolCharts = ({ filteredData, theme }) => {
  const subjectBarChartRef = useRef(null);
  const performancePieChartRef = useRef(null);
  const ageLineChartRef = useRef(null);
  const scatterChartRef = useRef(null);

  const getSubjectBarChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          { label: 'English', data: [0], backgroundColor: '#ccc' },
          { label: 'Math', data: [0], backgroundColor: '#ccc' },
          { label: 'Civic', data: [0], backgroundColor: '#ccc' },
          { label: 'Physics', data: [0], backgroundColor: '#ccc' },
          { label: 'Chemistry', data: [0], backgroundColor: '#ccc' },
          { label: 'Biology', data: [0], backgroundColor: '#ccc' },
          { label: 'Amharic', data: [0], backgroundColor: '#ccc' },
        ],
      };
    }

    const classes = [...new Set(filteredData.map((student) => student.predictionclass || 'No Class'))].filter(cls => cls !== 'No Class');
    const subjects = ['english', 'math', 'civic', 'physics', 'chemistry', 'biology', 'amharic'];

    const datasets = subjects.map((subject, index) => {
      const averages = classes.map((cls) => {
        const classData = filteredData.filter((student) => student.predictionclass === cls);
        const validScores = classData
          .map((student) => Number(student[subject]))
          .filter((score) => !isNaN(score) && score !== null && score !== undefined);
        return validScores.length > 0
          ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(2)
          : 0;
      });

      return {
        label: subject.charAt(0).toUpperCase() + subject.slice(1),
        data: averages,
        backgroundColor: [
          theme.palette.primary.main, // English
          theme.palette.secondary.main, // Math
          theme.palette.chartAccent.main, // Civic
          '#4CAF50', // Physics
          '#FF9800', // Chemistry
          '#2196F3', // Biology
          '#9C27B0', // Amharic
        ][index],
        borderColor: [
          theme.palette.primary.dark,
          theme.palette.secondary.dark,
          theme.palette.chartAccent.dark,
          '#388E3C',
          '#F57C00',
          '#1976D2',
          '#7B1FA2',
        ][index],
        borderWidth: 1,
      };
    });

    return {
      labels: classes,
      datasets,
    };
  };

  const getPerformancePieChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { labels: ['No Data'], datasets: [{ label: 'Student Distribution', data: [1], backgroundColor: '#ccc' }] };
    }

    const classes = [...new Set(filteredData.map((student) => student.predictionclass || 'No Class'))].filter(cls => cls !== 'No Class');
    const classCounts = classes.map((cls) => {
      return filteredData.filter((student) => student.predictionclass === cls).length;
    });

    return {
      labels: classes,
      datasets: [
        {
          label: 'Student Distribution by Performance',
          data: classCounts,
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

  const getAgeLineChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { labels: ['No Data'], datasets: [{ label: 'Average Score Over Age Group', data: [0], borderColor: '#ccc' }] };
    }

    const ageGroups = [...new Set(filteredData.map((student) => student.age || 'No Age'))].sort().filter(age => age !== 'No Age');
    const averageScores = ageGroups.map((ageGroup) => {
      const ageData = filteredData.filter((student) => student.age === ageGroup);
      const validScores = ageData
        .map((student) => Number(student.average))
        .filter((score) => !isNaN(score) && score !== null && score !== undefined);
      return validScores.length > 0
        ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(2)
        : 0;
    });

    return {
      labels: ageGroups,
      datasets: [
        {
          label: 'Average Score Over Age Group',
          data: averageScores,
          fill: false,
          borderColor: theme.palette.secondary.main,
          tension: 0.1,
        },
      ],
    };
  };

  const getScatterChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { datasets: [{ label: 'Absenteeism vs. Score', data: [], backgroundColor: '#ccc' }] };
    }

    const scatterData = filteredData.map((student) => ({
      x: Number(student.absent) || 0,
      y: Number(student.average) || 0,
    }));

    return {
      datasets: [
        {
          label: 'Absenteeism vs. Average Score',
          data: scatterData,
          backgroundColor: theme.palette.chartAccent.main,
          pointRadius: 5,
        },
      ],
    };
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Average Scores by Subject
          </Typography>
          <div style={{ height: '300px' }}>
            <Bar
              ref={subjectBarChartRef}
              data={getSubjectBarChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Average Score', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#212121' },
                  },
                  x: {
                    title: { display: true, text: 'Performance Category', color: '#212121' },
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
            This chart compares average scores in English, Math, Civic, Physics, Chemistry, Biology, and Amharic across performance categories.
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Distribution by Performance Category
          </Typography>
          <div style={{ height: '300px' }}>
            <Pie
              ref={performancePieChartRef}
              data={getPerformancePieChartData()}
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
            This chart shows the distribution of students across performance categories (e.g., excellent, good).
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Average Scores by Age Group
          </Typography>
          <div style={{ height: '300px' }}>
            <Line
              ref={ageLineChartRef}
              data={getAgeLineChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Average Score', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#212121' },
                  },
                  x: {
                    title: { display: true, text: 'Age Group', color: '#212121' },
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
            This chart illustrates the trend of average scores across different age groups for High School students.
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
            Absenteeism vs. Average Score
          </Typography>
          <div style={{ height: '300px' }}>
            <Scatter
              ref={scatterChartRef}
              data={getScatterChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: { display: true, text: 'Absenteeism (Days)', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#212121' },
                  },
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Average Score', color: '#212121' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
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
            This scatter plot shows the relationship between absenteeism and average scores for High School students.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HighSchoolCharts;