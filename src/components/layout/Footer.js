// src/components/layout/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ py: 3, textAlign: 'center', backgroundColor: '#f5f5f5', mt: 'auto' }}>
      <Typography variant="body2" color="textSecondary">
        © 2025 Data Visualization Dashboard. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;