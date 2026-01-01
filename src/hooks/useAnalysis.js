import { useState, useCallback } from 'react';
import { AnimalService } from '../services/animalService';
import { useToast } from '../context/ToastContext';

/**
 * useAnalysis handles the state and logic for animal image analysis.
 * Adheres to SRP by isolating analysis-specific logic.
 */
export const useAnalysis = (onSuccess) => {
  const { addToast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);

  const selectImage = useCallback((file) => {
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    try {
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result.split(',')[1]);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedImage);
      });

      const analysis = await AnimalService.performAnalysis(base64String, selectedImage.type);
      setResult(analysis);
      addToast('Analysis completed successfully!', 'success');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Analysis failed:", error);
      addToast(error.message || "Analysis failed. Please try again.", 'error');
    } finally {
      setAnalyzing(false);
    }
  }, [selectedImage, onSuccess]);

  return {
    analyzing,
    previewUrl,
    result,
    selectImage,
    clearAnalysis,
    runAnalysis
  };
};
