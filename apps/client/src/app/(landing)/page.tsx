'use client';

import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

import { FeatureSection } from '@/components/landingPage/features-section';
import Footer from '@/components/landingPage/Footer';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button as CustomizedButton } from '@/components/ui/button';
import { FlipWords } from '@/components/ui/flip-words';

import { Benefits } from '../../components/landingPage/benefit';
import { GetStarted } from '../../components/landingPage/get-started';
import { HowItWorks } from '../../components/landingPage/how-it-works';
import { Navbar } from '../../components/landingPage/navbar';
import { ScrollToTopButton } from '../../components/landingPage/scroll-to-top-button';

export default function Landing() {
  const words = [
    'study smarter',
    'organize your thoughts',
    'learn effortlessly',
    'boost productivity',
    'retain better',
    'think clearly'
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <div
      className="min-h-screen w-full relative pt-16"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, var(--primary-600), var(--accent-300))'
      }}
    >
      <Navbar />

      <AuroraBackground className="">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut'
          }}
          className="relative flex flex-col items-center justify-center gap-6 lg:gap-10 px-4 pb-32"
        >
          <div className="-mb-8 text-center text-5xl font-bold dark:text-white lg:text-6xl">
            Let&apos;s <FlipWords words={words} className="text-primary-700" />
          </div>
          <div className="py-4 text-2xl font-extralight dark:text-neutral-200 lg:text-3xl">
            And this, is your{' '}
            <span className="font-bold text-primary-700 underline">
              companion
            </span>
          </div>
          <Link href="/register">
            <CustomizedButton
              variant="ringHover"
              className="bg-primary-700 px-4 py-2 lg:px-8 lg:py-6 text-base lg:text-lg hover:bg-primary-600"
            >
              Join us
            </CustomizedButton>
          </Link>
        </motion.div>
      </AuroraBackground>

      <FeatureSection />
      <Benefits />
      <HowItWorks />
      <GetStarted />
      <Footer />

      <ScrollToTopButton />
    </div>
  );
}
