# Student Grades - Next.js Migration

## Structure

```
src/
├── features/grades/
│   ├── components/
│   │   ├── students-list.tsx
│   │   ├── grade-table.tsx
│   │   └── file-upload.tsx
│   └── page.tsx
├── stores/
│   └── use-students-store.ts
└── types/
    └── student.ts
```

## State Management (Zustand)

**Store:** `src/stores/use-students-store.ts`

**State:**
```ts
students: StudentJSON[]
currentStudentId: string | null
```

**Actions:**
```ts
setStudents(students: StudentJSON[])
setCurrentStudentId(id: string | null)
getCurrentStudent(): StudentJSON | null
clearStudents()
```

**Usage in components:**
```tsx
const students = useStudentsStore(state => state.students);
const setStudents = useStudentsStore(state => state.setStudents);
```

## Types

`StudentJSON` structure:
- `id, name, studentId, class, birthDate`
- `subjects: SubjectData[]`
  - `unit: string`
  - `components: ComponentData[]`
    - `name: string`
    - `point: any`

## Next Steps

- Implement Excel processing logic
- Add template management
- Wire file upload to store
