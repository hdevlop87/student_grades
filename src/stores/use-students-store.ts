import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StudentJSON, SubjectData } from '@/types/student';

interface StudentsState {
  students: StudentJSON[];
  currentStudentId: string | null;
  subjectOrders: Record<string, string[]>; // Map of studentId -> ordered unit names
  setStudents: (students: StudentJSON[]) => void;
  setCurrentStudentId: (id: string | null) => void;
  getCurrentStudent: () => StudentJSON | null;
  clearStudents: () => void;
  saveSubjectOrder: (studentId: string, order: string[]) => void;
  applySavedOrder: (subjects: SubjectData[], studentId: string) => SubjectData[];
}

export const useStudentsStore = create<StudentsState>()(
  persist(
    (set, get) => ({
      students: [],
      currentStudentId: null,
      subjectOrders: {},

      setStudents: (students) => set({ students }),

      setCurrentStudentId: (id) => set({ currentStudentId: id }),

      getCurrentStudent: () => {
        const { students, currentStudentId } = get();
        if (!currentStudentId) return null;
        return students.find(s => s.studentId === currentStudentId) || null;
      },

      clearStudents: () => set({ students: [], currentStudentId: null, subjectOrders: {} }),

      saveSubjectOrder: (studentId, order) => {
        const { subjectOrders } = get();
        set({
          subjectOrders: {
            ...subjectOrders,
            [studentId]: order,
          },
        });
      },

      applySavedOrder: (subjects, studentId) => {
        const { subjectOrders } = get();
        const savedOrder = subjectOrders[studentId];

        if (!savedOrder || savedOrder.length === 0) {
          return subjects;
        }

        return savedOrder
          .map(unitName => subjects.find(s => s.unit === unitName))
          .filter((s): s is SubjectData => s !== undefined);
      },
    }),
    {
      name: 'students-store',
      partialize: (state) => ({
        subjectOrders: state.subjectOrders,
      }),
    }
  )
);
