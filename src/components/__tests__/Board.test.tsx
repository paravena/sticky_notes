import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Board } from '../Board'

describe('Board', () => {
  const defaultProps = {
    notes: [],
    onCreateNote: vi.fn(),
    onMoveNote: vi.fn(),
    onResizeNote: vi.fn(),
    onRemoveNote: vi.fn(),
    onBringToFront: vi.fn(),
  }

  it('renders the board element', () => {
    render(<Board {...defaultProps} />)
    expect(screen.getByTestId('board')).toBeInTheDocument()
  })

  it('calls onCreateNote on double click with correct position', () => {
    const onCreateNote = vi.fn()
    render(<Board {...defaultProps} onCreateNote={onCreateNote} />)

    const board = screen.getByTestId('board')

    Object.defineProperty(board, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 600,
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      }),
    })

    fireEvent.doubleClick(board, { clientX: 150, clientY: 200 })

    expect(onCreateNote).toHaveBeenCalledWith({ x: 150, y: 200 })
  })

  it('renders notes passed as props', () => {
    const notes = [
      {
        id: 'note-1',
        position: { x: 10, y: 20 },
        size: { width: 200, height: 150 },
        color: '#fef08a',
        text: '',
        zIndex: 1,
      },
    ]

    render(<Board {...defaultProps} notes={notes} />)
    expect(screen.getByTestId('note-note-1')).toBeInTheDocument()
  })

  it('does not show trash zone when not dragging', () => {
    render(<Board {...defaultProps} />)
    expect(screen.queryByTestId('trash-zone')).not.toBeInTheDocument()
  })
})
