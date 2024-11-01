'use client'
import theme from '@/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Lexend_Deca } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/_navbar/NavBar';
// import { useSession } from 'next-auth/react';

// interface Session {
//   user: {
//     name: string;
//     email: string;
//     // ... other user properties
//   };
// }

const lexendDeca = Lexend_Deca({
  variable: '--font-lexend-deca',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const {data: session} = useSession();

  return (
    <html lang="en">
      <StyledEngineProvider injectFirst>
        <body className={`antialiased ${lexendDeca.variable}`}>
          <AppRouterCacheProvider options={{ key: 'css' }}>
            <ThemeProvider theme={theme}>
              {/*session &&*/ <NavBar/>  }
              {/* {<NavBar/>} */}
              {children}
              
              </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </StyledEngineProvider>
    </html>
  );
}
