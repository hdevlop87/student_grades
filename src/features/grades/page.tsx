import { StudentsList } from './components/students-list';
import { GradeTable } from './components/grade-table';
import { FileUpload } from './components/file-upload';

export default function GradesPage() {
  return (
    <div className="grid grid-cols-12 gap-3 w-full min-h-screen bg-gray-100 p-3 print:p-0 print:grid-cols-1">
      <div className="col-span-3 bg-white rounded-lg shadow-sm overflow-hidden print:hidden">
        <StudentsList />
      </div>

      <div className="col-span-6 bg-white rounded-lg shadow-sm overflow-hidden h-full ">
        <GradeTable />
      </div>

      <div className="col-span-3 bg-white rounded-lg shadow-sm overflow-hidden print:hidden ">
        <FileUpload />
      </div>
    </div>
  );
}