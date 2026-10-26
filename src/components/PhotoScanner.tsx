import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, Image as ImageIcon, RefreshCw, AlertCircle, Info, ChevronRight, X, Play } from 'lucide-react';
import { PhotoAnalysisResult, DetectedWord } from '../types';
import { WordCard } from './WordCard';
import { SAMPLE_PHOTOS, SamplePhoto } from '../data/samplePhotos';

interface PhotoScannerProps {
  onSaveWord: (word: DetectedWord) => void;
  savedWordsMap: Record<string, boolean>;
  onOpenRecorder: (word: DetectedWord) => void;
}

export const PhotoScanner: React.FC<PhotoScannerProps> = ({
  onSaveWord,
  savedWordsMap,
  onOpenRecorder,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-load first sample for delight on initial load if no photo chosen
  useEffect(() => {
    if (!selectedImage && !analysisResult) {
      handleSelectSample(SAMPLE_PHOTOS[0]);
    }
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMessage('無法啟動相機。請確保已授權相機權限，或直接上傳照片。(Cannot access camera)');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      setSelectedImage(dataUrl);
      analyzePhotoWithAI(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      stopCamera();
      setSelectedImage(dataUrl);
      analyzePhotoWithAI(dataUrl);
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  const handleSelectSample = (sample: SamplePhoto) => {
    stopCamera();
    setSelectedImage(sample.svgDataUrl);
    setAnalysisResult(sample.analysis);
    setErrorMessage(null);
    setIsAnalyzing(false);
  };

  const analyzePhotoWithAI = async (base64Image: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result: PhotoAnalysisResult = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error('Failed to analyze photo:', err);
      setErrorMessage(
        '分析照片失敗: ' + (err.message || '請再試一次或切換清晰圖片。')
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Introduction Hero Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-indigo-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>日常拍照 × 粵拼標註 × 真人發音示範</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
            拍下香港日常，邊影邊學標準粵拼
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
            專為非華語學生（NCS）打造：拍下街道招牌、茶餐廳菜單或校園通告，AI
            即時在中文字下方標註六聲粵拼，並示範標準香港粵語發音。
          </p>
        </div>
      </div>

      {/* Preset HK Everyday Scenarios */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>點擊即學：香港日常真實情境 (Quick Preset Scenarios)</span>
          </h2>
          <span className="text-xs text-slate-600">無須拍照立即體驗</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_PHOTOS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="group text-left p-3 rounded-2xl bg-white hover:bg-indigo-50/70 border-2 border-slate-200/90 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-200/60 relative">
                  <img
                    src={sample.svgDataUrl}
                    alt={sample.nameZh}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white">
                    {sample.badge}
                  </span>
                </div>
                <div className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {sample.nameZh}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {sample.nameEn}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar: Snap Photo / Upload */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">拍攝或上傳自選照片</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              支援拍攝日常生活中任何含有中文的招牌、包裝、通知單或筆記
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Live Camera Button */}
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>拍照識別 Snap Photo</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-all"
              >
                <X className="w-4 h-4" />
                <span>關閉相機 Close Camera</span>
              </button>
            )}

            {/* Upload Image Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border-2 border-slate-300 hover:border-slate-400 transition-all shadow-2xs active:scale-95"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>上傳照片 Upload</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Live Camera Viewfinder Modal / Section */}
        {isCameraActive && (
          <div className="mt-6 p-4 bg-slate-950 rounded-2xl flex flex-col items-center">
            <div className="relative w-full max-w-lg aspect-4/3 rounded-xl overflow-hidden bg-black flex items-center justify-center border-2 border-indigo-500/50">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Viewfinder Target Overlay */}
              <div className="absolute inset-8 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-xs">
                  請將文字置於框內 Align text inside box
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={capturePhoto}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg transition-transform active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>立即拍攝並分析 Take &amp; Analyze</span>
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}
      </div>

      {/* Analyzing Loading State */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl p-10 border-2 border-indigo-200 shadow-sm text-center my-8 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            AI 正在讀取中文字並標註粵拼...
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Analyzing Chinese characters, generating LSHK Jyutping with tones, and preparing natural Cantonese pronunciation.
          </p>
        </div>
      )}

      {/* Display Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header of Analysis: Scene and Cultural Context */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200/90 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Photo preview thumbnail */}
              {selectedImage && (
                <div className="w-full md:w-56 aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0 shadow-2xs">
                  <img
                    src={selectedImage}
                    alt="Current Scene"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Scene Description */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    識別成功 Detected ({analysisResult.detectedTexts.length} 個字詞)
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  {analysisResult.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {analysisResult.sceneSummary}
                </p>

                {/* Cultural tips accordion / pill list */}
                {analysisResult.culturalTips && analysisResult.culturalTips.length > 0 && (
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl">
                    <div className="text-xs font-bold text-indigo-900 mb-1.5 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-600" />
                      <span>非華語學生香港生活小錦囊 (Hong Kong Life Tips):</span>
                    </div>
                    <ul className="text-xs text-indigo-950 space-y-1 list-disc list-inside">
                      {analysisResult.culturalTips.map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* List of Detected Words with Ruby Jyutping underneath */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>中文字與下方粵拼標註清單 (Characters &amp; Jyutping Pronunciation)</span>
              </h3>
              <span className="text-xs text-slate-500">
                點擊個別字元或真人發音按鈕聆聽
              </span>
            </div>

            {analysisResult.detectedTexts.map((word, idx) => (
              <WordCard
                key={idx}
                index={idx}
                word={word}
                isSaved={!!savedWordsMap[word.chinese]}
                onToggleSave={onSaveWord}
                onOpenRecorder={onOpenRecorder}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
