import { create } from 'zustand';
import type { StudentJSON } from '@/types/student';

interface StudentsState {
  students: StudentJSON[];
  currentStudentId: string | null;
  setStudents: (students: StudentJSON[]) => void;
  setCurrentStudentId: (id: string | null) => void;
  getCurrentStudent: () => StudentJSON | null;
  clearStudents: () => void;
}

export const useStudentsStore = create<StudentsState>((set, get) => ({
  students: [],
  currentStudentId: null,

  setStudents: (students) => set({ students }),

  setCurrentStudentId: (id) => set({ currentStudentId: id }),

  getCurrentStudent: () => {
    const { students, currentStudentId } = get();
    if (!currentStudentId) return null;
    return students.find(s => s.studentId === currentStudentId) || null;
  },

  clearStudents: () => set({ students: [], currentStudentId: null }),
}));
