# Architecture

## Overview

The application is a single-page sticky notes board built with **React 19**, **TypeScript**, and **Vite**. Users can create, move, resize, and delete notes on a canvas. The code follows a clear top-down data flow: all state lives in a single `useReducer` hook at the top level (`App`), and child components receive data and callbacks through props. This keeps the logic easy to follow and test.

## Project Structure

```
src/
├── types/          # Shared TypeScript interfaces (Note, Position, Size, actions)
├── hooks/          # Custom hooks (useNotes for state, useDrag for mouse interactions)
├── components/     # UI components (Board, StickyNote, ColorPicker, TrashZone)
├── test/           # Test setup
├── App.tsx         # Root component, connects state to the board
└── main.tsx        # Entry point
```

## Key Decisions

**State management with `useReducer`** — Instead of using multiple `useState` calls or an external library, all note operations (add, remove, move, resize, change color, edit text, bring to front) are handled through a single reducer. This makes state changes predictable and easy to test in isolation.

**Custom `useDrag` hook** — Both moving and resizing notes share the same drag logic. The hook listens to `mousemove` and `mouseup` on `document` (not on the element itself), which prevents the drag from breaking when the cursor moves faster than the element. It uses refs to always read the latest callbacks without re-attaching listeners.

**No external UI libraries** — Following the assignment requirements, all components are built from scratch. Tailwind CSS is used only for styling utilities — it does not provide any behavioral logic or pre-built components.

**Trash zone instead of a delete button** — Deleting a note by dragging it to a drop zone at the bottom of the screen feels more natural than a small button. The zone only appears while dragging, so it stays out of the way during normal use.

**Props over context** — The component tree is shallow (App → Board → StickyNote), so passing props directly is simpler and more explicit than setting up a React context. Every component clearly shows what data it needs and what actions it can trigger.

## Testing

Tests focus on the reducer logic since that is where all the business rules live. Each action type (add, remove, move, resize, bring to front, change color, update text) has dedicated tests that check both the happy path and that unrelated notes are not modified. Component tests cover rendering and basic user interactions like double-clicking to create a note.
