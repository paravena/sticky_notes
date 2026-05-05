import { NOTE_COLORS } from '../hooks/useNotes'

interface ColorPickerProps {
  currentColor: string
  onSelectColor: (color: string) => void
}

export function ColorPicker({ currentColor, onSelectColor }: ColorPickerProps) {
  return (
    <div className="flex gap-1 px-2 py-1" data-testid="color-picker">
      {NOTE_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Select color ${color}`}
          className={`h-4 w-4 rounded-full border-2 transition-transform hover:scale-125 ${
            color === currentColor ? 'border-gray-600' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onSelectColor(color)}
        />
      ))}
    </div>
  )
}
