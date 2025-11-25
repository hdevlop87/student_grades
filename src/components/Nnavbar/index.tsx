'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStudentsStore } from '@/stores/use-students-store';
import { useDialog } from '@/components/NMultiDialog/useDialog';
import { UnitReorderModal } from '@/features/grades/components/UnitReorderModal';
import { RemovePasswordDialog } from '@/features/remove-password/components/RemovePasswordDialog';
import type { SubjectData } from '@/types/student';
import { GraduationCap, Folder, FolderOpen, Save, Trash2, Edit, Info, Settings, Unlock } from 'lucide-react';

interface NavbarProps {
  onOpenFiles?: () => void;
  onSaveData?: () => void;
  onClearData?: () => void;
}

export function Navbar({ onOpenFiles, onSaveData, onClearData }: NavbarProps) {
  const currentStudent = useStudentsStore((state) => state.getCurrentStudent());
  const students = useStudentsStore((state) => state.students);
  const setStudents = useStudentsStore((state) => state.setStudents);
  const saveSubjectOrder = useStudentsStore((state) => state.saveSubjectOrder);
  const dialog = useDialog();

  const handleOpenReorder = async () => {
    if (!currentStudent?.subjects) {
      await dialog.alert({
        title: 'تنبيه',
        description: 'الرجاء اختيار تلميذ أولاً',
        confirmText: 'حسناً',
      });
      return;
    }

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

        students.forEach((student) => {
          saveSubjectOrder(student.studentId, newOrder);
        });
      },
    });
  };

  const handleRemovePassword = async () => {
    await dialog.custom({
      title: 'إزالة الحماية من ملف Excel',
      description: 'اختر ملف Excel لإزالة الحماية منه',
      children: <RemovePasswordDialog />,
      size: 'md',
      showButtons: false,
      secondaryButton: {
        text: 'إغلاق',
        variant: 'outline',
      },
    });
  };

  const handleAbout = async () => {
    await dialog.alert({
      title: 'حول البرنامج',
      description: 'نظام إدارة نقط المراقبة\nالإصدار 1.7\n\nتم التطوير بواسطة:\nاستاذ hicham jebara ',
      confirmText: 'إغلاق',
    });
  };

  return (
    <nav className="bg-white shadow-lg print:hidden border-b-2 border-tertiary">
      <div className="flex h-14 items-center justify-between gap-4 px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-secondary" />
          <h1 className="text-lg font-bold text-foreground whitespace-nowrap"> نظام إدارة البيانات الأكاديمية  </h1>
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-2">
          {/* File Menu */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Folder className="w-5 h-5" />
                <span>ملف</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              <DropdownMenuItem onClick={onOpenFiles} className="gap-3">
                <FolderOpen className="w-5 h-5" />
                <span className="font-medium">فتح ملفات</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onSaveData}
                disabled={students.length === 0}
                className="gap-3"
              >
                <Save className="w-5 h-5" />
                <span className="font-medium">حفظ الكل</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onClearData}
                disabled={students.length === 0}
                className="gap-3 text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">مسح البيانات</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit Menu */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="w-5 h-5" />
                <span>تعديل</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              <DropdownMenuItem
                onClick={handleOpenReorder}
                disabled={!currentStudent?.subjects}
                className="gap-3"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">ترتيب الوحدات</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Remove Password - Separate Button */}
          <Button
            variant="outline"
            onClick={handleRemovePassword}
            className="gap-2"
          >
            <Unlock className="w-5 h-5" />
            <span>إزالة الحماية</span>
          </Button>

          {/* About Menu */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Info className="w-5 h-5" />
                <span>حول</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              <DropdownMenuItem onClick={handleAbout}>
                <span className="font-medium">حول البرنامج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {/* Academic Year */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          الموسم الدراسي 2025/2026
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
