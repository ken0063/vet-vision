import React, { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAnalysis } from './hooks/useAnalysis';
import { useHistory } from './hooks/useHistory';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AnalysisCard } from './components/AnalysisCard';
import { HistoryList } from './components/HistoryList';
import { ActionOverlay } from './components/ActionOverlay';

/**
 * Main App Component
 * Refactored to follow SOLID principles:
 * - SRP: Logic extracted to custom hooks (useAnalysis, useHistory)
 * - OCP: Component composition with focused, reusable components
 * - DIP: Depends on abstractions (AnimalService) not concrete implementations
 */
const App = () => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const { history, loading, hasMore, infiniteScrollRef, refresh } = useHistory();
  
  const {
    analyzing,
    previewUrl,
    result,
    selectImage,
    clearAnalysis,
    runAnalysis
  } = useAnalysis(refresh);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) selectImage(file);
  };

  const handleCameraClick = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Permission granted, stop the stream and trigger camera input
      stream.getTracks().forEach(track => track.stop());
      setPermissionDenied(false);
      cameraInputRef.current.click();
    } catch (error) {
      console.error('Camera permission denied:', error);
      setPermissionDenied(true);
      
      // Show alert to user
      alert('Camera permission is required to take photos. Please enable camera access in your browser settings.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 pb-24">
      <Header />

      {!previewUrl && !result && <Hero />}

      <AnimatePresence mode="wait">
        {(previewUrl || result) && (
          <AnalysisCard 
            previewUrl={previewUrl}
            result={result}
            analyzing={analyzing}
            onClear={clearAnalysis}
            onRun={runAnalysis}
          />
        )}
      </AnimatePresence>

      <HistoryList 
        history={history}
        loading={loading}
        hasMore={hasMore}
        infiniteScrollRef={infiniteScrollRef}
      />

      <ActionOverlay 
        onCameraClick={handleCameraClick}
        onUploadClick={handleUploadClick}
      />

      {/* Camera input - Opens camera directly */}
      <input 
        type="file" 
        ref={cameraInputRef} 
        onChange={handleImageSelect} 
        accept="image/*" 
        capture="environment"
        className="hidden" 
      />

      {/* Upload input - Opens file picker */}
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
