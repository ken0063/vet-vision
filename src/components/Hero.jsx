import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export const Hero = () => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="mt-8 text-center"
  >
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Scale className="text-primary w-10 h-10" />
    </div>
    <h2 className="text-xl font-semibold mb-2">Ready to Analyze?</h2>
    <p className="text-slate-400 text-sm px-8">
      Take a clear photo of the animal to estimate its weight, breed, and body condition.
    </p>
  </motion.div>
);
