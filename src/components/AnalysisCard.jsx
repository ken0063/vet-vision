import { motion } from 'framer-motion';
import { Dog, Loader2 } from 'lucide-react';

export const AnalysisCard = ({ previewUrl, result, analyzing, onClear, onRun }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-6 flex flex-col gap-6"
  >
    <div className="relative rounded-3xl overflow-hidden shadow-2xl glass">
      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
      {analyzing && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
          <p className="text-white font-medium animate-pulse">Analyzing with AI...</p>
        </div>
      )}
    </div>

    {result && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-6 shadow-xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{result.animal}</h3>
            <p className="text-primary font-medium">{result.breed}</p>
          </div>
          <div className="bg-primary/20 p-3 rounded-2xl">
            <Dog className="text-primary w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Body Type</p>
            <p className="font-semibold">{result.bodyType}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Frame Type</p>
            <p className="font-semibold">{result.frameType}</p>
          </div>
          <div className="col-span-2 bg-primary/10 p-4 rounded-2xl border border-primary/20 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-primary uppercase tracking-wider mb-1">Est. Weight</p>
              <p className="text-2xl font-bold text-white">{result.estimatedWeight} <span className="text-sm font-normal text-slate-400">kg</span></p>
            </div>
            <div className="text-right text-xs">
              <p className="text-slate-400 mb-1">Normal Range</p>
              <p className="font-medium text-white">{result.weightRange}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClear}
          className="w-full mt-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
        >
          Clear & New Scan
        </button>
      </motion.div>
    )}

    {!result && (
      <button 
        onClick={onRun}
        disabled={analyzing}
        className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all transform ${
          analyzing 
            ? 'bg-slate-600 cursor-not-allowed' 
            : 'bg-primary hover:bg-secondary shadow-primary/20 active:scale-[0.98]'
        } text-white flex items-center justify-center gap-2`}
      >
        {analyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          'Start AI Analysis'
        )}
      </button>
    )}
  </motion.div>
);
