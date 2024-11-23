'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    '2xl': true; // Add '2xl' breakpoint
  }
}

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-lexend-deca)'
  },
  palette: {
    primary: {
      main: '#716DF0',
      dark: ''
    },
    secondary: {
      main: '#1C254A',
      dark: ''
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  }
});

export default theme;
