import { useState } from 'react';
import { toast } from 'sonner';
import { useStudentsStore } from '@/stores/use-students-store';
import { useViewModeStore } from '@/stores/use-view-mode-store';
import { exportCurrentStudentPDF } from '@/services/pdfExportService';

export function useStudentsList() {
   const students = useStudentsStore((state) => state.students);
   const currentStudentId = useStudentsStore((state) => state.currentStudentId);
   const currentStudent = useStudentsStore((state) => state.getCurrentStudent());
   const setCurrentStudentId = useStudentsStore((state) => state.setCurrentStudentId);
   const viewMode = useViewModeStore((state) => state.viewMode);

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
         const containerSelector = viewMode === 'grades'
            ? '.a4-page-container'
            : viewMode === 'exam-schedule'
            ? '.a4-page-container'
            : '.dl-envelope-container';

         const containerElement = document.querySelector(containerSelector) as HTMLElement;
         if (!containerElement) {
            window.print();
            return;
         }

         const iframe = document.createElement('iframe');
         iframe.style.position = 'fixed';
         iframe.style.left = '-10000px';
         iframe.style.top = '0';
         iframe.style.width = viewMode === 'letter' ? '229mm' : '21cm';
         iframe.style.height = viewMode === 'letter' ? '115mm' : '29.7cm';
         iframe.style.border = 'none';
         document.body.appendChild(iframe);

         const iframeDoc = iframe.contentWindow?.document;
         if (!iframeDoc) return;

         const headStyles = Array.from(
            document.head.querySelectorAll('style, link[rel="stylesheet"]')
         )
            .map(node => node.outerHTML)
            .join('\n');

         const pageSize = viewMode === 'letter'
            ? 'size: 229mm 115mm; margin: 0;'
            : 'size: A4; margin: 0;';

         iframeDoc.open();
         iframeDoc.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
               <head>
                  <meta charset="UTF-8">
                  <base href="${window.location.origin}/">
                  ${headStyles}
                  <style>
                     @media print {
                        body { margin: 0; padding: 0; background: white; }
                        @page { ${pageSize} }
                     }
                     body { margin: 0; padding: 0; background: white; }
                     .a4-page-container, .dl-envelope-container {
                        height: auto !important;
                        min-height: auto !important;
                        max-height: none !important;
                        overflow: visible !important;
                        max-width: none !important;
                        box-shadow: none !important;
                     }
                  </style>
               </head>
               <body>${containerElement.outerHTML}</body>
            </html>
         `);
         iframeDoc.close();

         setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
         }, 800);
      }, 150);
   };

   const handleExportStudentPDF = async (studentId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      const student = students.find(s => s.studentId === studentId);
      if (!student) return;

      setCurrentStudentId(studentId);
      setExportingId(studentId);

      setTimeout(async () => {
         try {
            const gradeTableElement = document.querySelector('.dl-envelope-container') as HTMLElement;
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
         // Get the appropriate selector based on view mode
         const containerSelector = viewMode === 'grades'
            ? '.a4-page-container'
            : viewMode === 'exam-schedule'
            ? '.a4-page-container'
            : '.dl-envelope-container';

         // Collect all student HTML
         const allStudentsHTML: string[] = [];

         for (let i = 0; i < students.length; i++) {
            const student = students[i];
            setCurrentStudentId(student.studentId);
            setPrintingId(student.studentId);

            // Wait for DOM to update
            await new Promise(resolve => setTimeout(resolve, 200));

            const containerElement = document.querySelector(containerSelector) as HTMLElement;
            if (containerElement) {
               allStudentsHTML.push(containerElement.outerHTML);
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

            // Set page size and margins based on view mode
            const pageSize = viewMode === 'letter'
               ? 'size: 229mm 115mm; margin: 0;'
               : 'size: A4; margin: 0;';

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
                           @page { ${pageSize} }
                           .student-page {
                              width: 100%;
                              height: 100%;
                           }
                        }
                        .a4-page-container, .dl-envelope-container {
                           height: auto !important;
                           min-height: auto !important;
                           max-height: none !important;
                           overflow: visible !important;
                           max-width: none !important;
                           box-shadow: none !important;
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