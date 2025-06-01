// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#008000' }, // Ethiopian green for AppBar
    secondary: { main: '#FFD700' }, // Ethiopian yellow for buttons and accents
    chartAccent: { main: '#FF0000' }, // Ethiopian red for charts
    background: { default: '#F5F7FA' },
    neutral: { main: '#212121' },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h4: { fontWeight: 700, color: '#008000', letterSpacing: 1 },
    h6: { fontWeight: 600, color: '#212121' },
    body1: { color: '#212121' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 12,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#212121',
          '&:hover': {
            backgroundColor: '#FFD700', // Yellow on hover
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#FFD700', // Yellow for icon buttons
        },
      },
    },
  },
});

export default theme;