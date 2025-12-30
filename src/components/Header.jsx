import { motion } from 'framer-motion';

export const Header = () => (
  <header className="flex items-center gap-3 py-6 px-2">
    <motion.img 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      src="/logo.png" 
      alt="Vet Vision Logo" 
      className="w-12 h-12 object-contain"
    />
    <div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
        Vet Vision AI
      </h1>
      <p className="text-xs text-slate-400 font-medium">Precision Animal Health Analysis</p>
    </div>
  </header>
);
