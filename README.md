# Sticky Notes

A single-page sticky notes board built with React, TypeScript, and Vite. Create, move, resize, edit, and delete notes on an interactive canvas.

**Live demo:** [paravena.github.io/sticky_notes](https://paravena.github.io/sticky_notes/)

## Features

- **Create notes** — double-click anywhere on the board
- **Move notes** — drag from the header bar
- **Resize notes** — drag from the bottom-right corner (minimum 120×80)
- **Delete notes** — drag a note to the trash zone at the bottom
- **Edit text** — click the note body and start typing
- **Change color** — pick from six colors below the header
- **Z-order** — dragging a note brings it to the front

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the dev server               |
| `npm run build`      | Build for production               |
| `npm run preview`    | Preview the production build       |
| `npm run test`       | Run tests once                     |
| `npm run test:watch` | Run tests in watch mode            |
| `npm run lint`       | Lint the codebase with ESLint      |
| `npm run format`     | Format source files with Prettier  |

## Tech Stack

- **React 19** with TypeScript
- **Vite** for bundling and dev server
- **Tailwind CSS** for styling (utility classes only, no UI library)
- **Vitest** + **Testing Library** for unit tests
- **ESLint** + **Prettier** for code quality

## Architecture

```
src/
├── types/          # Shared types (Note, Position, Size, actions)
├── hooks/          # useNotes (state), useDrag (mouse drag logic)
├── components/     # Board, StickyNote, ColorPicker, TrashZone
├── test/           # Test setup
├── App.tsx         # Root — connects state to the board
└── main.tsx        # Entry point
```

**Data flow** is top-down. All note state lives in a single `useReducer` inside `useNotes`. The `App` component passes data and callbacks to `Board`, which passes them to each `StickyNote`. There is no shared context or external state library — the component tree is shallow enough that props are simple and explicit.

**Drag handling** is extracted into a reusable `useDrag` hook. It attaches `mousemove` and `mouseup` listeners to `document` so the drag keeps working even when the cursor moves faster than the element. Both move and resize use the same hook with different callbacks.

For more details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Trade-offs

- **Props over context** — The tree is only three levels deep (App → Board → StickyNote), so props are straightforward. If the app grew to include features like multi-board support or collaborative editing, a context or state library would make more sense.
- **Module-level `nextZIndex` counter** — Z-index values come from a simple incrementing counter outside of React state. This is easy to reason about but would not survive a page reload. For persistence, this would need to be derived from saved data.
- **No local storage or API** — Notes exist only in memory. Adding persistence was left out to keep the scope focused, but the reducer design makes it easy to add later (serialize on change, load on init).
- **Mouse-only drag** — The drag implementation uses mouse events. Touch support would require adding `touchstart`, `touchmove`, and `touchend` handlers to the `useDrag` hook.
- **Minimal test coverage on drag** — Drag interactions rely on global mouse events, which are hard to simulate realistically in jsdom. Tests focus on the reducer (where all business logic lives) and basic component rendering instead.
