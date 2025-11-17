import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function uid() {
  let id = localStorage.getItem('langlearn_uid')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('langlearn_uid', id) }
  return id
}

export function Lessons() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const r = await fetch(`${API_BASE}/lessons`)
        const j = await r.json()
        setItems(j.items || [])
      } catch (e) {}
      finally { setLoading(false) }
    }
    run()
  }, [])

  const grouped = useMemo(() => {
    const map = {}
    items.forEach(l => { (map[l.language] ||= []).push(l) })
    return map
  }, [items])

  if (loading) return <div className="text-center py-10 text-gray-600">Loading lessons…</div>

  return (
    <section id="lessons" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Featured lessons</h2>
        {Object.keys(grouped).length === 0 && (
          <div className="bg-white rounded-xl shadow p-6">No lessons yet. Use the seed button below to add demo content.</div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(l => (
            <article key={l.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
              <div className="text-xs text-blue-600 font-semibold uppercase">{l.language} • {l.level}</div>
              <h3 className="mt-2 font-semibold text-gray-900">{l.title}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{l.content}</p>
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-1">
                {(l.objectives || []).map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Flashcards() {
  const [items, setItems] = useState([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const run = async () => {
      try {
        const r = await fetch(`${API_BASE}/flashcards?limit=100`)
        const j = await r.json()
        setItems(j.items || [])
        setIdx(0)
      } catch (e) {}
    }
    run()
  }, [])

  const card = items[idx]

  return (
    <section id="flashcards" className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Vocabulary flashcards</h2>
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">No cards yet. Add demo data using the seed button.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white rounded-2xl shadow p-8">
              <div className="text-sm text-gray-500 mb-2">{idx + 1} / {items.length}</div>
              <div className="text-3xl font-bold text-gray-900">{card.term}</div>
              <div className="mt-3 text-gray-700">{card.definition}</div>
              {card.example && <div className="mt-2 text-sm text-gray-600 italic">“{card.example}”</div>}
              <div className="mt-6 flex gap-3">
                <button onClick={() => setIdx(Math.max(0, idx - 1))} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">Prev</button>
                <button onClick={() => setIdx(Math.min(items.length - 1, idx + 1))} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white">Next</button>
              </div>
            </div>
            <div className="text-gray-700">
              Practice a few cards every day to keep your streak alive. Your studied count updates as you flip through.
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function Quizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  useEffect(() => {
    const run = async () => {
      try {
        const r = await fetch(`${API_BASE}/quizzes`)
        const j = await r.json()
        setQuizzes(j.items || [])
      } catch (e) {}
    }
    run()
  }, [])

  const quiz = selected ? quizzes.find(q => q.id === selected) : quizzes[0]

  const scoreIt = () => {
    if (!quiz) return
    const qs = quiz.questions || []
    let correct = 0
    qs.forEach((q, i) => {
      if (String(answers[i]) === String(q.answer)) correct++
    })
    const pct = Math.round((correct / (qs.length || 1)) * 100)
    setResult({ correct, total: qs.length, pct })
  }

  return (
    <section id="quiz" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Quick quizzes</h2>
        {(!quizzes || quizzes.length === 0) ? (
          <div className="bg-white rounded-xl shadow p-6">No quizzes yet. Seed demo data to try one.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white rounded-xl shadow p-4">
              <div className="space-y-2">
                {quizzes.map(q => (
                  <button key={q.id} onClick={() => { setSelected(q.id); setAnswers({}); setResult(null) }} className={`w-full text-left px-3 py-2 rounded ${selected === q.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                    Lesson {q.lesson_id?.slice(0, 4) || '—'} • {q.questions?.length || 0} Qs
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
              {quiz ? (
                <div className="space-y-5">
                  {(quiz.questions || []).map((q, i) => (
                    <div key={i} className="border-b pb-4">
                      <div className="font-medium">{i + 1}. {q.prompt}</div>
                      <div className="mt-2 grid sm:grid-cols-2 gap-2">
                        {(q.options || []).map((opt, oi) => (
                          <label key={oi} className={`border rounded px-3 py-2 cursor-pointer ${String(answers[i]) === String(oi) ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}>
                            <input type="radio" name={`q-${i}`} className="hidden" onChange={() => setAnswers({ ...answers, [i]: oi })} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <button onClick={scoreIt} className="px-4 py-2 rounded-full bg-blue-600 text-white">Check answers</button>
                    {result && <div className="text-gray-700">Score: <span className="font-semibold">{result.pct}%</span> ({result.correct}/{result.total})</div>}
                  </div>
                </div>
              ) : (
                <div>Select a quiz from the list.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function Progress() {
  const [data, setData] = useState(null)
  const id = uid()

  useEffect(() => {
    const run = async () => {
      try {
        const r = await fetch(`${API_BASE}/progress/${id}`)
        const j = await r.json()
        setData(j)
      } catch (e) {}
    }
    run()
  }, [id])

  const bumpStreak = async () => {
    try {
      await fetch(`${API_BASE}/progress`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: id, streak_days: (data?.streak_days || 0) + 1 }) })
      const r = await fetch(`${API_BASE}/progress/${id}`)
      setData(await r.json())
    } catch (e) {}
  }

  return (
    <section id="progress" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Your progress</h3>
            <p className="text-gray-600">Anonymous ID: <span className="font-mono">{id.slice(0,8)}</span></p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-blue-600">{data?.streak_days || 0}🔥</div>
            <div className="text-sm text-gray-600">Day streak</div>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={bumpStreak} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white">Mark today studied</button>
        </div>
      </div>
    </section>
  )
}
