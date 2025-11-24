import { useState, useRef } from 'react';
import { StudentManager } from '@/services/student-manager';
import { useStudentsStore } from '@/stores/use-students-store';
import type { StudentJSON } from '@/types/student';

export function useFileProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filesInfo, setFilesInfo] = useState<Array<{ name: string; size: string }>>([]);

  const setStudents = useStudentsStore(state => state.setStudents);
  const setCurrentStudentId = useStudentsStore(state => state.setCurrentStudentId);

  const managerRef = useRef(new StudentManager());

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      setError('لم يتم اختيار ملفات');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Convert FileList to array
      const filesArray = Array.from(files);

      // Set files info for display
      setFilesInfo(
        filesArray.map(file => ({
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`
        }))
      );

      // Process files using StudentManager
      const students = await managerRef.current.processFiles(filesArray);

      // Update Zustand store
      setStudents(students);

      // Select first student by default
      if (students.length > 0) {
        setCurrentStudentId(students[0].studentId);
      }

      return students;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء معالجة الملفات';
      setError(errorMessage);
      console.error('Error processing files:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatistics = () => {
    return managerRef.current.getStatistics();
  };

  const clearData = () => {
    managerRef.current.clear();
    setStudents([]);
    setCurrentStudentId(null);
    setFilesInfo([]);
    setError(null);
  };

  return {
    processFiles,
    getStatistics,
    clearData,
    isProcessing,
    error,
    filesInfo,
    manager: managerRef.current
  };
}