import { describe, it, expect } from 'vitest'
import { notesReducer } from '../useNotes'
import type { Note } from '../../types/note'

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: 'test-1',
    position: { x: 100, y: 200 },
    size: { width: 200, height: 150 },
    color: '#fef08a',
    text: '',
    zIndex: 1,
    ...overrides,
  }
}

describe('notesReducer', () => {
  describe('ADD_NOTE', () => {
    it('adds a note at the specified position', () => {
      const result = notesReducer([], {
        type: 'ADD_NOTE',
        payload: { position: { x: 50, y: 75 } },
      })

      expect(result).toHaveLength(1)
      expect(result[0].position).toEqual({ x: 50, y: 75 })
    })

    it('assigns default size to new notes', () => {
      const result = notesReducer([], {
        type: 'ADD_NOTE',
        payload: { position: { x: 0, y: 0 } },
      })

      expect(result[0].size).toEqual({ width: 200, height: 150 })
    })

    it('generates a unique id for each note', () => {
      let state = notesReducer([], {
        type: 'ADD_NOTE',
        payload: { position: { x: 0, y: 0 } },
      })
      state = notesReducer(state, {
        type: 'ADD_NOTE',
        payload: { position: { x: 100, y: 100 } },
      })

      expect(state[0].id).not.toBe(state[1].id)
    })

    it('assigns incrementing zIndex values', () => {
      let state = notesReducer([], {
        type: 'ADD_NOTE',
        payload: { position: { x: 0, y: 0 } },
      })
      state = notesReducer(state, {
        type: 'ADD_NOTE',
        payload: { position: { x: 100, y: 100 } },
      })

      expect(state[1].zIndex).toBeGreaterThan(state[0].zIndex)
    })

    it('preserves existing notes when adding', () => {
      const existing = makeNote()
      const result = notesReducer([existing], {
        type: 'ADD_NOTE',
        payload: { position: { x: 300, y: 300 } },
      })

      expect(result).toHaveLength(2)
      expect(result[0]).toBe(existing)
    })
  })

  describe('REMOVE_NOTE', () => {
    it('removes the note with the matching id', () => {
      const notes = [makeNote({ id: 'a' }), makeNote({ id: 'b' })]
      const result = notesReducer(notes, {
        type: 'REMOVE_NOTE',
        payload: { id: 'a' },
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('b')
    })

    it('returns the same state if id not found', () => {
      const notes = [makeNote({ id: 'a' })]
      const result = notesReducer(notes, {
        type: 'REMOVE_NOTE',
        payload: { id: 'nonexistent' },
      })

      expect(result).toHaveLength(1)
    })
  })

  describe('MOVE_NOTE', () => {
    it('updates the position of the specified note', () => {
      const notes = [makeNote({ id: 'a', position: { x: 0, y: 0 } })]
      const result = notesReducer(notes, {
        type: 'MOVE_NOTE',
        payload: { id: 'a', position: { x: 50, y: 75 } },
      })

      expect(result[0].position).toEqual({ x: 50, y: 75 })
    })

    it('does not modify other notes', () => {
      const notes = [
        makeNote({ id: 'a', position: { x: 0, y: 0 } }),
        makeNote({ id: 'b', position: { x: 100, y: 100 } }),
      ]
      const result = notesReducer(notes, {
        type: 'MOVE_NOTE',
        payload: { id: 'a', position: { x: 50, y: 50 } },
      })

      expect(result[1].position).toEqual({ x: 100, y: 100 })
    })
  })

  describe('RESIZE_NOTE', () => {
    it('updates the size of the specified note', () => {
      const notes = [makeNote({ id: 'a' })]
      const result = notesReducer(notes, {
        type: 'RESIZE_NOTE',
        payload: { id: 'a', size: { width: 300, height: 250 } },
      })

      expect(result[0].size).toEqual({ width: 300, height: 250 })
    })

    it('does not modify other notes', () => {
      const notes = [
        makeNote({ id: 'a', size: { width: 200, height: 150 } }),
        makeNote({ id: 'b', size: { width: 200, height: 150 } }),
      ]
      const result = notesReducer(notes, {
        type: 'RESIZE_NOTE',
        payload: { id: 'a', size: { width: 400, height: 400 } },
      })

      expect(result[1].size).toEqual({ width: 200, height: 150 })
    })
  })

  describe('BRING_TO_FRONT', () => {
    it('assigns a higher zIndex to the specified note', () => {
      const notes = [
        makeNote({ id: 'a', zIndex: 1 }),
        makeNote({ id: 'b', zIndex: 2 }),
      ]
      const result = notesReducer(notes, {
        type: 'BRING_TO_FRONT',
        payload: { id: 'a' },
      })

      expect(result[0].zIndex).toBeGreaterThan(notes[1].zIndex)
    })

    it('does not modify other notes', () => {
      const notes = [
        makeNote({ id: 'a', zIndex: 1 }),
        makeNote({ id: 'b', zIndex: 2 }),
      ]
      const result = notesReducer(notes, {
        type: 'BRING_TO_FRONT',
        payload: { id: 'a' },
      })

      expect(result[1].zIndex).toBe(2)
    })
  })

  describe('CHANGE_COLOR', () => {
    it('updates the color of the specified note', () => {
      const notes = [makeNote({ id: 'a', color: '#fef08a' })]
      const result = notesReducer(notes, {
        type: 'CHANGE_COLOR',
        payload: { id: 'a', color: '#bbf7d0' },
      })

      expect(result[0].color).toBe('#bbf7d0')
    })

    it('does not modify other notes', () => {
      const notes = [
        makeNote({ id: 'a', color: '#fef08a' }),
        makeNote({ id: 'b', color: '#bfdbfe' }),
      ]
      const result = notesReducer(notes, {
        type: 'CHANGE_COLOR',
        payload: { id: 'a', color: '#fbcfe8' },
      })

      expect(result[1].color).toBe('#bfdbfe')
    })
  })
})
