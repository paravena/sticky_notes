import type { Note } from '../types/note'

interface StickyNoteProps {
  note: Note
}

export function StickyNote({ note }: StickyNoteProps) {
  return (
    <div
      data-testid={`note-${note.id}`}
      className="absolute flex cursor-grab select-none flex-col rounded-sm shadow-md active:cursor-grabbing"
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        backgroundColor: note.color,
        zIndex: note.zIndex,
      }}
    >
      <div className="flex h-6 shrink-0 items-center justify-between rounded-t-sm px-2 opacity-60">
        <span className="text-[10px] font-medium text-gray-700">
          {note.size.width} × {note.size.height}
        </span>
      </div>

      <div className="flex-1 overflow-hidden p-2 text-sm text-gray-800">
        {note.text}
      </div>

      <div className="absolute right-0 bottom-0 h-4 w-4 cursor-se-resize" />
    </div>
  )
}
