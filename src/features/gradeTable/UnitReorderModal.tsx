'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SubjectData } from '@/types/student';

// Sortable Item Component
function SortableItem({ subject, index }: { subject: SubjectData; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: subject.unit });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg mb-2 cursor-move hover:bg-gray-50"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold">
        {index + 1}
      </div>
      <div className="flex-1">
        <span className="font-semibold text-gray-800">{subject.unit}</span>
        <span className="text-sm text-gray-500 mr-2">
          ({subject.components.length} مكونات)
        </span>
      </div>
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8h16M4 16h16"
        />
      </svg>
    </div>
  );
}

// Main Modal Component
interface UnitReorderModalProps {
  subjects: SubjectData[];
  onReorder: (orderedSubjects: SubjectData[]) => void;
}

export function UnitReorderModal({ subjects, onReorder }: UnitReorderModalProps) {
  const [items, setItems] = useState(subjects);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.unit === active.id);
        const newIndex = prevItems.findIndex((item) => item.unit === over.id);
        const newOrder = arrayMove(prevItems, oldIndex, newIndex);
        // Call onReorder immediately when items are reordered
        onReorder(newOrder);
        return newOrder;
      });
    }
  };

  return (
    <div className="w-full max-h-[60vh] overflow-y-auto p-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.unit)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((subject, index) => (
            <SortableItem key={subject.unit} subject={subject} index={index} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}