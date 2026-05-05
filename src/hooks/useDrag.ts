import { useRef, useCallback, useEffect } from 'react'

interface DragCallbacks {
  onDragStart?: () => void
  onDragMove: (deltaX: number, deltaY: number) => void
  onDragEnd?: (e: MouseEvent) => void
}

export function useDrag(callbacks: DragCallbacks) {
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const callbacksRef = useRef(callbacks)

  useEffect(() => {
    callbacksRef.current = callbacks
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      e.preventDefault()
      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y
      startPos.current = { x: e.clientX, y: e.clientY }
      callbacksRef.current.onDragMove(deltaX, deltaY)
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return
      isDragging.current = false
      callbacksRef.current.onDragEnd?.(e)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDragging.current = true
    startPos.current = { x: e.clientX, y: e.clientY }
    callbacksRef.current.onDragStart?.()
  }, [])

  return { onMouseDown: handleMouseDown }
}
