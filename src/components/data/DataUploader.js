// src/components/data/DataUploader.js
import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import Papa from 'papaparse';

const DataUploader = ({ onDataUpload }) => {
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          onDataUpload(result.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please ensure it is a valid CSV.');
        },
      });
    }
  }, [onDataUpload]);

  return (
    <Button
      variant="contained"
      component="label"
      color="secondary"
      sx={{ fontSize: '1rem', py: 1, px: 3 }}
    >
      Choose File
      <input
        type="file"
        accept=".csv"
        hidden
        onChange={handleFileChange}
      />
    </Button>
  );
};

export default DataUploader;