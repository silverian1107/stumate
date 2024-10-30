'use client';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';

export default function Landing() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, var(--primary-600), var(--accent-300))',
      }}
    >
      <AppBar position="static" color="inherit" className="shadow-sm">
        <Toolbar className="flex items-center gap-8">
          <Typography variant="h4" color="primary" className="font-extrabold">
            StuMate
          </Typography>
          <div className="space-x-6">
            {['Features', 'AI Companion', 'About', 'Download'].map(
              (text, index) => (
                <Link
                  key={index}
                  href="/#"
                  className="text-gray-600  hover:text-primary-600"
                >
                  {text}
                </Link>
              ),
            )}
          </div>
          <div className="space-x-4 ml-auto">
            <Link
              href="/register"
              className="text-gray-600 hover:text-primary "
            >
              <Button
                variant="text"
                color="inherit"
                className="hover:bg-primary-100 px-2 hover:text-primary-800"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="contained"
                color="primary"
                className="text-white"
              >
                Start here
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        className="flex flex-col items-center justify-center text-center gap-8 w-screen h-screen -mt-20"
      >
        <h1 className="font-extrabold text-[3.25rem]">
          Your thoughts, Your <br />
          Knowledges, Your <br />
          <span className="underline font-black">Companion</span>
        </h1>
        <h2 className="text-xl text-gray-800 font-semibold max-w-2xl ">
          Empower your knowledge with AI-driven insights. Your ultimate
          companion for capturing and organizing thoughts.
        </h2>
        <Link
          href="/register"
          className="bg-primary-600 text-white px-8 py-3 font-bold rounded-md shadow hover:bg-primary-600/80"
        >
          Create an account
        </Link>
      </Container>

      <Box component="footer" className="text-center py-6 text-gray-800 -mt-14">
        Copyright © 2024 Stumate Website. All rights reserved.
      </Box>
    </div>
  );
}
