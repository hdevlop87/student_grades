import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Shared styling configuration for PDF generation
 */
const PDF_STYLES = `
  * {
    color: inherit !important;
  }
  .grade-table-container {
    background-color: #ffffff !important;
    color: #000000 !important;
  }
  .grade-table-container table {
    border-color: #1a1a1a !important;
    border-collapse: collapse !important;
  }
  .grade-table-container td,
  .grade-table-container th {
    border-color: #1a1a1a !important;
    color: #000000 !important;
  }
  .grade-table-container .bg-gray-100 {
    background-color: #f3f4f6 !important;
  }
  .grade-table-container .text-blue-800 {
    color: #1e40af !important;
  }
  .grade-table-container .text-gray-800 {
    color: #1f2937 !important;
  }
  .grade-table-container .text-gray-700 {
    color: #374151 !important;
  }
  .grade-table-container .bg-gray-300 {
    background-color: #d1d5db !important;
  }
  .print\\:hidden {
    display: none !important;
  }
`;

/**
 * Core function to generate PDF from HTML element
 */
const generatePDF = async (
  gradeTableElement: HTMLElement,
  studentName: string,
  studentId: string
): Promise<{ pdf: jsPDF; filename: string }> => {
  const canvas = await html2canvas(gradeTableElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.querySelector('.grade-table-container') as HTMLElement;
      if (clonedElement) {
        const style = clonedDoc.createElement('style');
        style.textContent = PDF_STYLES;
        clonedDoc.head.appendChild(style);
        
        const allCells = clonedElement.querySelectorAll('td, th');
        allCells.forEach((cell) => {
          const htmlCell = cell as HTMLElement;
          htmlCell.style.lineHeight = '1';
          htmlCell.style.paddingTop = '12px';
          htmlCell.style.paddingBottom = '12px';
        });
      }
    },
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const pixelsToMm = 0.264583;
  const imgWidthMm = canvas.width * pixelsToMm;
  const imgHeightMm = canvas.height * pixelsToMm;

  const margin = 5;
  const availableWidth = pdfWidth - (margin * 2);
  const availableHeight = pdfHeight - (margin * 2);

  const widthRatio = availableWidth / imgWidthMm;
  const heightRatio = availableHeight / imgHeightMm;
  const ratio = Math.min(widthRatio, heightRatio);

  const finalWidth = imgWidthMm * ratio;
  const finalHeight = imgHeightMm * ratio;

  const imgX = (pdfWidth - finalWidth) / 2;
  const imgY = margin;

  pdf.addImage(imgData, 'PNG', imgX, imgY, finalWidth, finalHeight);

  const sanitizedName = studentName.replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '');
  const filename = `${sanitizedName}_${studentId}.pdf`;

  return { pdf, filename };
};

/**
 * Generates PDF blob for a student (for use in ZIP)
 */
export const generateStudentPDFBlob = async (
  gradeTableElement: HTMLElement,
  studentName: string,
  studentId: string
): Promise<{ blob: Blob; filename: string }> => {
  try {
    const { pdf, filename } = await generatePDF(gradeTableElement, studentName, studentId);
    const blob = pdf.output('blob');
    return { blob, filename };
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw error;
  }
};

/**
 * Exports the current grade table as PDF
 */
export const exportCurrentStudentPDF = async (
  gradeTableElement: HTMLElement,
  studentName: string,
  studentId: string
): Promise<void> => {
  try {
    const { pdf, filename } = await generatePDF(gradeTableElement, studentName, studentId);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};