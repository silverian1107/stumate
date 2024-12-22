import {
  Brain,
  Edit,
  FileText,
  HelpCircleIcon,
  Layers,
  Sparkles
} from 'lucide-react';

import { FeatureCard } from './feature-card';

export const FeatureSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-black opacity-5" />

      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-medium text-center mb-12 text-white">
          Stumate makes learning and <br />
          research <span className="font-bold">easier</span>
        </h2>

        <div className="grid gap-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={Edit}
              title="Generate Summaries"
              description="Instantly create concise summaries of your notes, articles, or textbooks. Save time and grasp key concepts quickly."
            />
            <FeatureCard
              icon={FileText}
              title="Get Detailed Notes"
              description="Transform brief ideas into comprehensive notes. Expand your knowledge and fill in the gaps with AI-powered note generation."
            />
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            <FeatureCard
              icon={HelpCircleIcon}
              title="Create Quizzes"
              description="Generate custom quizzes from your notes to test your understanding and reinforce learning."
            />
            <FeatureCard
              icon={Layers}
              title="Make Flashcards"
              description="Automatically create flashcards from your notes for efficient memorization and quick review."
            />
            <FeatureCard
              icon={Brain}
              title="Mind Mapping"
              description="Visualize connections between concepts with AI-generated mind maps to enhance understanding."
            />
            <FeatureCard
              icon={Sparkles}
              title="Smart Suggestions"
              description="Receive intelligent suggestions for related topics and resources to deepen your knowledge."
            />
            <FeatureCard
              icon={Sparkles}
              title="And More"
              description="Discover additional features designed to revolutionize your learning experience."
              className="lg:col-span-1 col-span-2"
            />
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI Tutor"
              description="Get personalized explanations, answer questions, and receive guidance on any topic with our advanced AI tutor."
            />
          </div>
        </div>
      </div>
    </section>
  );
};
