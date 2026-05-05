export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Note {
  id: string
  position: Position
  size: Size
  color: string
  text: string
  zIndex: number
}

export type NoteAction =
  | { type: 'ADD_NOTE'; payload: { position: Position } }
  | { type: 'REMOVE_NOTE'; payload: { id: string } }
  | { type: 'MOVE_NOTE'; payload: { id: string; position: Position } }
  | { type: 'RESIZE_NOTE'; payload: { id: string; size: Size } }
  | { type: 'BRING_TO_FRONT'; payload: { id: string } }
  | { type: 'CHANGE_COLOR'; payload: { id: string; color: string } }
