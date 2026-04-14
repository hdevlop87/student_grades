'use client';

import { useEffect, useState } from 'react';
import { useStudentsStore } from '@/stores/use-students-store';
import { useTableStyleStore } from '@/stores/use-table-style-store';
import { TableStyleMenu } from './TableStyleMenu';

export function GradeTable() {

  const currentStudent = useStudentsStore((state) => state.getCurrentStudent());
  const setStudents = useStudentsStore((state) => state.setStudents);
  const students = useStudentsStore((state) => state.students);
  const applySavedOrder = useStudentsStore((state) => state.applySavedOrder);

  const examInfo = useStudentsStore((state) => state.examInfo);

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

  const buildDocumentTitle = (): string => {
    if (!examInfo) return 'بيان نقط  المراقبة : الفرض الأول - الدورة الأولى';
    const ordinals: Record<string, string> = { '1': 'الأولى', '١': 'الأولى', '2': 'الثانية', '٢': 'الثانية' };
    const resolveOrdinal = (v: string) => ordinals[v.trim()] ?? v.trim();
    const examVal = resolveOrdinal(examInfo.exam);
    const triVal = resolveOrdinal(examInfo.trimestre);
    const triText = triVal.includes('دورة') ? triVal : `الدورة ${triVal}`;
    return `بيان نقط  المراقبة : ${examVal} - ${triText}`;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const renderTableRows = (subjects) => {
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
        className="a4-page-container bg-white relative rounded-lg max-w-[1000px] mx-auto h-screen overflow-y-auto p-4"
        style={{
          paddingTop: `${pagePaddingTop}px`,
          paddingLeft: `${pagePaddingX}px`,
          paddingRight: `${pagePaddingX}px`,
        }}
      >

        <div className="relative flex items-center justify-between">
          <div className="w-20 h-20">
            <img src="/leftLogo.png" alt="Left Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col text-center">
            <h1 className="text-2xl text-gray-800">{buildDocumentTitle()}</h1>
            <div className="text-lg text-gray-700">الموسم الدراسي 2025/2026</div>
          </div>

          <div className="w-20 h-20">
            <img src="/rightLogo.png" alt="Right Logo" className="w-full h-full object-contain" />
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
