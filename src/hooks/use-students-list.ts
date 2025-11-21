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
   const [isPrinting, setIsPrinting] = useState(false);
   const [printingId, setPrintingId] = useState<string | null>(null);

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

   const handlePrintAll = async () => {
      if (students.length === 0) {
         toast.error('لا توجد بيانات للطباعة');
         return;
      }

      setIsPrinting(true);
      let printedCount = 0;

      const printNextStudent = async (index: number) => {
         if (index >= students.length) {
            setIsPrinting(false);
            setPrintingId(null);
            toast.success(`تمت طباعة ${printedCount} من ${students.length} تلميذ بنجاح`);
            return;
         }

         const student = students[index];
         setCurrentStudentId(student.studentId);
         setPrintingId(student.studentId);

         // Wait for DOM to update
         await new Promise(resolve => setTimeout(resolve, 300));

         try {
            const gradeTableElement = document.querySelector('.grade-table-container') as HTMLElement;
            if (!gradeTableElement) {
               console.error('Grade table not found');
               printNextStudent(index + 1);
               return;
            }

            // Create hidden iframe for printing
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow?.document;
            if (iframeDoc) {
               iframeDoc.open();

               // Clone styles from parent document
               const styles = Array.from(document.styleSheets)
                  .map(sheet => {
                     try {
                        return Array.from(sheet.cssRules)
                           .map(rule => rule.cssText)
                           .join('\n');
                     } catch (e) {
                        return '';
                     }
                  })
                  .join('\n');

               iframeDoc.write(`
                  <!DOCTYPE html>
                  <html dir="rtl" lang="ar">
                     <head>
                        <meta charset="UTF-8">
                        <title>بيان نقط - ${student.name}</title>
                        <style>${styles}</style>
                        <style>
                           @media print {
                              body { margin: 0; padding: 20px; }
                              @page { margin: 10mm; }
                           }
                        </style>
                     </head>
                     <body>
                        ${gradeTableElement.outerHTML}
                     </body>
                  </html>
               `);
               iframeDoc.close();

               // Wait for iframe to load
               await new Promise(resolve => setTimeout(resolve, 500));

               // Print
               iframe.contentWindow?.focus();
               iframe.contentWindow?.print();

               printedCount++;

               // Wait for print dialog to be handled
               await new Promise(resolve => setTimeout(resolve, 1000));

               // Cleanup iframe
               document.body.removeChild(iframe);

               // Print next student
               printNextStudent(index + 1);
            }
         } catch (error) {
            console.error(`Error printing for ${student.name}:`, error);
            toast.error(`خطأ في طباعة ${student.name}`);
            printNextStudent(index + 1);
         }
      };

      // Start printing from first student
      printNextStudent(0);
   };

   return {
      students,
      currentStudentId,
      currentStudent,
      isExporting,
      exportingId,
      isPrinting,
      printingId,
      handleStudentClick,
      handlePrintStudent,
      handleExportStudentPDF,
      handlePrintAll,
   };
}