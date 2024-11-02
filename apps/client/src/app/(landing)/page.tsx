'use client';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button as CustomizedButton } from '@/components/ui/button';
import { FlipWords } from '@/components/ui/flip-words';
import { AppBar, Button, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';

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
      className="min-h-screen w-screen"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, var(--primary-600), var(--accent-300))',
      }}
    >
      <AppBar
        position="static"
        color="inherit"
        className="shadow-sm px-0 md:px-[6rem] lg:px-[10rem]"
      >
        <Toolbar className="flex items-center gap-8">
          <h1 className="font-extrabold text-3xl text-primary-700 select-none">
            StuMate
          </h1>
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
            <Link href="/register" className="group">
              <CustomizedButton
                variant={'ringHover'}
                className="bg-primary-700 px-6 uppercase py-2 hover:bg-primary-600"
              >
                Register
              </CustomizedButton>
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
          className="relative flex flex-col gap-10 items-center justify-center px-4 pb-32"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center -mb-8">
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
    </div>
  );
}
