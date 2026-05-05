import { useReducer, useCallback } from 'react'
import type { Note, NoteAction, Position } from '../types/note'

const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 150
const NOTE_COLORS = [
  '#fef08a',
  '#bbf7d0',
  '#bfdbfe',
  '#fbcfe8',
  '#fde68a',
  '#c7d2fe',
]

let nextZIndex = 1

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function pickColor(): string {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]
}

export function notesReducer(state: Note[], action: NoteAction): Note[] {
  switch (action.type) {
    case 'ADD_NOTE':
      return [
        ...state,
        {
          id: generateId(),
          position: action.payload.position,
          size: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
          color: pickColor(),
          text: '',
          zIndex: nextZIndex++,
        },
      ]

    case 'REMOVE_NOTE':
      return state.filter((note) => note.id !== action.payload.id)

    case 'MOVE_NOTE':
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, position: action.payload.position }
          : note,
      )

    case 'RESIZE_NOTE':
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, size: action.payload.size }
          : note,
      )

    case 'BRING_TO_FRONT':
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, zIndex: nextZIndex++ }
          : note,
      )

    default:
      return state
  }
}

export function useNotes() {
  const [notes, dispatch] = useReducer(notesReducer, [])

  const addNote = useCallback(
    (position: Position) => {
      dispatch({ type: 'ADD_NOTE', payload: { position } })
    },
    [dispatch],
  )

  const removeNote = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_NOTE', payload: { id } })
    },
    [dispatch],
  )

  const moveNote = useCallback(
    (id: string, position: Position) => {
      dispatch({ type: 'MOVE_NOTE', payload: { id, position } })
    },
    [dispatch],
  )

  const resizeNote = useCallback(
    (id: string, size: { width: number; height: number }) => {
      dispatch({ type: 'RESIZE_NOTE', payload: { id, size } })
    },
    [dispatch],
  )

  const bringToFront = useCallback(
    (id: string) => {
      dispatch({ type: 'BRING_TO_FRONT', payload: { id } })
    },
    [dispatch],
  )

  return { notes, addNote, removeNote, moveNote, resizeNote, bringToFront }
}
