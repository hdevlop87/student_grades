'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useStudentsList } from '@/hooks/use-students-list';

export function StudentsList() {
   const {
      students,
      currentStudentId,
      isExporting,
      exportingId,
      handleStudentClick,
      handlePrintStudent,
      handleExportStudentPDF,
      handleSaveAll,
   } = useStudentsList();

   if (students.length === 0) {
      return (
         <div className=" flex flex-col items-center gap-3 p-4 w-full h-screen overflow-y-auto">
            <Label className='text-lg mt-10'>  لم يتم تحميل بيانات بعد</Label>
            <img src="/noData.png" alt="Students List" className="w-20 h-20"></img>
         </div>
      );
   }

   return (
      <div className="  flex flex-col gap-3 p-4  h-screen overflow-y-auto w-full">
         <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center justify-center">
               <img src="/list.png" alt="Students List" className="w-8 h-8"></img>
               <h2 className="text-xl"> قائمة التلاميذ</h2>
               <span className="text-sm text-gray-500 mr-2">({students.length})</span>
            </div>

            <Button
               onClick={handleSaveAll}
               disabled={isExporting}
               className="bg-blue-600 text-white px-6 h-9 cursor-pointer font-bold hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
               {isExporting ? (
                  <>
                     <span>⏳</span>
                     <span>جاري الحفظ...</span>
                  </>
               ) : (
                  <>
                     <img src="/save.png" alt="حفظ" className="w-5 h-5" />
                     <span>حفظ الكل</span>
                  </>
               )}
            </Button>
         </div>

         <div className="space-y-2">
            {students.map((student) => (
               <div
                  key={student.studentId}
                  onClick={() => handleStudentClick(student.studentId)}
                  className={`flex justify-between items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${currentStudentId === student.studentId
                     ? 'bg-green-200 border-green-600'
                     : 'bg-gray-50 border-gray-300 hover:border-green-400 hover:bg-green-50'
                     }`}
               >
                  <div className="flex gap-2 items-center">
                     <img src="/student.png" alt={student.name} className="w-10 h-10 rounded-full object-cover"></img>
                     <div className='flex flex-col gap-1'>
                        <div className="text-blue-900 text-md">{student.name}</div>
                        <div className="text-sm text-gray-600"> رقم التلميذ:{student.studentId}</div>
                     </div>
                  </div>

                  <div className="flex  items-center">
                     <button
                        onClick={(e) => handlePrintStudent(student.studentId, e)}
                        className="p-2 hover:bg-green-300 rounded-lg transition-colors"
                        title="طباعة"
                     >
                        <img src="/printer.png" alt={student.name} className="w-6 h-6"></img>
                     </button>
                     <button
                        onClick={(e) => handleExportStudentPDF(student.studentId, e)}
                        disabled={exportingId === student.studentId}
                        className="p-2 hover:bg-blue-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="حفظ PDF"
                     >
                        {exportingId === student.studentId ? (
                           <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                           <img src="/pdf.png" alt={student.name} className="w-6 h-6"></img>
                        )}
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
