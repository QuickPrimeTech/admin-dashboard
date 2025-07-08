import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

export function SortableFAQCard({
  id,
  children,
}: {
  id: number;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-move"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {children}
    </div>
  );
}
