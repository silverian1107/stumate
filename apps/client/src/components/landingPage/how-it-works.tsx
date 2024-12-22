import { motion } from 'framer-motion';
import { BookOpen, Edit2, Rocket, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Edit2,
    title: 'Write your notes',
    description:
      'Organize your thoughts and ideas with our intuitive note-taking tool'
  },
  {
    icon: Sparkles,
    title: 'AI Processing',
    description:
      'Our AI analyzes and transforms your content into optimized study materials'
  },
  {
    icon: BookOpen,
    title: 'Personalized Learning',
    description:
      'Get customized summaries, quizzes, and study aids tailored to your style'
  },
  {
    icon: Rocket,
    title: 'Excel in Studies',
    description: 'Achieve better grades with less time spent studying'
  }
];

export function HowItWorks() {
  return (
    <section
      id="how it works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary-700">
          How StuMate Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary-100 p-4 rounded-full mb-6">
                    <step.icon className="size-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-primary-200" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
