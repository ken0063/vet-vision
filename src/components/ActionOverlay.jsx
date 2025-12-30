import { Camera, Upload } from 'lucide-react';

export const ActionOverlay = ({ onFileSelect }) => (
  <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-50">
    <div className="glass p-2 rounded-full shadow-2xl flex items-center justify-between gap-2 border border-white/10">
      <button 
        onClick={onFileSelect}
        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all active:scale-[0.96]"
      >
        <Camera className="w-6 h-6" />
        <span>Camera</span>
      </button>
      <button 
        onClick={onFileSelect}
        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all active:scale-[0.96]"
      >
        <Upload className="w-6 h-6" />
        <span>Upload</span>
      </button>
    </div>
  </div>
);
