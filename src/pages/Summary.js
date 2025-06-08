import React, { useContext, useMemo } from 'react';
import { Box, Grid, Typography, Paper, Fade, Card, CardContent, CardActionArea } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Line, Pie } from 'react-chartjs-2';
import { DataContext } from '../context/DataContext';
import SummaryStats from '../components/charts/SummaryStats';
import SchoolIcon from '@mui/icons-material/School';

const ethiopianMapUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/1200px-Flag_of_Ethiopia.svg.png';
const educationIconUrl = 'https://png.pngtree.com/png-vector/20230417/ourmid/pngtree-3d-graduation-cap-icon-vector-png-image_6704102.png';

const Summary = () => {
  const { data, dataType } = useContext(DataContext);
  const theme = useTheme();
  const chartRefs = {
    lineChartRef: React.createRef(),
    pieChartRef: React.createRef(),
  };

  // Log data for debugging
  console.log('Raw Data:', data);
  console.log('Data Type:', dataType);

  // Filtering and validating data
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter((student) => {
      const isValidSex = !student.sex || student.sex === 'Male' || student.sex === 'Female';
      const isValidScore = dataType === 'HighSchool'
        ? !isNaN(Number(student.average)) && student.average !== null && student.average !== undefined
        : !isNaN(Number(student.score)) && student.score !== null && student.score !== undefined;
      const isValidTime = dataType === 'HighSchool'
        ? student.age && !isNaN(Number(student.age))
        : student.degreeawardeddate && !isNaN(Number(student.degreeawardeddate));
      return isValidSex && isValidScore && isValidTime;
    });
  }, [data, dataType]);

  // College vs. Student Count for University
  const collegeSummary = useMemo(() => {
    if (dataType !== 'University' || !data || !Array.isArray(data)) return [];
    const collegeMap = data.reduce((acc, student) => {
      const college = student.college;
      if (college && typeof college === 'string') {
        acc[college] = (acc[college] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(collegeMap)
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count);
  }, [data, dataType]);

  // High School Performance Summary
  const highSchoolSummary = useMemo(() => {
    if (dataType !== 'HighSchool' || !filteredData || filteredData.length === 0) return { excellent: 0, good: 0, fair: 0, poor: 0, total: 0 };
    const excellent = filteredData.filter((student) => Number(student.average) >= 90).length;
    const good = filteredData.filter((student) => Number(student.average) >= 70 && Number(student.average) < 90).length;
    const fair = filteredData.filter((student) => Number(student.average) >= 50 && Number(student.average) < 70).length;
    const poor = filteredData.filter((student) => Number(student.average) < 50).length;
    const total = filteredData.length;
    return { excellent, good, fair, poor, total };
  }, [dataType, filteredData]);

  const getLineChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { labels: ['No Data'], datasets: [{ label: 'Average Score Over Time', data: [0], borderColor: '#ccc' }] };
    }

    if (dataType === 'HighSchool') {
      const ageGroups = [...new Set(filteredData.map((student) => student.age).filter(age => age))].sort((a, b) => a - b);
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
            label: 'Average Score by Age Group',
            data: averageScores,
            fill: false,
            borderColor: theme.palette.secondary.main,
            tension: 0.1,
          },
        ],
      };
    } else if (dataType === 'University') {
      const years = [...new Set(filteredData.map((student) => student.degreeawardeddate).filter(year => year))].sort((a, b) => a - b);
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
    }
    return { labels: ['No Data'], datasets: [{ label: 'Average Score Over Time', data: [0], borderColor: '#ccc' }] };
  };

  const getPieChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return { labels: ['No Data'], datasets: [{ label: 'Distribution', data: [1], backgroundColor: '#ccc' }] };
    }

    if (dataType === 'HighSchool') {
      const classes = [...new Set(filteredData.map((student) => student.predictionclass).filter(cls => cls))];
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
              '#2196F3',
              '#9C27B0',
            ],
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      };
    } else if (dataType === 'University') {
      const departments = [...new Set(filteredData.map((student) => student.dept).filter(dept => dept))];
      const deptCounts = departments.map((dept) => {
        return filteredData.filter((student) => student.dept === dept).length;
      });

      return {
        labels: departments,
        datasets: [
          {
            label: 'Student Distribution by Department',
            data: deptCounts,
            backgroundColor: [
              theme.palette.primary.main,
              theme.palette.secondary.main,
              theme.palette.chartAccent.main,
              '#4CAF50',
              '#FF9800',
              '#2196F3',
              '#9C27B0',
            ],
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      };
    }
    return { labels: ['No Data'], datasets: [{ label: 'Distribution', data: [1], backgroundColor: '#ccc' }] };
  };

  const downloadCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + filteredData.map((row) => Object.values(row).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${dataType}_summary_data.csv`);
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
    link.download = `${dataType}_summary_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadChartImage = (chartRef, fileName) => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dataType}_${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!dataType) {
    return (
      <Box sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Please upload data to view the summary. Navigate to the <a href="/upload">Upload Data</a> page.
        </Typography>
      </Box>
    );
  }

  return (
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
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: theme.palette.primary.main }}>
        {dataType} Data Summary
      </Typography>

      <Grid container spacing={4}>
        {/* College Enrollment Cards for University */}
        {dataType === 'University' && collegeSummary.length > 0 && (
          <Grid item xs={12}>
            <Fade in={collegeSummary.length > 0}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#212121', mb: 2 }}>
                  College Enrollment
                </Typography>
                <Grid container spacing={2}>
                  {collegeSummary.map(({ college, count }, index) => (
                    <Grid item xs={12} sm={6} md={4} key={college}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: 3,
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: 6,
                          },
                          bgcolor: 'background.paper',
                        }}
                      >
                        <CardActionArea>
                          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                            <SchoolIcon
                              sx={{
                                fontSize: 40,
                                color: [
                                  theme.palette.primary.main,
                                  theme.palette.secondary.main,
                                  theme.palette.chartAccent.main,
                                  '#4CAF50',
                                  '#FF9800',
                                  '#2196F3',
                                  '#9C27B0',
                                ][index % 7],
                                mr: 2,
                              }}
                            />
                            <Box>
                              <Typography variant="h6" sx={{ color: '#212121', fontWeight: 'medium' }}>
                                {college}
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {count} Student{count !== 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="body2" sx={{ mt: 2, color: '#212121' }}>
                  This section shows the number of students enrolled in each college.
                </Typography>
              </Box>
            </Fade>
          </Grid>
        )}

        {/* High School Performance Cards */}
        {dataType === 'HighSchool' && filteredData.length > 0 && (
          <Grid item xs={12}>
            <Fade in={filteredData.length > 0}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#212121', mb: 2 }}>
                  High School Performance
                </Typography>
                <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
                  {[
                    { label: 'Excellent', count: highSchoolSummary.excellent, colorIndex: 0 },
                    { label: 'Good', count: highSchoolSummary.good, colorIndex: 1 },
                    { label: 'Fair', count: highSchoolSummary.fair, colorIndex: 2 },
                    { label: 'Poor', count: highSchoolSummary.poor, colorIndex: 3 },
                  ].map(({ label, count, colorIndex }, index) => (
                    <Grid item key={label} sx={{ minWidth: '200px', flexShrink: 0 }}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: 3,
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: 6,
                          },
                          bgcolor: 'background.paper',
                        }}
                      >
                        <CardActionArea>
                          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                            <SchoolIcon
                              sx={{
                                fontSize: 40,
                                color: [
                                  theme.palette.primary.main,
                                  theme.palette.secondary.main,
                                  theme.palette.chartAccent.main,
                                  '#4CAF50',
                                  '#FF9800',
                                  '#2196F3',
                                  '#9C27B0',
                                ][colorIndex % 7],
                                mr: 2,
                              }}
                            />
                            <Box>
                              <Typography variant="h6" sx={{ color: '#212121', fontWeight: 'medium' }}>
                                {label}
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {count} Student{count !== 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="body2" sx={{ mt: 2, color: '#212121' }}>
                  This section shows the number of students in each performance category based on average scores.
                </Typography>
              </Box>
            </Fade>
          </Grid>
        )}

        <Grid item xs={12}>
          <SummaryStats data={filteredData} dataType={dataType} />
        </Grid>

        {filteredData.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#212121' }}>
              No data available to display.
            </Typography>
          </Grid>
        )}

        {filteredData.length > 0 && (
          <>
            <Grid item xs={12} md={6}>
              <Fade in={filteredData.length > 0}>
                <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
                    {dataType === 'HighSchool' ? 'Average Score by Age Group' : 'Average Score Over Degree Awarded Years'}
                  </Typography>
                  <div style={{ height: '300px' }}>
                    <Line
                      ref={chartRefs.lineChartRef}
                      data={getLineChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: dataType === 'HighSchool' ? 100 : 4,
                            title: { display: true, text: 'Average Score', color: '#212121' },
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { color: '#212121' },
                          },
                          x: {
                            title: { display: true, text: dataType === 'HighSchool' ? 'Age Group' : 'Degree Awarded Year', color: '#212121' },
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
                    {dataType === 'HighSchool'
                      ? 'This chart shows the trend of average scores across different age groups for High School students.'
                      : 'This chart shows the trend of average scores over the years degrees were awarded for University students.'}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Fade in={filteredData.length > 0}>
                <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: 'rgba(255, 255, 255, 0.98)' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#212121' }}>
                    {dataType === 'HighSchool' ? 'Distribution by Performance Category' : 'Distribution by Department'}
                  </Typography>
                  <div style={{ height: '300px' }}>
                    <Pie
                      ref={chartRefs.pieChartRef}
                      data={getPieChartData()}
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
                    {dataType === 'HighSchool'
                      ? 'This chart shows the distribution of students across performance categories for High School.'
                      : 'This chart shows the distribution of students across departments for University.'}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Summary;