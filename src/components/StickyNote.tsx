import { useCallback, useEffect, useRef } from 'react'
import type { Note, Position, Size } from '../types/note'
import { useDrag } from '../hooks/useDrag'

const MIN_WIDTH = 120
const MIN_HEIGHT = 80

interface StickyNoteProps {
  note: Note
  onMove: (id: string, position: Position) => void
  onResize: (id: string, size: Size) => void
  onDragStateChange: (isDragging: boolean) => void
  onDragPositionChange: (position: { x: number; y: number } | null) => void
}

export function StickyNote({
  note,
  onMove,
  onResize,
  onDragStateChange,
  onDragPositionChange,
}: StickyNoteProps) {
  const posRef = useRef(note.position)
  const sizeRef = useRef(note.size)

  useEffect(() => {
    posRef.current = note.position
  }, [note.position])

  useEffect(() => {
    sizeRef.current = note.size
  }, [note.size])

  const moveDrag = useDrag({
    onDragStart: () => onDragStateChange(true),
    onDragMove: useCallback(
      (dx: number, dy: number) => {
        const newPos = {
          x: posRef.current.x + dx,
          y: posRef.current.y + dy,
        }
        onMove(note.id, newPos)
      },
      [note.id, onMove],
    ),
    onDragEnd: useCallback(
      (e: MouseEvent) => {
        onDragPositionChange({ x: e.clientX, y: e.clientY })
        onDragStateChange(false)
      },
      [onDragStateChange, onDragPositionChange],
    ),
  })

  const resizeDrag = useDrag({
    onDragMove: useCallback(
      (dx: number, dy: number) => {
        const newSize = {
          width: Math.max(MIN_WIDTH, sizeRef.current.width + dx),
          height: Math.max(MIN_HEIGHT, sizeRef.current.height + dy),
        }
        onResize(note.id, newSize)
      },
      [note.id, onResize],
    ),
  })

  return (
    <div
      data-testid={`note-${note.id}`}
      className="absolute flex select-none flex-col rounded-sm shadow-md"
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        backgroundColor: note.color,
        zIndex: note.zIndex,
      }}
    >
      <div
        className="flex h-7 shrink-0 cursor-grab items-center justify-between rounded-t-sm px-2 active:cursor-grabbing"
        style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
        onMouseDown={moveDrag.onMouseDown}
      >
        <span className="text-[10px] font-medium text-gray-600">
          {note.size.width} × {note.size.height}
        </span>
      </div>

      <div className="flex-1 overflow-hidden p-2 text-sm text-gray-800">
        {note.text}
      </div>

      <div
        className="absolute right-0 bottom-0 h-4 w-4 cursor-se-resize"
        onMouseDown={resizeDrag.onMouseDown}
      >
        <svg
          className="h-full w-full text-gray-400"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14Z" />
        </svg>
      </div>
    </div>
  )
}
