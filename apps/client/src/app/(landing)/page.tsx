'use client';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { FlipWords } from '@/components/ui/flip-words';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Button as CustomizedButton } from '@/components/ui/button';

import Link from 'next/link';

export default function Landing() {
  const words = [
    'study smarter',
    'organize your thoughts',
    'learn effortlessly',
    'boost productivity',
    'retain better',
    'think clearly',
  ];

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
            <Link href="/login" className="text-gray-600 hover:text-primary ">
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

      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center ">
            Let&apos;s <FlipWords words={words} className="text-primary-700" />
          </div>
          <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
            And this, is your{' '}
            <span className="underline text-primary-700 font-bold">
              companion
            </span>
          </div>
          <Link href={'/register'}>
            <CustomizedButton
              variant={'ringHover'}
              className="bg-primary-700 px-8 text-lg py-6 hover:bg-primary-600"
            >
              Join us
            </CustomizedButton>
          </Link>
        </motion.div>
      </AuroraBackground>

      <Box component="footer" className="text-center py-6 text-gray-800 -mt-14">
        Copyright © 2024 Stumate Website. All rights reserved.
      </Box>
    </div>
  );
}
