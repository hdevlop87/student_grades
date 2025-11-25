'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { XlsxTable } from 'xlsx-manager';
import { Loader2, Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, FileIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function RemovePasswordDialog() {

   const [file, setFile] = useState(null);
   const [loading, setLoading] = useState(false);
   const [progress, setProgress] = useState(0);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);
   const [isDragging, setIsDragging] = useState(false);
   const fileInputRef = useRef(null);

   const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
         handleFileSelect(e.target.files[0]);
      }
   };

   const handleFileSelect = (selectedFile) => {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
         setFile(selectedFile);
         setError(null);
         setSuccess(false);
         setProgress(0);
      } else {
         setError('الرجاء اختيار ملف Excel صالح (.xlsx, .xls)');
      }
   };

   const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
   };

   const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
   };

   const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         handleFileSelect(e.dataTransfer.files[0]);
      }
   };

   const handleRemoveFile = () => {
      setFile(null);
      setError(null);
      setSuccess(false);
      setProgress(0);
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   const simulateProgress = () => {
      return new Promise<void>((resolve) => {
         let currentProgress = 0;
         const interval = setInterval(() => {
            currentProgress += 2;
            if (currentProgress >= 100) {
               currentProgress = 100;
               clearInterval(interval);
               resolve();
            }
            setProgress(currentProgress);
         }, 80);
      });
   };

   const handleProcess = async () => {
      if (!file) return;

      setLoading(true);
      setError(null);
      setProgress(0);

      try {
         await simulateProgress();
         const xlsx = new XlsxTable();
         await xlsx.loadXlsx(file);
         await xlsx.removeSheetProtection();
         await xlsx.saveXlsx(file.name);

         setSuccess(true);
      } catch (err: any) {
         console.error(err);
         setError(err.message || 'حدث خطأ أثناء معالجة الملف');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col gap-6 py-4" dir="rtl">
         {!file ? (
            <div
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
               onClick={() => fileInputRef.current?.click()}
               className={cn(
                  "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300",
                  isDragging
                     ? "border-secondary bg-secondary/10 scale-[1.02]"
                     : "border-gray-300 hover:border-secondary hover:bg-gray-50"
               )}
            >
               <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
               />
               <div className="bg-secondary/20 p-4 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-secondary" />
               </div>
               <h3 className="text-lg font-semibold text-gray-700 mb-2">اضغط أو اسحب الملف هنا</h3>
               <p className="text-sm text-gray-500">يدعم ملفات Excel (.xlsx, .xls)</p>
            </div>
         ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
               <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 left-2 h-6 w-6 text-gray-400 hover:text-red-500"
                  onClick={handleRemoveFile}
                  disabled={loading}
               >
                  <X className="w-4 h-4" />
               </Button>

               <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                     <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="font-medium text-gray-900 truncate text-right">{file.name}</h4>
                     <p className="text-sm text-gray-500 text-right">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
               </div>

               {loading && (
                  <div className="mt-4 space-y-2">
                     <div className="flex justify-between text-xs text-gray-500">
                        <span>{progress}%</span>
                        <span>جاري المعالجة...</span>
                     </div>
                     <Progress value={progress} className="h-2" />
                  </div>
               )}
            </div>
         )}

         {error && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
               <AlertCircle className="h-4 w-4 ml-2" />
               <AlertTitle>خطأ</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
            </Alert>
         )}

         {success && (
            <Alert className="border-green-500 text-green-700 bg-green-50 animate-in fade-in slide-in-from-top-2">
               <CheckCircle className="h-4 w-4 ml-2" />
               <AlertTitle>تم بنجاح</AlertTitle>
               <AlertDescription>تمت إزالة الحماية وتحميل الملف بنجاح.</AlertDescription>
            </Alert>
         )}

         <div className="flex justify-end mt-2">
            <Button
               onClick={handleProcess}
               disabled={!file || loading || success}
               className={cn(
                  "w-full h-12 text-lg font-medium transition-all duration-300",
                  success ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/70"
               )}
            >
               {loading ? (
                  <div className="flex items-center gap-2">
                     <Loader2 className="h-5 w-5 animate-spin" />
                     <span>جاري المعالجة...</span>
                  </div>
               ) : success ? (
                  <div className="flex items-center gap-2">
                     <CheckCircle className="h-5 w-5" />
                     <span>تمت المعالجة</span>
                  </div>
               ) : (
                  <div className="flex items-center gap-2">
                     <FileIcon className="h-5 w-5" />
                     <span>إزالة الحماية</span>
                  </div>
               )}
            </Button>
         </div>
      </div>
   );
}
