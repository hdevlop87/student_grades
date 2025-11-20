export interface ComponentData {
  name: string;
  point: any;
}

export interface SubjectData {
  unit: string;
  components: ComponentData[];
}

export interface StudentInfo {
  id: string;
  name: string;
  studentId: string;
  class: string;
  birthDate?: string;
}

export interface StudentJSON extends StudentInfo {
  subjects: SubjectData[];
}

export interface TemplateUnit {
  unit: string;
  components: readonly string[];
}

export interface Template {
  id: string;
  name: string;
  structure: TemplateUnit[];
  componentVariations: Record<string, string[]>;
  subjectMapping: Record<string, string>;
}

export type ProcessingErrorType =
  | 'FILE_LOAD_ERROR'
  | 'METADATA_MISSING'
  | 'SCHEMA_PARSE_ERROR'
  | 'STUDENT_PARSE_ERROR'
  | 'FIELD_VALIDATION_ERROR'
  | 'GRADE_PARSE_ERROR'
  | 'UNKNOWN_ERROR';

export interface ProcessingError {
  type: ProcessingErrorType;
  message: string;
  fileName?: string;
  studentId?: string;
  studentName?: string;
  field?: string;
  rawValue?: any;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface ProcessingResult {
  students: StudentJSON[];
  errors: ProcessingError[];
  warnings: ProcessingError[];
  statistics: {
    totalFiles: number;
    successfulFiles: number;
    failedFiles: number;
    totalStudents: number;
    studentsWithErrors: number;
  };
}
