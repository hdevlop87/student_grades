'use client';

import { useState, useEffect, RefObject } from 'react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  fileInputRef: RefObject<HTMLInputElement>;
  fileProcessor: {
    processFiles: (files: FileList | null) => Promise<any>;
    isProcessing: boolean;
    error: string | null;
    filesInfo: Array<{ name: string; size: string }>;
    clearData: () => void;
  };
}

export function FileUpload({ fileInputRef, fileProcessor }: FileUploadProps) {
  const [hasFiles, setHasFiles] = useState(false);
  const { processFiles, isProcessing, error, filesInfo, clearData } = fileProcessor;

  // Reset hasFiles when filesInfo is cleared
  useEffect(() => {
    if (filesInfo.length === 0) {
      setHasFiles(false);
    }
  }, [filesInfo]);

  const handleFileChange = () => {
    const files = fileInputRef.current?.files;
    setHasFiles(files ? files.length > 0 : false);
  };

  const handleProcessFiles = async () => {
    const files = fileInputRef.current?.files;
    const result = await processFiles(files);
  };

  const handleClearData = () => {
    clearData();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setHasFiles(false);
  };

  return (
    <div className="flex w-full flex-col gap-4 bg-white h-screen p-4 rounded-lg  relative overflow-y-auto print:hidden">

      <div className="absolute w-full top-0 right-0 text-center bg-blue-100 p-2 rounded-t-lg">
        <div className="flex w-full items-center gap-2 justify-center">
          <img src="/grades.png" alt="${student.name}" className="w-10 h-10 "></img>
          <h1 className="text-2xl ">نظام إدارة نقط المراقبة</h1>
        </div>
        <p className="text-sm text-gray-600">قم بتحميل ملفات Excel لكل مادة وسيتم إنشاء جداول النقاط</p>
      </div>

      <div className="flex flex-col mt-20 gap-4">
        <h2 className="text-lg ">رفع الملفات</h2>
        <div
          className="flex flex-col items-center gap-2 justify-center border-2 border-dashed border-red-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-gray-50 transition-colors"
        >
          <input
            type="file"
            multiple
            accept=".xlsx,.xls"
            className="hidden"
            id="fileInput"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
            <img src="/folder.png" alt="${student.name}" className="w-16 h-16 " />
            <div className="flex flex-col">
              <div className="text-xl  text-gray-700">اضغط لاختيار ملفات المواد</div>
              <div className="text-md text-gray-500">يمكنك اختيار عدة ملفات Excel</div>
            </div>
          </label>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Button
          onClick={handleProcessFiles}
          disabled={!hasFiles || isProcessing}
          className="w-full bg-tertiary text-md text-white h-12 rounded-lg font-bold hover:bg-tertiary/80 transition shadow-md  disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span>⏳</span>
              <span>جاري المعالجة...</span>
            </>
          ) : (
            <>
              <img src="/analyze.png" alt="معالجة" className="w-6 h-6" />
              <span>معالجة الملفات</span>
            </>
          )}
        </Button>

        {filesInfo.length > 0 && (
          <Button
            onClick={handleClearData}
            className="w-full bg-red-600 text-md text-white h-12 rounded-lg font-bold hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2"
          >
            <img src="/remove.png" alt="مسح" className="w-6 h-6" />
            <span>مسح البيانات</span>
          </Button>
        )}
      </div>

      {filesInfo.length > 0 && (
        <div className="flex flex-col w-full gap-3 mt-6">
          <h2 className="text-lg">📋 الملفات المحملة</h2>
          <div className="flex w-full gap-3 overflow-y-auto flex-col">
            {filesInfo.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-green-100 p-4 w-full rounded border border-green-400">
                <div className='flex gap-2 items-center'>
                  <span className="text-sm">✅</span>
                  <span className="font-medium text-md text-green-900">{file.name}</span>
                </div>
                <span className="text-md text-gray-500">{file.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
