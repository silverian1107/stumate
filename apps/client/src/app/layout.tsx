import './globals.css';

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';
import { Lexend_Deca } from 'next/font/google';
import { Toaster } from 'sonner';

import SnackBar from '@/components/SnackBar';
import StoreProvider from '@/redux/StoreProvider';
import theme from '@/theme';

import RqProvider from './libs/RqProvider';

const lexendDeca = Lexend_Deca({
  variable: '--font-lexend-deca',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'Stumate',
  description: ''
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StyledEngineProvider injectFirst>
        <body className={`antialiased ${lexendDeca.variable}`}>
          <StoreProvider>
            <AppRouterCacheProvider options={{ key: 'css' }}>
              <ThemeProvider theme={theme}>
                <RqProvider>
                  {children}
                  <Toaster position="bottom-right" />
                  <SnackBar />
                </RqProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </StoreProvider>
        </body>
      </StyledEngineProvider>
    </html>
  );
}
