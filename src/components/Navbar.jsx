import { useState } from 'react'
import { Menu, X, BookOpen, Layers3, Sparkles, Target } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#lessons', label: 'Lessons' },
    { href: '#flashcards', label: 'Flashcards' },
    { href: '#quiz', label: 'Quizzes' },
    { href: '#progress', label: 'Progress' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/70 border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Layers3 className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-800">LangLearn</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#lessons" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full transition-colors">
              <BookOpen className="w-4 h-4" /> Start Learning
            </a>
          </nav>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-gray-700 py-2">
                {l.label}
              </a>
            ))}
            <a href="#lessons" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" /> Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
