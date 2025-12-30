import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, History, Loader2, Info, ChevronRight, Scale, Dog, InfoIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { collection, addDoc, query, orderBy, limit, getDocs, startAfter, serverTimestamp } from 'firebase/firestore';
import { db } from './services/firebase';
import { analyzeAnimal } from './services/gemini';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const fileInputRef = useRef(null);

  // Fetch initial history
  useEffect(() => {
    fetchHistory();
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchHistory(true);
    }
  }, [inView, hasMore, loading]);

  const fetchHistory = async (isLoadMore = false) => {
    setLoading(true);
    try {
      let q = query(
        collection(db, "animals"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      if (isLoadMore && lastDoc) {
        q = query(
          collection(db, "animals"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(10)
        );
      }

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isLoadMore) {
        setHistory(prev => [...prev, ...docs]);
      } else {
        setHistory(docs);
      }

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(docs.length === 10);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const processAnalysis = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        const analysis = await analyzeAnimal(base64String, selectedImage.type);
        setResult(analysis);
        
        // Save to Firestore
        await addDoc(collection(db, "animals"), {
          ...analysis,
          createdAt: serverTimestamp()
        });
        
        // Refresh head of history
        fetchHistory();
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Something went wrong during analysis. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 pb-24">
      {/* Header */}
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

      {/* Hero / Instructions */}
      {!previewUrl && !result && (
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
      )}

      {/* Main Analysis Section */}
      <AnimatePresence mode="wait">
        {(previewUrl || result) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6 flex flex-col gap-6"
          >
            {/* Image Preview */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl glass">
              <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
              {analyzing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                  <p className="text-white font-medium animate-pulse">Analyzing with AI...</p>
                </div>
              )}
            </div>

            {/* Analysis Results Card */}
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
                  onClick={() => {
                    setPreviewUrl(null);
                    setResult(null);
                    setSelectedImage(null);
                  }}
                  className="w-full mt-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                >
                  Clear & New Scan
                </button>
              </motion.div>
            )}

            {!result && !analyzing && (
              <button 
                onClick={processAnalysis}
                className="w-full py-4 rounded-2xl bg-primary hover:bg-secondary text-white font-bold shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]"
              >
                Start AI Analysis
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Section */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4 px-2">
          <History className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold">Recent Analyses</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {history.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id} 
              className="glass p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Dog className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{item.animal}</h4>
                  <p className="text-xs text-slate-400">{item.breed} • {item.bodyType}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-sm">{item.estimatedWeight}kg</p>
                <p className="text-[10px] text-slate-500">
                  {item.createdAt?.toDate().toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
          
          {hasMore && (
            <div ref={ref} className="py-8 flex justify-center">
              {loading && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
            </div>
          )}

          {!hasMore && history.length > 0 && (
            <p className="text-center text-xs text-slate-600 py-6">End of history</p>
          )}

          {history.length === 0 && !loading && (
            <div className="text-center py-12 glass rounded-3xl opacity-50 border-dashed border-2 border-white/5">
              <InfoIcon className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-sm">No recent data</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-50">
        <div className="glass p-2 rounded-full shadow-2xl flex items-center justify-between gap-2 border border-white/10">
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all active:scale-[0.96]"
          >
            <Camera className="w-6 h-6" />
            <span>Camera</span>
          </button>
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all active:scale-[0.96]"
          >
            <Upload className="w-6 h-6" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageSelect} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default App;
