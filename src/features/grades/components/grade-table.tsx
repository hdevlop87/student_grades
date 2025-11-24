'use client';

import { useEffect, useState } from 'react';
import { useStudentsStore } from '@/stores/use-students-store';
import { useTableStyleStore } from '@/stores/use-table-style-store';
import type { SubjectData } from '@/types/student';
import { useDialog } from '@/components/NMultiDialog/useDialog';
import { UnitReorderModal } from './UnitReorderModal';
import { TableStyleMenu } from './TableStyleMenu';

export function GradeTable() {

  const currentStudent = useStudentsStore((state) => state.getCurrentStudent());
  const setStudents = useStudentsStore((state) => state.setStudents);
  const students = useStudentsStore((state) => state.students);
  const saveSubjectOrder = useStudentsStore((state) => state.saveSubjectOrder);
  const applySavedOrder = useStudentsStore((state) => state.applySavedOrder);
  const dialog = useDialog();

  const paddingY = useTableStyleStore((state) => state.paddingY);
  const fontSize = useTableStyleStore((state) => state.fontSize);
  const pagePaddingTop = useTableStyleStore((state) => state.pagePaddingTop);
  const pagePaddingX = useTableStyleStore((state) => state.pagePaddingX);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!currentStudent?.studentId || !currentStudent?.subjects) return;

    const orderedSubjects = applySavedOrder(currentStudent.subjects, currentStudent.studentId);

    if (orderedSubjects.some((subject, idx) => subject.unit !== currentStudent.subjects[idx].unit)) {
      const updatedStudents = students.map((student) => {
        if (student.studentId === currentStudent.studentId) {
          return {
            ...student,
            subjects: orderedSubjects,
          };
        }
        return student;
      });
      setStudents(updatedStudents);
    }
  }, [currentStudent?.studentId]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

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
        const newOrder = reorderedSubjects.map(s => s.unit);
        const updatedStudents = students.map((student) => {
          const reorderedStudentSubjects = newOrder
            .map(unitName => student.subjects.find(s => s.unit === unitName))
            .filter((s): s is SubjectData => s !== undefined);
          return {
            ...student,
            subjects: reorderedStudentSubjects
          };
        });

        setStudents(updatedStudents);

        // Save the order to localStorage for ALL students
        students.forEach((student) => {
          saveSubjectOrder(student.studentId, newOrder);
        });
      },
    });
  };

  const renderTableRows = (subjects: SubjectData[]) => {
    const cellStyle = {
      paddingTop: `${paddingY}px`,
      paddingBottom: `${paddingY}px`,
      fontSize: `${fontSize}px`,
    };

    return subjects.map((subject, idx) => {
      const components = subject.components;
      return components.map((component, compIdx) => (
        <tr key={`${idx}-${compIdx}`}>
          {compIdx === 0 && (
            <td
              rowSpan={components.length}
              className="border border-gray-900 text-black text-center align-middle"
              style={cellStyle}
            >
              {subject.unit}
            </td>
          )}
          <td className="border border-gray-900 text-center align-middle" style={cellStyle}>
            {component.name}
          </td>
          <td className="border border-gray-900 text-center align-middle" style={cellStyle}>
            {component.point}
          </td>
          {compIdx === 0 && (
            <td
              rowSpan={components.length}
              className="border border-gray-900 text-center align-middle"
              style={cellStyle}
            ></td>
          )}
        </tr>
      ));
    });
  };

  return (
    <>

      <div
        className="grade-table-container relative rounded-lg w-full h-full"
        style={{
          paddingTop: `${pagePaddingTop}px`,
          paddingLeft: `${pagePaddingX}px`,
          paddingRight: `${pagePaddingX}px`,
        }}
      >

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

        <div className="flex justify-between mt-2 mb-2 ">
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

        <table
          className="w-full border-collapse"
          style={{ tableLayout: 'fixed' }}
          onContextMenu={handleContextMenu}
        >
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <thead>
            <tr>
              <th
                className="border border-gray-900 text-center align-middle bg-gray-100 text-black"
                style={{
                  paddingTop: `${paddingY}px`,
                  paddingBottom: `${paddingY}px`,
                  fontSize: `${fontSize}px`,
                }}
              >
                الوحدة الدراسية
              </th>
              <th
                className="border border-gray-900 text-center align-middle bg-gray-100 text-black"
                style={{
                  paddingTop: `${paddingY}px`,
                  paddingBottom: `${paddingY}px`,
                  fontSize: `${fontSize}px`,
                }}
              >
                المكونات
              </th>
              <th
                className="border border-gray-900 text-center align-middle bg-gray-100 text-black"
                style={{
                  paddingTop: `${paddingY}px`,
                  paddingBottom: `${paddingY}px`,
                  fontSize: `${fontSize}px`,
                }}
              >
                النقطة
              </th>
              <th
                className="border border-gray-900 text-center align-middle bg-gray-100 text-black"
                style={{
                  paddingTop: `${paddingY}px`,
                  paddingBottom: `${paddingY}px`,
                  fontSize: `${fontSize}px`,
                }}
              >
                ملاحظات
              </th>
            </tr>
          </thead>
          <tbody>
            {currentStudent?.subjects && renderTableRows(currentStudent.subjects)}
          </tbody>
        </table>

      </div>

      {contextMenu && (
        <TableStyleMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
