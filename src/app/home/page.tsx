'use client';

import { GradeTable } from "@/features/gradeTable";
import { ExamScheduleTable } from "@/features/ExamScheduleTable";
import { LetterTable } from "@/features/LetterTable";
import { useStudentsStore } from '@/stores/use-students-store';
import { useViewModeStore } from '@/stores/use-view-mode-store';

export default function AcademicDataPage() {
  const viewMode = useViewModeStore((state) => state.viewMode);
  const currentStudent = useStudentsStore((state) => state.getCurrentStudent());
  const students = useStudentsStore((state) => state.students);

  // Calculate the position of the current student in the list (1-indexed)
  const examPosition = currentStudent
    ? students.findIndex((s) => s.studentId === currentStudent.studentId) + 1
    : 1;

  return (
    <>
      {viewMode === 'grades' ? (
        <GradeTable />
      ) : viewMode === 'exam-schedule' ? (
        <ExamScheduleTable
          studentName={currentStudent?.name}
          examNumber={currentStudent?.studentId}
          examPosition={examPosition}
        />
      ) : (
        <LetterTable
          studentName={currentStudent?.name}
          studentClass={currentStudent?.class}
        />
      )}
    </>
  );
}
