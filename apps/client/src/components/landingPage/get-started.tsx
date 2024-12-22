import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function GetStarted() {
  return (
    <section id="get started" className="py-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto ">
        <div className="backdrop-blur-lg bg-primary-200/30 rounded-2xl p-8 md:p-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-lg text-white/90 mb-12">
              Join thousands of students who are already studying smarter, not
              harder. Download StuMate today and experience the difference.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="link"
                className="text-primary-700 px-4 py-2 bg-white hover:bg-white/90 hover:no-underline"
              >
                Open Web Version
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
