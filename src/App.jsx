import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { Lessons, Flashcards, Quizzes, Progress } from './components/Sections'

function App() {
  const seedDemo = async () => {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    try {
      await fetch(`${base}/seed`, { method: 'POST' })
      alert('Demo data added. Refresh the page if content does not appear immediately.')
    } catch (e) {
      alert('Could not seed demo data. Ensure backend is running.')
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-semibold">First time here?</div>
                <div className="opacity-90">Add a few sample lessons, cards, and a quiz to explore the app.</div>
              </div>
              <button onClick={seedDemo} className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">Seed demo content</button>
            </div>
          </div>
        </div>
        <Lessons />
        <Flashcards />
        <Quizzes />
        <Progress />
        <footer className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            Built with love for language learners.
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
