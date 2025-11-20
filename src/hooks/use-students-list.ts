import { useState } from 'react';
import { toast } from 'sonner';
import { useStudentsStore } from '@/stores/use-students-store';
import { exportCurrentStudentPDF, generateStudentPDFBlob } from '@/services/pdfExportService';
import JSZip from 'jszip';

export function useStudentsList() {
   const students = useStudentsStore((state) => state.students);
   const currentStudentId = useStudentsStore((state) => state.currentStudentId);
   const currentStudent = useStudentsStore((state) => state.getCurrentStudent());
   const setCurrentStudentId = useStudentsStore((state) => state.setCurrentStudentId);

   const [isExporting, setIsExporting] = useState(false);
   const [exportingId, setExportingId] = useState<string | null>(null);

   const handleStudentClick = (studentId: string) => {
      setCurrentStudentId(studentId);
   };

   const handlePrintStudent = (studentId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentStudentId(studentId);
      setTimeout(() => {
         window.print();
      }, 100);
   };

   const handleExportStudentPDF = async (studentId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      const student = students.find(s => s.studentId === studentId);
      if (!student) return;

      setCurrentStudentId(studentId);
      setExportingId(studentId);

      setTimeout(async () => {
         try {
            const gradeTableElement = document.querySelector('.grade-table-container') as HTMLElement;
            if (!gradeTableElement) {
               toast.error('لم يتم العثور على جدول الدرجات');
               return;
            }

            await exportCurrentStudentPDF(
               gradeTableElement,
               student.name,
               student.studentId
            );
            toast.success(`تم تصدير ملف PDF للطالب ${student.name} بنجاح`);
         } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('حدث خطأ أثناء تصدير ملف PDF');
         } finally {
            setExportingId(null);
         }
      }, 100);
   };

   const handleSaveAll = async () => {
      if (students.length === 0) {
         toast.error('لا توجد بيانات لحفظها');
         return;
      }

      setIsExporting(true);

      try {
         const zip = new JSZip();
         for (let i = 0; i < students.length; i++) {
            const student = students[i];
            setCurrentStudentId(student.studentId);

            await new Promise(resolve => setTimeout(resolve, 300));

            try {
               const gradeTableElement = document.querySelector('.grade-table-container') as HTMLElement;
               if (gradeTableElement) {
                  const { blob, filename } = await generateStudentPDFBlob(
                     gradeTableElement,
                     student.name,
                     student.studentId
                  );
                  zip.file(filename, blob);
               }
            } catch (error) {
               console.error(`Error generating PDF for ${student.name}:`, error);
            }

            await new Promise(resolve => setTimeout(resolve, 200));
         }

         const zipBlob = await zip.generateAsync({ type: 'blob' });
         const url = URL.createObjectURL(zipBlob);
         const link = document.createElement('a');
         link.href = url;

         const date = new Date().toISOString().split('T')[0];
         link.download = `بيانات_التلاميذ_${date}.zip`;

         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         URL.revokeObjectURL(url);

         toast.success(`تم حفظ ${students.length} ملف PDF في ملف مضغوط بنجاح`);
      } catch (error) {
         console.error('Error creating ZIP file:', error);
         toast.error('حدث خطأ أثناء إنشاء الملف المضغوط');
      } finally {
         setIsExporting(false);
      }
   };

   return {
      students,
      currentStudentId,
      currentStudent,
      isExporting,
      exportingId,
      handleStudentClick,
      handlePrintStudent,
      handleExportStudentPDF,
      handleSaveAll,
   };
}