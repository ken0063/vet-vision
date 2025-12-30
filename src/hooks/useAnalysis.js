import { useState, useCallback } from 'react';
import { AnimalService } from '../services/animalService';

/**
 * useAnalysis handles the state and logic for animal image analysis.
 * Adheres to SRP by isolating analysis-specific logic.
 */
export const useAnalysis = (onSuccess) => {
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
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        const analysis = await AnimalService.performAnalysis(base64String, selectedImage.type);
        setResult(analysis);
        if (onSuccess) onSuccess();
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Something went wrong during analysis.");
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
