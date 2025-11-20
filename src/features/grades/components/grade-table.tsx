'use client';

import { useStudentsStore } from '@/stores/use-students-store';
import type { SubjectData } from '@/types/student';
import { useDialog } from '@/components/NMultiDialog/useDialog';
import { UnitReorderModal } from './UnitReorderModal';

export function GradeTable() {

  const currentStudent = useStudentsStore((state) => state.getCurrentStudent());
  const setStudents = useStudentsStore((state) => state.setStudents);
  const students = useStudentsStore((state) => state.students);
  const dialog = useDialog();

  const handleOpenReorder = async () => {
    if (!currentStudent?.subjects) return;

    let reorderedSubjects: SubjectData[] = currentStudent.subjects;

    await dialog.custom({
      title: 'ترتيب الوحدات الدراسية',
      description: 'اسحب الوحدات لإعادة ترتيبها',
      children: (
        <UnitReorderModal
          subjects={currentStudent.subjects}
          onReorder={(orderedSubjects) => {
            reorderedSubjects = orderedSubjects;
          }}
        />
      ),
      size: 'lg',
      confirmText: 'حفظ الترتيب',
      cancelText: 'إلغاء',
      onConfirm: () => {
        const updatedStudents = students.map((student) =>
          student.id === currentStudent.id
            ? { ...student, subjects: reorderedSubjects }
            : student
        );
        setStudents(updatedStudents);
      },
    });
  };

  const renderTableRows = (subjects: SubjectData[]) => {
    return subjects.map((subject, idx) => {
      const components = subject.components;
      return components.map((component, compIdx) => (
        <tr key={`${idx}-${compIdx}`}>
          {compIdx === 0 && (
            <td
              rowSpan={components.length}
              className="border border-gray-900  text-black  p-2 text-center align-middle "
            >
              {subject.unit}
            </td>
          )}
          <td className="border border-gray-900 p-2 text-center align-middle">
            {component.name}
          </td>
          <td className="border border-gray-900 p-2 text-center align-middle">
            {component.point}
          </td>
          {compIdx === 0 && (
            <td
              rowSpan={components.length}
              className="border border-gray-900 p-2 text-center align-middle "
            ></td>
          )}
        </tr>
      ));
    });
  };

  return (
    <>

      <div className="grade-table-container relative  rounded-lg p-6 w-full h-full ">
      {/* Gear button - absolute positioned at top right */}
      {currentStudent?.subjects && (
        <button
          onClick={handleOpenReorder}
          className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors  z-10 cursor-pointer print:hidden"
          title="ترتيب الوحدات"
        >
          <img src="/settings.png" alt="Reorder Units" className="w-7 h-7" />
        </button>
      )}

        <div className="relative flex items-center">
          <div className="image flex w-20 h-20 bg-gray-300 ">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>

          <div className="absolute left-0 right-0 flex flex-col text-center">
            <h1 className="text-2xl text-gray-800">بيان نقط المراقبة الأولى الدورة الأولى</h1>
            <div className="text-lg text-gray-700">الموسم الدراسي 2025/2026</div>
          </div>
        </div>

        <div className="flex justify-between mt-3 mb-6">
          <div className="flex items-center gap-3">
            <label className="">إسم التلميذ (ة):</label>
            <span className="text-blue-800 text-lg">
              {currentStudent?.name || '-'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="">القسم:</label>
            <span className="text-blue-800  text-lg">
              {currentStudent?.class || '-'}
            </span>
          </div>
        </div>

        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className="border border-gray-900 p-2 text-center align-middle bg-gray-100 text-black text-sm">
                الوحدة الدراسية
              </th>
              <th className="border border-gray-900 p-2 text-center align-middle bg-gray-100  text-black  text-sm">
                المكونات
              </th>
              <th className="border border-gray-900 p-2 text-center align-middle bg-gray-100   text-black  text-sm">
                النقطة
              </th>
              <th className="border border-gray-900 p-2 text-center align-middle bg-gray-100  text-black  text-sm">
                ملاحظات
              </th>
            </tr>
          </thead>
          <tbody>
            {currentStudent?.subjects && renderTableRows(currentStudent.subjects)}
          </tbody>
        </table>


      </div>
    </>
  );
}
