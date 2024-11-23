'use client';

import { AppBar, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button as CustomizedButton } from '@/components/ui/button';
import { FlipWords } from '@/components/ui/flip-words';
import LoginStatus from '@/components/UserAccount';

export default function Landing() {
  const words = [
    'study smarter',
    'organize your thoughts',
    'learn effortlessly',
    'boost productivity',
    'retain better',
    'think clearly'
  ];

  return (
    <div
      className="min-h-screen w-screen"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, var(--primary-600), var(--accent-300))'
      }}
    >
      <AppBar
        position="static"
        color="inherit"
        className="shadow-sm sm:px-0 md:px-8 lg:px-40"
      >
        <Toolbar className="flex items-center gap-8">
          <h1 className="select-none text-3xl font-extrabold text-primary-700">
            StuMate
          </h1>
          <div className="space-x-6">
            {['Features', 'AI Companion', 'About', 'Download'].map(
              (text, index) => (
                <Link
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  href="/#"
                  className="text-gray-600  hover:text-primary-600"
                >
                  {text}
                </Link>
              )
            )}
          </div>
          <div className="ml-auto space-x-2">
            <LoginStatus />
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
            ease: 'easeInOut'
          }}
          className="relative flex flex-col items-center justify-center gap-10 px-4 pb-32"
        >
          <div className="-mb-8 text-center text-3xl font-bold dark:text-white md:text-7xl">
            Let&apos;s <FlipWords words={words} className="text-primary-700" />
          </div>
          <div className="py-4 text-base font-extralight dark:text-neutral-200 md:text-4xl">
            And this, is your{' '}
            <span className="font-bold text-primary-700 underline">
              companion
            </span>
          </div>
          <Link href="/register">
            <CustomizedButton
              variant="ringHover"
              className="bg-primary-700 px-8 py-6 text-lg hover:bg-primary-600"
            >
              Join us
            </CustomizedButton>
          </Link>
        </motion.div>
      </AuroraBackground>
    </div>
  );
}
