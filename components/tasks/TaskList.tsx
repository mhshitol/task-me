"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useReorderTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import type { Task } from "@/types";
import { useState, useRef } from "react";

function SortableTaskItem({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.4 : 1,
    zIndex:     isDragging ? 50 : "auto" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing touch-none"
    >
      <TaskCard task={task} />
    </div>
  );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const reorderTasks       = useReorderTasks();
  const [items, setItems]  = useState<Task[]>(tasks);
  const didDragRef         = useRef(false);

  // Sync when tasks change externally
  if (tasks.map((t) => t.id).join() !== items.map((t) => t.id).join()) {
    setItems(tasks);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart() {
    didDragRef.current = false;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    didDragRef.current = true;

    const oldIndex  = items.findIndex((t) => t.id === active.id);
    const newIndex  = items.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setItems(reordered);
    reorderTasks.mutate(reordered.map((t) => t.id));

    // Block any click events that fire right after drop
    setTimeout(() => { didDragRef.current = false; }, 300);
  }

  if (items.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className="space-y-2"
          onClickCapture={(e) => {
            if (didDragRef.current) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
        >
          {items.map((task) => (
            <SortableTaskItem key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}