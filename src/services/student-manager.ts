import { XlsxTable } from 'xlsx-manager';
import type { StudentJSON } from '@/types/student';

export class StudentManager {
  private studentsMap = new Map<string, StudentJSON>();
  private processedFilesCount = 0;
  private selectedStudentId: string | null = null;

  async processFiles(sources: (File | string)[]): Promise<StudentJSON[]> {
    this.studentsMap.clear();
    this.processedFilesCount = 0;

    for (const source of sources) {
      await this.processFile(source);
      this.processedFilesCount++;
    }

    return Array.from(this.studentsMap.values());
  }

  private async processFile(source: File | string) {
    const xlsx = new XlsxTable();
    await xlsx.loadXlsx(source);

    const className = xlsx.meta('القسم :') || '';
    const subjectName = xlsx.meta('المادة') || '';
    const unit = `وحدة ${subjectName}`;

    const schema = {
      studentId: "رقم التلميذ",
      name: "إسم التلميذ",
      birthDate: "تاريخ الإزدياد",
      grades: ["subject", "grade"]
    };

    const data = xlsx.toJson("رقم التلميذ", schema);

    data.forEach(student => {
      const id = student.studentId;

      if (!this.studentsMap.has(id)) {
        this.studentsMap.set(id, {
          id: id,
          name: student.name,
          studentId: student.studentId,
          class: className,
          birthDate: student.birthDate,
          subjects: []
        });
      }

      const studentData = this.studentsMap.get(id);
      if (studentData) {
        studentData.subjects.push({
          unit: unit,
          components: student.grades.map((g: any) => ({
            name: g.subject,
            point: parseFloat(g.grade) || 0
          }))
        });
      }
    });
  }

  // Select a student by ID
  selectStudent(studentId: string): boolean {
    if (this.studentsMap.has(studentId)) {
      this.selectedStudentId = studentId;
      return true;
    }
    return false;
  }

  // Get the currently selected student
  getSelectedStudent(): StudentJSON | null {
    if (this.selectedStudentId) {
      return this.studentsMap.get(this.selectedStudentId) || null;
    }
    return null;
  }

  // Clear the selection
  clearSelection(): void {
    this.selectedStudentId = null;
  }

  // Check if there's a selected student
  hasSelection(): boolean {
    return this.selectedStudentId !== null;
  }

  // Get the selected student ID
  getSelectedStudentId(): string | null {
    return this.selectedStudentId;
  }

  // Get student by ID
  getStudentById(studentId: string): StudentJSON | null {
    return this.studentsMap.get(studentId) || null;
  }

  // Get multiple students by their IDs
  getStudentsByIds(studentIds: string[]): StudentJSON[] {
    return studentIds
      .map(id => this.studentsMap.get(id))
      .filter((student): student is StudentJSON => student !== undefined);
  }

  // Get first student
  getFirstStudent(): StudentJSON | null {
    const students = Array.from(this.studentsMap.values());
    return students.length > 0 ? students[0] : null;
  }

  // Get last student
  getLastStudent(): StudentJSON | null {
    const students = Array.from(this.studentsMap.values());
    return students.length > 0 ? students[students.length - 1] : null;
  }

  // Get all students
  getStudents(): StudentJSON[] {
    return Array.from(this.studentsMap.values());
  }

  // Get students by class name
  getStudentsByClass(className: string): StudentJSON[] {
    return Array.from(this.studentsMap.values())
      .filter(student => student.class === className);
  }

  // Get all unique class names
  getClassNames(): string[] {
    const classes = new Set<string>();
    this.studentsMap.forEach(student => {
      if (student.class) {
        classes.add(student.class);
      }
    });
    return Array.from(classes);
  }

  // Get count of students
  getStudentCount(): number {
    return this.studentsMap.size;
  }

  // Get count of processed files
  getProcessedFilesCount(): number {
    return this.processedFilesCount;
  }

  // Check if student exists
  hasStudent(studentId: string): boolean {
    return this.studentsMap.has(studentId);
  }

  // Get students sorted by name
  getStudentsSortedByName(): StudentJSON[] {
    return Array.from(this.studentsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }

  // Get statistics
  getStatistics() {
    const classes = this.getClassNames();
    return {
      totalStudents: this.getStudentCount(),
      processedFiles: this.getProcessedFilesCount(),
      classes: classes,
      classCount: classes.length,
      studentsByClass: classes.map(className => ({
        className,
        count: this.getStudentsByClass(className).length
      }))
    };
  }

  clear(): void {
    this.studentsMap.clear();
    this.processedFilesCount = 0;
    this.selectedStudentId = null;
  }
}