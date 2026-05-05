import type { MouseEvent } from 'react'
import { useCallback, useRef, useState } from 'react'
import type { Note, Position, Size } from '../types/note'
import { StickyNote } from './StickyNote'
import { TrashZone } from './TrashZone'

const TRASH_ZONE_HEIGHT = 96

interface BoardProps {
  notes: Note[]
  onCreateNote: (position: Position) => void
  onMoveNote: (id: string, position: Position) => void
  onResizeNote: (id: string, size: Size) => void
  onRemoveNote: (id: string) => void
  onBringToFront: (id: string) => void
  onChangeColor: (id: string, color: string) => void
}

export function Board({
  notes,
  onCreateNote,
  onMoveNote,
  onResizeNote,
  onRemoveNote,
  onBringToFront,
  onChangeColor,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isOverTrash, setIsOverTrash] = useState(false)
  const draggingNoteId = useRef<string | null>(null)

  const handleDoubleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target !== boardRef.current) return
      const rect = boardRef.current.getBoundingClientRect()
      onCreateNote({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    [onCreateNote],
  )

  const handleDragStateChange = useCallback(
    (noteId: string) => (dragging: boolean) => {
      setIsDragging(dragging)
      draggingNoteId.current = dragging ? noteId : null
      if (!dragging) {
        setIsOverTrash(false)
      }
    },
    [],
  )

  const handleDragPositionChange = useCallback(
    (noteId: string) => (position: { x: number; y: number } | null) => {
      if (!position || !boardRef.current) return
      const rect = boardRef.current.getBoundingClientRect()
      const isInTrash =
        position.y > rect.bottom - TRASH_ZONE_HEIGHT &&
        position.y <= rect.bottom

      if (isInTrash) {
        onRemoveNote(noteId)
      }
      setIsOverTrash(false)
    },
    [onRemoveNote],
  )

  const handleMouseMoveOnBoard = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !boardRef.current) return
      const rect = boardRef.current.getBoundingClientRect()
      const over =
        e.clientY > rect.bottom - TRASH_ZONE_HEIGHT && e.clientY <= rect.bottom
      setIsOverTrash(over)
    },
    [isDragging],
  )

  return (
    <div
      ref={boardRef}
      data-testid="board"
      className="relative h-full w-full overflow-hidden bg-[repeating-linear-gradient(0deg,transparent,transparent_19px,#e5e7eb_19px,#e5e7eb_20px),repeating-linear-gradient(90deg,transparent,transparent_19px,#e5e7eb_19px,#e5e7eb_20px)]"
      onDoubleClick={handleDoubleClick}
      onMouseMove={handleMouseMoveOnBoard}
    >
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onMove={onMoveNote}
          onResize={onResizeNote}
          onBringToFront={onBringToFront}
          onChangeColor={onChangeColor}
          onDragStateChange={handleDragStateChange(note.id)}
          onDragPositionChange={handleDragPositionChange(note.id)}
        />
      ))}

      <TrashZone visible={isDragging} isOver={isOverTrash} />
    </div>
  )
}
