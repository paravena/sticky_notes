import type { MouseEvent } from 'react'
import { useCallback, useRef } from 'react'
import type { Note } from '../types/note'
import { StickyNote } from './StickyNote'

interface BoardProps {
  notes: Note[]
  onCreateNote: (position: { x: number; y: number }) => void
}

export function Board({ notes, onCreateNote }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={boardRef}
      data-testid="board"
      className="relative h-full w-full overflow-hidden bg-[repeating-linear-gradient(0deg,transparent,transparent_19px,#e5e7eb_19px,#e5e7eb_20px),repeating-linear-gradient(90deg,transparent,transparent_19px,#e5e7eb_19px,#e5e7eb_20px)]"
      onDoubleClick={handleDoubleClick}
    >
      {notes.map((note) => (
        <StickyNote key={note.id} note={note} />
      ))}
    </div>
  )
}
