import { useState } from 'react';
import { toast } from 'sonner';
import { useStudentsStore } from '@/stores/use-students-store';
import { exportCurrentStudentPDF } from '@/services/pdfExportService';

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

      try {
         // Collect all student HTML
         const allStudentsHTML: string[] = [];

         for (let i = 0; i < students.length; i++) {
            const student = students[i];
            setCurrentStudentId(student.studentId);
            setPrintingId(student.studentId);

            // Wait for DOM to update
            await new Promise(resolve => setTimeout(resolve, 200));

            const gradeTableElement = document.querySelector('.grade-table-container') as HTMLElement;
            if (gradeTableElement) {
               allStudentsHTML.push(gradeTableElement.outerHTML);
            }
         }

         // Create single iframe with all students
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

            // Combine all students with page breaks
            const studentsContent = allStudentsHTML
               .map((html, index) => `
                  <div class="student-page" style="${index < allStudentsHTML.length - 1 ? 'page-break-after: always;' : ''}">
                     ${html}
                  </div>
               `)
               .join('');

            iframeDoc.write(`
               <!DOCTYPE html>
               <html dir="rtl" lang="ar">
                  <head>
                     <meta charset="UTF-8">
                     <title>بيان نقط جميع التلاميذ</title>
                     <style>${styles}</style>
                     <style>
                        @media print {
                           body { margin: 0; padding: 0; }
                           @page { margin: 10mm; }
                           .student-page {
                              width: 100%;
                              height: 100%;
                           }
                        }
                     </style>
                  </head>
                  <body>
                     ${studentsContent}
                  </body>
               </html>
            `);
            iframeDoc.close();

            // Wait for content to load
            await new Promise(resolve => setTimeout(resolve, 500));

            // Single print dialog for all students
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();

            // Cleanup
            setTimeout(() => {
               document.body.removeChild(iframe);
            }, 1000);

            toast.success(`جاهز لطباعة ${students.length} تلميذ في مستند واحد`);
         }
      } catch (error) {
         console.error('Error printing all students:', error);
         toast.error('حدث خطأ أثناء التحضير للطباعة');
      } finally {
         setIsPrinting(false);
         setPrintingId(null);
      }
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