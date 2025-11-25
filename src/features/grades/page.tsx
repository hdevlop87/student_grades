'use client';

import { useRef } from 'react';
import { StudentsList } from './components/students-list';
import { GradeTable } from './components/grade-table';
import { FileUpload } from './components/file-upload';
import { Navbar } from '@/components/Nnavbar';
import { useFileProcessor } from '@/hooks/use-file-processor';
import { useStudentsList } from '@/hooks/use-students-list';
import { toast } from 'sonner';

export default function GradesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileProcessor = useFileProcessor();
  const { handlePrintAll, students } = useStudentsList();

  const handleOpenFiles = () => {
    fileInputRef.current?.click();
  };

  const handleSaveData = async () => {
    if (students.length === 0) {
      toast.error('لا توجد بيانات للحفظ');
      return;
    }
    await handlePrintAll();
  };

  const handleClearData = () => {
    if (students.length === 0) {
      toast.error('لا توجد بيانات لمسحها');
      return;
    }
    fileProcessor.clearData();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('تم مسح البيانات بنجاح');
  };

  return (
    <>
      <Navbar
        onOpenFiles={handleOpenFiles}
        onSaveData={handleSaveData}
        onClearData={handleClearData}
      />
      <div className="flex justify-between gap-3 w-full h-screen pb-20 overflow-y-auto bg-gray-100 p-3 print:p-0 print:grid-cols-1">
  
          <StudentsList />
    
          <GradeTable />
    
          <FileUpload fileInputRef={fileInputRef} fileProcessor={fileProcessor} />
     
      </div>
    </>
  );
}