'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';

const comparisonData = [
  {
    category: 'Time studying',
    traditional: "Don't have enough time to master all of the material",
    stumate: "Learn more faster and more efficiently - get all A's"
  },
  {
    category: 'Note taking',
    traditional:
      'Spend all of your class time writing what the teacher says instead of participating in the class',
    stumate:
      'Use AI to automatically transcribe your lectures and turn them into detailed summaries and notes'
  },
  {
    category: 'Study aids',
    traditional: 'Waste too much time preparing study aids instead of studying',
    stumate: 'Automatically create flash cards and quizzes for better retention'
  },
  {
    category: 'Learning style',
    traditional: 'Lose efficiency when trying to learn the material',
    stumate: 'Transform content to suit your personal learning styles'
  }
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

export function Benefits() {
  return (
    <section
      id="benefits"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white w-full"
    >
      <div className="w-full max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12 text-primary-700"
        >
          Traditional vs StuMate Learning
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-8 w-5/6 mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-primary-100 rounded-xl p-6 flex flex-col gap-6 justify-between pb-8"
          >
            <h3 className="text-xl font-semibold text-primary-700 mb-4">
              Without StuMate
            </h3>
            {comparisonData.map((item, index) => (
              <motion.div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                variants={itemVariants}
                className="flex gap-4 items-center h-[80px]"
              >
                <XCircle className="size-6 text-red-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-primary-800/60">
                    {item.category}
                  </div>
                  <p className="text-primary-800">{item.traditional}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-primary-950 rounded-xl p-6 flex flex-col gap-6 justify-between"
          >
            <h3 className="text-xl font-semibold mb-4 text-white">
              With StuMate
            </h3>
            {comparisonData.map((item, index) => (
              <motion.div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                variants={itemVariants}
                className="flex gap-4 items-center h-[80px]"
              >
                <CheckCircle className="size-6 text-green-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-white/60">
                    {item.category}
                  </div>
                  <p className="text-white">{item.stumate}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
