import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import type { HTMLProps } from 'react';

import { cn } from '@/lib/utils';

interface FeatureCardProps extends HTMLProps<HTMLDivElement> {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className
}: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        `bg-white/20 backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow`,
        className
      )}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="size-12 mb-4 text-white" />
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-100">{description}</p>
    </motion.div>
  );
}
