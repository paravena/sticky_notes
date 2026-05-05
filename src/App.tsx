import { useNotes } from './hooks/useNotes'
import { Board } from './components/Board'

export function App() {
  const { notes, addNote } = useNotes()

  return (
    <div className="relative h-full w-full bg-gray-100">
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between bg-white/80 px-6 py-3 shadow-sm backdrop-blur-sm">
        <h1 className="text-lg font-semibold text-gray-800">Sticky Notes</h1>
        <p className="text-sm text-gray-500">
          Double-click on the board to create a note
        </p>
      </header>

      <main className="h-full pt-14">
        <Board notes={notes} onCreateNote={addNote} />
      </main>
    </div>
  )
}
