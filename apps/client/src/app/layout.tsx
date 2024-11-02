import StoreProvider from '@/redux/StoreProvider';
import theme from '@/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Lexend_Deca } from 'next/font/google';
import './globals.css';

const lexendDeca = Lexend_Deca({
  variable: '--font-lexend-deca',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StyledEngineProvider injectFirst>
        <body className={`antialiased ${lexendDeca.variable}`}>
          <StoreProvider>
            <AppRouterCacheProvider options={{ key: 'css' }}>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AppRouterCacheProvider>
          </StoreProvider>
        </body>
      </StyledEngineProvider>
    </html>
  );
}
