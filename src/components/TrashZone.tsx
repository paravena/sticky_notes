interface TrashZoneProps {
  visible: boolean
  isOver: boolean
}

export function TrashZone({ visible, isOver }: TrashZoneProps) {
  if (!visible) return null

  return (
    <div
      data-testid="trash-zone"
      className={`absolute bottom-0 left-0 right-0 z-[9999] flex h-24 items-center justify-center transition-colors duration-200 ${
        isOver ? 'bg-red-500/80 text-white' : 'bg-red-100/80 text-red-500'
      }`}
    >
      <span className="text-lg font-medium">
        {isOver ? 'Release to delete' : 'Drag here to delete'}
      </span>
    </div>
  )
}
