import React, { useCallback, useContext, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Fade } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import DataUploader from '../components/data/DataUploader';
import { DataContext } from '../context/DataContext';

const ethiopianMapUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/4/71/Flag_of_Ethiopia.svg/1200px-Flag_of_Ethiopia.svg.png';
const educationIconUrl = 'https://png.pngtree.com/png-vector/20230417/ourmid/pngtree-3d-graduation-cap-icon-vector-png-image_6704102.png';

const DataUpload = () => {
  const { data, setData, dataType, setDataType } = useContext(DataContext);

  const normalizeColumnName = (col) => col.trim().toLowerCase().replace(/\s+/g, '');
  
  const normalizeGender = (gender) => {
    if (!gender) return null;
    const normalized = gender.trim().toLowerCase();
    if (['m', 'male'].includes(normalized)) return 'Male';
    if (['f', 'female'].includes(normalized)) return 'Female';
    return null; // Invalid or unknown gender values are set to null
  };

  const handleDataUpload = (uploadedData) => {
    console.log('Uploaded Data:', uploadedData);
    const processedData = Array.isArray(uploadedData) ? uploadedData : [];
    if (processedData.length === 0) {
      console.warn('No valid data found in upload');
      setData([]);
      setDataType(null);
      alert('No data found in the uploaded file. Please upload a valid CSV.');
      return;
    }

    const normalizedData = processedData.map((row) => {
      const normalizedRow = {};
      Object.keys(row).forEach((key) => {
        const normalizedKey = normalizeColumnName(key);
        normalizedRow[normalizedKey] = row[key];
      });
      normalizedRow['sex'] = normalizeGender(row['sex'] || row['Sex'] || row['gender'] || row['Gender'] || '');
      return normalizedRow;
    });

    const firstRow = normalizedData[0];
    const columns = Object.keys(firstRow).map(normalizeColumnName);

    const highSchoolColumns = ['english', 'math', 'civic', 'physics', 'chemistry', 'biology', 'amharic', 'average', 'predictionclass', 'absent', 'rank'].map(normalizeColumnName);
    const isHighSchool = highSchoolColumns.every((col) => columns.includes(col));

    const universityColumns = ['dept', 'batch', 'score', 'degreeawardeddate', 'status', 'stype'].map(normalizeColumnName);
    const isUniversity = universityColumns.every((col) => columns.includes(col));

    if (isHighSchool) {
      console.log('Detected HighSchool data');
      setDataType('HighSchool');
      const cleanedData = normalizedData
        .map((student) => {
          if (student.predictioclass) {
            student.predictionclass = student.predictioclass;
            delete student.predictioclass;
          }
          if (student.predictionclass === 'exellent') {
            student.predictionclass = 'excellent';
          }
          if (student['agegroup(age)']) {
            student.age = student['agegroup(age)'];
            delete student['agegroup(age)'];
          }
          return student;
        })
        .filter((student) => {
          const average = Number(student.average);
          return !isNaN(average) && average !== null && average !== undefined && average >= 0 && average <= 100;
        });
      setData(cleanedData);
    } else if (isUniversity) {
      console.log('Detected University data');
      setDataType('University');
      const cleanedData = normalizedData
        .map((student) => {
          if (!student.universityname) {
            student.universityname = 'Addis Ababa University';
          }
          if (student.status === 'exellent') {
            student.status = 'excellent';
          }
          student.score = student.score ? Number(student.score).toFixed(2) : null;
          student.degreeawardeddate = Number(student.degreeawardeddate);
          delete student.agex;
          delete student.batchx;
          delete student.highschoolcompletionyearx;
          return student;
        })
        .filter((student) => {
          const score = Number(student.score);
          const year = student.degreeawardeddate;
          return (
            student.universityname &&
            typeof student.universityname === 'string' &&
            student.dept &&
            typeof student.dept === 'string' &&
            student.batch &&
            student.batch.startsWith('batch_') &&
            !isNaN(score) &&
            score !== null &&
            score !== undefined &&
            score >= 0 &&
            score <= 4 &&
            !isNaN(year) &&
            year !== null &&
            year !== undefined &&
            year >= 2000 &&
            year <= 2025 &&
            ['poor', 'good', 'excellent'].includes(student.status) &&
            ['public', 'private'].includes(student.stype)
          );
        });

      const departments = [...new Set(cleanedData.map((student) => student.dept))];
      const medianScores = {};
      departments.forEach((dept) => {
        const deptScores = cleanedData
          .filter((student) => student.dept === dept && student.score !== null)
          .map((student) => Number(student.score));
        deptScores.sort((a, b) => a - b);
        const mid = Math.floor(deptScores.length / 2);
        medianScores[dept] = deptScores.length % 2 !== 0 ? deptScores[mid] : (deptScores[mid - 1] + deptScores[mid]) / 2;
      });

      const finalData = cleanedData.map((student) => {
        if (!student.score || isNaN(student.score)) {
          student.score = medianScores[student.dept] ? medianScores[student.dept].toFixed(2) : 0;
        }
        return student;
      });

      setData(finalData);
    } else {
      console.error('Uploaded data does not match HighSchool or University schema');
      console.log('Expected HighSchool columns:', highSchoolColumns);
      console.log('Expected University columns:', universityColumns);
      console.log('Found columns:', columns);
      setData([]);
      setDataType(null);
      alert(
        'Invalid data format. Please ensure your CSV contains the required columns:\n' +
        '- HighSchool: English, Math, Civic, Physics, Chemistry, Biology, Amharic, Average, Predictionclass, Absent, Rank\n' +
        '- University: Dept, Batch, Score, DegreeAwardedDate, Status, Stype'
      );
    }
  };

  useEffect(() => {
    console.log('Current data state:', data);
    console.log('Detected data type:', dataType);
  }, [data, dataType]);

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)',
          mb: 6,
        }}
      >
        <Fade in={true} timeout={{ enter: 1000 }}>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 12,
              textAlign: 'center',
              width: { xs: '90%', sm: '70%', md: '40%' },
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: '#212121', fontWeight: 600 }}>
              <CloudUpload
                sx={{
                  verticalAlign: 'middle',
                  mr: 1,
                  color: '#FFD700',
                  fontSize: 40,
                  animation: 'pulse 1.5s infinite',
                }}
              />
              Upload Your Data
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#212121' }}>
              Select a CSV file to upload (High School or University data)
            </Typography>
            <DataUploader onDataUpload={handleDataUpload} />
            <Typography variant="body2" sx={{ mt: 1, color: '#212121' }}>
              {data.length > 0
                ? `${data.length} ${dataType} records uploaded successfully`
                : 'No file chosen'}
            </Typography>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default DataUpload;