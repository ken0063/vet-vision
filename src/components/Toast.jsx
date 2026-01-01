import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />
};

const bgColors = {
  success: 'bg-slate-900/90 border-green-500/20',
  error: 'bg-slate-900/90 border-red-500/20',
  info: 'bg-slate-900/90 border-blue-500/20'
};

export const Toast = ({ message, type = 'info', onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl min-w-[300px] max-w-md ${bgColors[type]}`}
    >
      {icons[type]}
      <p className="text-white text-sm font-medium flex-1">{message}</p>
      <button 
        onClick={onClose}
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
