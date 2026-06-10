import type { ReactNode } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableSectionsProps {
  sectionIds: string[]
  onReorder: (activeId: string, overId: string) => void
  children: ReactNode
}

export function SortableSections({ sectionIds, onReorder, children }: SortableSectionsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

export function SectionDragHandle({
  attributes,
  listeners,
}: {
  attributes: ReturnType<typeof useSortable>['attributes']
  listeners: ReturnType<typeof useSortable>['listeners']
}) {
  return (
    <button
      type="button"
      className="resume-section-drag-handle"
      aria-label="拖拽排序区块"
      {...attributes}
      {...listeners}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <circle cx="9" cy="7" r="1.5" />
        <circle cx="15" cy="7" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="17" r="1.5" />
        <circle cx="15" cy="17" r="1.5" />
      </svg>
    </button>
  )
}

interface SortableSectionStripProps {
  id: string
  children: (dragHandle: ReactNode) => ReactNode
}

export function SortableSectionStrip({ id, children }: SortableSectionStripProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  // 仅用 translate，避免 Transform 附带 scale 导致拖拽时文字被放大
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const dragHandle = <SectionDragHandle attributes={attributes} listeners={listeners} />

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`resume-section-strip${isDragging ? ' resume-section-strip--dragging' : ''}`}
    >
      {children(dragHandle)}
    </div>
  )
}
