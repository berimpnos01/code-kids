import { useState, useEffect, useRef, useCallback } from 'react'
import { EXERCISES, HERO_LINES, type Exercise, type ExerciseLevel } from './data/exercises'

type Page = 'home' | 'exercises' | 'detail' | 'games' | 'progress' | 'results' | 'teacher'
type TTTMode = 'pvp' | 'ai'
const COLS = 20, ROWS = 20, CELL = 20

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function levelLabel(l: ExerciseLevel) {
  return l === 'beginner' ? '🌱 Cơ bản' : l === 'intermediate' ? '🌿 Trung cấp' : '🌳 Nâng cao'
}
function storeGet(k: string, def: string) {
  try { return localStorage.getItem(k) ?? def } catch { return def }
}
function storeSet(k: string, v: string) {
  try { localStorage.setItem(k, v) } catch { }
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [stars, setStars] = useState(() => parseInt(storeGet('ck_stars', '0')))
  const [completed, setCompleted] = useState<string[]>(() => JSON.parse(storeGet('ck_completed', '[]')))
  const [curEx, setCurEx] = useState<Exercise | null>(null)
  const [curStep, setCurStep] = useState(0)
  const [filter, setFilter] = useState<'all' | ExerciseLevel>('all')
  const [heroLines, setHeroLines] = useState<string[]>([])

  // Modal states
  const [snakeOpen, setSnakeOpen] = useState(false)
  const [tttOpen, setTttOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [successStars, setSuccessStars] = useState(0)

  // TTT
  const [tttMode, setTttMode] = useState<TTTMode>('pvp')
  const [tttBoard, setTttBoard] = useState<string[]>(Array(9).fill(''))
  const [tttTurn, setTttTurn] = useState<'X' | 'O'>('X')
  const [tttOver, setTttOver] = useState(false)
  const [tttStatus, setTttStatus] = useState('Lượt của: ❌')
  const [tttWinLine, setTttWinLine] = useState<number[]>([])

  // Snake
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snakeRef = useRef<{ x: number, y: number }[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }])
  const dirRef = useRef({ x: 1, y: 0 })
  const foodRef = useRef({ x: 5, y: 5 })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const runningRef = useRef(false)
  const [snakeScore, setSnakeScore] = useState(0)
  const [snakeHigh, setSnakeHigh] = useState(() => parseInt(storeGet('ck_snake_high', '0')))
  const [snakeOverlay, setSnakeOverlay] = useState({ show: true, icon: '🐍', title: 'Rắn Săn Mồi', msg: 'Dùng phím mũi tên hoặc WASD', startLabel: '▶ Bắt Đầu' })

  // Per-step state
  const [quizAnswered, setQuizAnswered] = useState<{ [i: number]: { chosen: number, correct: boolean } }>({})
  const [codeVals, setCodeVals] = useState<{ [i: number]: string }>({})
  const [hints, setHints] = useState<{ [i: number]: boolean }>({})
  const [dropZone, setDropZone] = useState<{ [i: number]: string[] }>({})
  const [feedback, setFeedback] = useState<{ [i: number]: { ok: boolean, text: string } | null }>({})

  // Persist
  useEffect(() => { storeSet('ck_stars', String(stars)) }, [stars])
  useEffect(() => { storeSet('ck_completed', JSON.stringify(completed)) }, [completed])

  // Hero typing animation
  useEffect(() => {
    if (page !== 'home') return
    setHeroLines([])
    HERO_LINES.forEach((_, i) => {
      setTimeout(() => setHeroLines(prev => [...prev, HERO_LINES[i].text]), i * 140)
    })
  }, [page])

  // Snake keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!runningRef.current) return
      const map: Record<string, { x: number, y: number }> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
      }
      const nd = map[e.key]
      if (!nd) return
      const cd = dirRef.current
      if (nd.x !== -cd.x && nd.y !== -cd.y) { dirRef.current = nd; e.preventDefault() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Snake drawing
  const drawSnake = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke() }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke() }
    snakeRef.current.forEach((seg, i) => {
      const a = 1 - (i / snakeRef.current.length) * 0.5
      ctx.fillStyle = i === 0 ? '#43E97B' : `rgba(67,233,123,${a})`
      ctx.beginPath(); ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4); ctx.fill()
    })
    const f = foodRef.current
    ctx.fillStyle = '#FF6584'; ctx.beginPath(); ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2); ctx.fill()
  }, [])

  const placeFood = () => {
    let f: { x: number; y: number }
    do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) } }
    while (snakeRef.current.some(s => s.x === f.x && s.y === f.y))
    foodRef.current = f
  }

  const startSnake = () => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
    dirRef.current = { x: 1, y: 0 }; placeFood(); setSnakeScore(0)
    runningRef.current = true
    setSnakeOverlay(o => ({ ...o, show: false }))
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      const head = { x: snakeRef.current[0].x + dirRef.current.x, y: snakeRef.current[0].y + dirRef.current.y }
      // Collision: wall or self
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
        const finalScore = (snakeRef.current.length - 3) * 10
        runningRef.current = false
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
        if (finalScore > parseInt(storeGet('ck_snake_high', '0'))) {
          storeSet('ck_snake_high', String(finalScore))
          setSnakeHigh(finalScore)
        }
        setSnakeOverlay({ show: true, icon: '💀', title: 'Game Over!', msg: `Điểm: ${finalScore}`, startLabel: '▶ Chơi lại' })
        return
      }
      // Move snake
      snakeRef.current = [head, ...snakeRef.current]
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        // Ate food
        const sc = (snakeRef.current.length - 3) * 10
        setSnakeScore(sc)
        if (sc > parseInt(storeGet('ck_snake_high', '0'))) {
          storeSet('ck_snake_high', String(sc))
          setSnakeHigh(sc)
        }
        placeFood()
      } else {
        snakeRef.current.pop() // remove tail
      }
      drawSnake()
    }, 120)
  }

  const stopSnake = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    runningRef.current = false
  }

  // TTT
  const TTT_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

  const checkWin = (b: string[]): number[] | 'Draw' | null => {
    for (const l of TTT_LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return l
    if (b.every(v => v)) return 'Draw'
    return null
  }

  const aiMove = useCallback((board: string[]) => {
    const find = (p: string) => {
      for (const l of TTT_LINES) { const v = [board[l[0]], board[l[1]], board[l[2]]]; if (v.filter(x => x === p).length === 2 && v.includes('')) return l[v.indexOf('')] }
      return null
    }
    let idx = find('O') ?? find('X')
    if (idx == null) idx = board[4] === '' ? 4 : (board.map((v, i) => v === '' ? i : -1).filter(i => i !== -1))[0] ?? 0
    return idx
  }, [])

  const tttClick = (idx: number) => {
    if (tttOver || tttBoard[idx]) return
    const nb = [...tttBoard]; nb[idx] = tttTurn; setTttBoard(nb)
    const win = checkWin(nb)
    if (win) {
      setTttOver(true)
      if (win === 'Draw') { setTttStatus('🤝 Hòa!') }
      else { setTttWinLine(win as number[]); setTttStatus(`🎉 ${tttTurn === 'X' ? '❌' : '⭕'} Thắng!`) }
      return
    }
    const next = tttTurn === 'X' ? 'O' : 'X'; setTttTurn(next)
    setTttStatus(`Lượt của: ${next === 'X' ? '❌' : '⭕'}`)
    if (tttMode === 'ai' && next === 'O') {
      setTimeout(() => {
        const nb2 = [...nb]; const ai = aiMove(nb)
        if (ai != null) {
          nb2[ai] = 'O'; setTttBoard(nb2); const w = checkWin(nb2)
          if (w) { setTttOver(true); if (w === 'Draw') { setTttStatus('🤝 Hòa!') } else { setTttWinLine(w as number[]); setTttStatus('🎉 ⭕ Thắng!') } }
          else { setTttTurn('X'); setTttStatus('Lượt của: ❌') }
        }
      }, 400)
    }
  }

  const resetTTT = () => { setTttBoard(Array(9).fill('')); setTttTurn('X'); setTttOver(false); setTttWinLine([]); setTttStatus('Lượt của: ❌') }

  // Exercises
  const openExercise = (ex: Exercise) => {
    setCurEx(ex); setCurStep(0)
    setQuizAnswered({}); setCodeVals({}); setHints({}); setDropZone({}); setFeedback({})
    setPage('detail')
  }

  const advanceStep = useCallback((ex: Exercise, step: number) => {
    const next = step + 1
    if (next >= ex.steps.length) { completeEx(ex) } else { setCurStep(next) }
  }, [])

  const completeEx = (ex: Exercise) => {
    const isNew = !completed.includes(ex.id)
    if (isNew) { setCompleted(p => [...p, ex.id]); setStars(s => s + ex.stars) }
    setSuccessMsg(`Bạn đã hoàn thành "${ex.title}"!`)
    setSuccessStars(isNew ? ex.stars : 0)
    setSuccessOpen(true)
  }

  // Quiz
  const checkQuiz = (stepIdx: number, optIdx: number) => {
    if (quizAnswered[stepIdx] != null) return
    const step = curEx!.steps[stepIdx]
    const correct = optIdx === step.correct
    setQuizAnswered(p => ({ ...p, [stepIdx]: { chosen: optIdx, correct } }))
    setFeedback(p => ({ ...p, [stepIdx]: { ok: correct, text: correct ? step.feedback : '❌ Chưa đúng! Xem đáp án đúng nhé.' } }))
    if (correct) setTimeout(() => advanceStep(curEx!, stepIdx), 1200)
    else setTimeout(() => { setQuizAnswered(p => { const n = { ...p }; delete n[stepIdx]; return n }); setFeedback(p => ({ ...p, [stepIdx]: null })) }, 2000)
  }

  // Code
  const checkCode = (stepIdx: number) => {
    const step = curEx!.steps[stepIdx]; const val = (codeVals[stepIdx] || '').trim()
    if (!val) { setFeedback(p => ({ ...p, [stepIdx]: { ok: false, text: '⚠️ Hãy viết code vào ô trên!' } })); return }
    const ok = step.validate!(val)
    setFeedback(p => ({ ...p, [stepIdx]: { ok, text: ok ? step.feedback : '❌ Code chưa đúng. Xem lại gợi ý nhé!' } }))
    if (ok) setTimeout(() => advanceStep(curEx!, stepIdx), 1500)
  }

  // Arrange
  const addToZone = (stepIdx: number, block: string) => {
    setDropZone(p => ({ ...p, [stepIdx]: [...(p[stepIdx] || []), block] }))
  }
  const removeFromZone = (stepIdx: number, block: string) => {
    setDropZone(p => {
      const arr = [...(p[stepIdx] || [])]; const i = arr.lastIndexOf(block); if (i >= 0) arr.splice(i, 1)
      return { ...p, [stepIdx]: arr }
    })
  }
  const checkArrange = (stepIdx: number) => {
    const step = curEx!.steps[stepIdx]; const zone = dropZone[stepIdx] || []
    if (!zone.length) { setFeedback(p => ({ ...p, [stepIdx]: { ok: false, text: '⚠️ Kéo hoặc click các khối code vào vùng bên dưới!' } })); return }
    const correct = (step.correct as number[]).map(i => step.blocks![i])
    const ok = JSON.stringify(zone) === JSON.stringify(correct)
    setFeedback(p => ({ ...p, [stepIdx]: { ok, text: ok ? step.feedback : '❌ Thứ tự chưa đúng. Thử lại nhé!' } }))
    if (ok) setTimeout(() => advanceStep(curEx!, stepIdx), 1500)
  }


  const filtered = EXERCISES.filter(e => filter === 'all' || e.level === filter)
  const pct = Math.round((completed.length / EXERCISES.length) * 100)

  return (
    <div>
      {/* NAVBAR */}
      <nav id="navbar">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => setPage('home')}>
            <span className="logo-icon">🚀</span>
            <span className="logo-text">CodeKids</span>
          </div>
          <div className="nav-links">
            {(['home', 'exercises', 'games', 'progress', 'results', 'teacher'] as const).map(p => (
              <button key={p} className={`nav-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>
                {p === 'home' ? '🏠 Trang Chủ'
                  : p === 'exercises' ? '📚 Bài Tập'
                    : p === 'games' ? '🎮 Trò Chơi'
                      : p === 'progress' ? '🏆 Thành Tích'
                        : p === 'results' ? '📊 Kết Quả'
                          : '🔑 Đáp Án GV'}
              </button>
            ))}
          </div>
          <div className="nav-stars"><span>⭐</span><span>{stars}</span></div>
        </div>
      </nav>

      {/* HOME */}
      <div id="page-home" className={`page${page === 'home' ? ' active' : ''}`}>
        <div className="hero">
          <div className="hero-bg">
            {['{ }', '( )', '[ ]', '; ;', '</>', '→'].map((c, i) => <div key={i} className="floating-code">{c}</div>)}
          </div>
          <div className="hero-content">
            <div className="hero-badge">✨ Dành cho học sinh</div>
            <h1 className="hero-title">Học Lập Trình<br /><span className="gradient-text">Siêu Vui!</span></h1>
            <h2>Thầy - Đức Thành Nam</h2><br></br>
            <p className="hero-subtitle">Làm quen với lập trình qua các bài tập từng bước và trò chơi thú vị. Không cần biết gì trước!</p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => setPage('exercises')}>🚀 Bắt Đầu Học</button>
              <button className="btn-secondary" onClick={() => setPage('games')}>🎮 Chơi Ngay</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-window">
              <div className="window-bar">
                <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                <span className="window-title">hello.py</span>
              </div>
              <div className="code-content">
                {heroLines.map((line, i) => (
                  <span key={i} className={`code-line ${HERO_LINES[i]?.cls || ''}`}>{escHtml(line)}</span>
                ))}
                {heroLines.length > 0 && <span className="code-cursor" />}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="features">
          <h2 className="section-title">Tại sao chọn CodeKids? 🤔</h2>
          <div className="features-grid">
            {[['📖', 'Hướng dẫn từng bước', 'Mỗi bài tập đều có hướng dẫn chi tiết, từng bước một dễ hiểu.'],
            ['🎯', 'Nhiều dạng bài tập', 'Bài tập đa dạng: điền khuyết, sắp xếp code, viết code, debug lỗi.'],
            ['🏆', 'Phần thưởng ngay', 'Hoàn thành bài để mở khóa trò chơi như rắn săn mồi!'],
            ['⭐', 'Tích điểm sao', 'Kiếm sao khi làm đúng, theo dõi tiến trình của bạn.']
            ].map(([icon, h, p]) => (
              <div key={h} className="feature-card">
                <div className="feature-icon">{icon}</div>
                <h3>{h}</h3><p>{p}</p>
              </div>
            ))}
          </div>
        </div> */}
        <div className="quick-start">
          <h2 className="section-title">Bài tập nổi bật 🌟</h2>
          <div className="exercise-preview-grid">
            {EXERCISES.slice(0, 3).map(ex => <ExCard key={ex.id} ex={ex} completed={completed} onClick={() => openExercise(ex)} />)}
          </div>
        </div>
      </div>

      {/* EXERCISES */}
      <div id="page-exercises" className={`page${page === 'exercises' ? ' active' : ''}`}>
        <div className="page-header">
          <h1>📚 Bài Tập Lập Trình</h1>
          <p>Chọn một bài tập để bắt đầu học. Mỗi bài có hướng dẫn từng bước!</p>
        </div>
        <div className="exercise-filters">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(f => (
            <button key={f} className={`filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tất cả' : levelLabel(f)}
            </button>
          ))}
        </div>
        <div className="exercise-list">
          {filtered.map(ex => <ExCard key={ex.id} ex={ex} completed={completed} onClick={() => openExercise(ex)} />)}
        </div>
      </div>

      {/* DETAIL */}
      <div id="page-exercise-detail" className={`page${page === 'detail' ? ' active' : ''}`}>
        <div className="exercise-detail-container">
          <button className="back-btn" onClick={() => setPage('exercises')}>← Quay lại</button>
          {curEx && (
            <>
              <div className="exercise-hero">
                <div className={`card-level level-${curEx.level}`}>{levelLabel(curEx.level)}</div>
                <h1>{curEx.icon} {curEx.title}</h1>
                <p>{curEx.description}</p>
                {completed.includes(curEx.id) && <div style={{ marginTop: '1rem', color: 'var(--success)', fontWeight: 700 }}>✅ Bạn đã hoàn thành! Có thể làm lại để ôn tập.</div>}
              </div>
              <div className="steps-container">
                {curEx.steps.map((step, idx) => (
                  <div key={idx} id={`step-${idx}`} className={`step-card${idx === curStep ? ' active' : idx < curStep ? ' done' : ''}`}>
                    <div className="step-number">{idx < curStep ? '✓' : idx + 1}</div>
                    <div className="step-body">
                      <h3>Bước {idx + 1}: {step.title}</h3>
                      <div className="step-explanation">{step.explanation}</div>
                      {step.code && (
                        <div className="step-code-block">
                          <code className="code-font" style={{ color: '#C3E88D', whiteSpace: 'pre' }}>{step.code}</code>
                        </div>
                      )}
                      {/* QUIZ */}
                      {step.type === 'quiz' && (
                        <>
                          <div style={{ marginBottom: '.75rem', fontWeight: 700 }}>{step.question}</div>
                          <div className="quiz-options">
                            {step.options!.map((opt, oi) => {
                              const ans = quizAnswered[idx]
                              let cls = 'quiz-option'
                              if (ans) { if (oi === step.correct) cls += ' correct'; else if (oi === ans.chosen && !ans.correct) cls += ' wrong' }
                              return <button key={oi} className={cls} disabled={!!ans} onClick={() => checkQuiz(idx, oi)}>{opt}</button>
                            })}
                          </div>
                        </>
                      )}
                      {/* CODE */}
                      {step.type === 'code' && (
                        <>
                          <div style={{ marginBottom: '.5rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>✏️ Viết code của bạn:</div>
                          <textarea className="code-textarea" rows={5} placeholder={step.placeholder}
                            value={codeVals[idx] || ''} spellCheck={false}
                            onChange={e => setCodeVals(p => ({ ...p, [idx]: e.target.value }))} />
                          <div className="step-actions">
                            <button className="btn-check" onClick={() => checkCode(idx)}>✅ Kiểm tra</button>
                            <button className="btn-secondary" style={{ padding: '.6rem 1rem', fontSize: '.85rem' }} onClick={() => setHints(p => ({ ...p, [idx]: !p[idx] }))}>💡 Gợi ý</button>
                            {feedback[idx] && <span className={`step-feedback show ${feedback[idx]!.ok ? 'ok' : 'err'}`}>{feedback[idx]!.text}</span>}
                          </div>
                          {hints[idx] && <div className="step-hint">{step.hint}</div>}
                        </>
                      )}
                      {/* ARRANGE */}
                      {step.type === 'arrange' && (
                        <>
                          <div style={{ marginBottom: '.5rem', fontWeight: 700 }}>Sắp xếp các khối code theo thứ tự đúng:</div>
                          <div className="drag-area">
                            {step.blocks!.filter(b => !(dropZone[idx] || []).includes(b) || (dropZone[idx] || []).filter(x => x === b).length < step.blocks!.filter(x => x === b).length).map((b, bi) => (
                              <div key={bi} className="drag-item" onClick={() => addToZone(idx, b)}>{b}</div>
                            ))}
                          </div>
                          <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '.5rem' }}>📥 Click để sắp xếp:</div>
                          <div className="drop-zone" style={{ minHeight: 60 }}>
                            {(dropZone[idx] || []).length === 0 && <span className="drop-zone-label">Click code vào đây...</span>}
                            {(dropZone[idx] || []).map((b, bi) => (
                              <div key={bi} className="drag-item" style={{ cursor: 'pointer' }} onClick={() => removeFromZone(idx, b)}>{b}</div>
                            ))}
                          </div>
                          <div className="step-actions">
                            <button className="btn-check" onClick={() => checkArrange(idx)}>✅ Kiểm tra thứ tự</button>
                            <button className="btn-secondary" style={{ padding: '.6rem 1rem', fontSize: '.85rem' }} onClick={() => setDropZone(p => ({ ...p, [idx]: [] }))}>🔄 Đặt lại</button>
                            {feedback[idx] && <span className={`step-feedback show ${feedback[idx]!.ok ? 'ok' : 'err'}`}>{feedback[idx]!.text}</span>}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* GAMES */}
      <div id="page-games" className={`page${page === 'games' ? ' active' : ''}`}>
        <div className="page-header">
          <h1>🎮 Trò Chơi Mini</h1>
          <p>Hoàn thành bài tập để mở khóa trò chơi!</p>
        </div>
        <div className="games-grid">
          <div className="game-card">
            <div className="game-thumbnail snake-thumb">
              <div className="game-emoji">🐍</div>
              <div className="snake-preview">
                {Array.from({ length: 48 }, (_, i) => { const r = Math.floor(i / 8), c = i % 8; const isSn = r === 2 && c >= 2 && c <= 4; const isFood = r === 4 && c === 6; return <div key={i} className={`snake-cell${isSn ? ' snake' : isFood ? ' food' : ''}`} /> })}
              </div>
            </div>
            <div className="game-info">
              <h3>Rắn Săn Mồi</h3>
              <p>Điều khiển chú rắn ăn mồi, tránh va vào tường!</p>
              {!completed.includes('ex07')
                ? <div className="game-lock">🔒 Hoàn thành bài <strong>"Lập Trình Rắn Săn Mồi 🐍"</strong> để mở khóa</div>
                : <button className="btn-primary" onClick={() => { setSnakeOpen(true); setSnakeOverlay(o => ({ ...o, show: true })) }}>🎮 Chơi Ngay</button>}
            </div>
          </div>
          <div className="game-card">
            <div className="game-thumbnail ttt-thumb">
              <div className="game-emoji">❌⭕</div>
              <div className="ttt-preview"><div>❌ ⭕ ❌</div><div>⭕ ❌ ⭕</div><div>❌ ⭕ ❌</div></div>
            </div>
            <div className="game-info">
              <h3>Cờ Caro</h3>
              <p>Chơi cờ caro 3×3 với máy hoặc bạn bè!</p>
              {!completed.includes('ex08')
                ? <div className="game-lock">🔒 Hoàn thành bài <strong>"Lập Trình Cờ Caro ❌⭕"</strong> để mở khóa</div>
                : <button className="btn-primary" onClick={() => { setTttOpen(true); resetTTT() }}>🎮 Chơi Ngay</button>}
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div id="page-progress" className={`page${page === 'progress' ? ' active' : ''}`}>
        <div className="page-header"><h1>🏆 Thành Tích Của Bạn</h1><p>Theo dõi tiến trình học lập trình!</p></div>
        <div className="progress-dashboard">
          <div className="progress-overview">
            {[[completed.length, 'Bài hoàn thành'], [stars, '⭐ Sao tích lũy'], [`${pct}%`, 'Tiến độ'], [parseInt(storeGet('ck_snake_high', '0')), '🐍 Kỷ lục Rắn']].map(([v, l]) => (
              <div key={String(l)} className="progress-stat"><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
            ))}
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-label"><span>📈 Tiến trình ({completed.length}/{EXERCISES.length} bài)</span><span>{pct}%</span></div>
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${pct}%` }} /></div>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.25rem' }}>🏅 Huy Hiệu</h2>
          <div className="badge-grid">
            {[{ icon: '🥳', name: 'Bước đầu tiên', ok: completed.length >= 1 }, { icon: '💪', name: 'Siêng năng', ok: completed.length >= 3 }, { icon: '🎓', name: 'Tốt nghiệp', ok: completed.length >= EXERCISES.length }, { icon: '⭐', name: '10 Sao', ok: stars >= 10 }, { icon: '🌟', name: '25 Sao', ok: stars >= 25 }, { icon: '🐍', name: 'Kỳ thủ Rắn', ok: parseInt(storeGet('ck_snake_high', '0')) > 0 }].map(b => (
              <div key={b.name} className={`badge-card ${b.ok ? 'unlocked' : 'locked'}`}><div className="badge-icon">{b.icon}</div><div className="badge-name">{b.name}</div></div>
            ))}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '2rem 0 1.25rem' }}>📋 Chi tiết bài tập</h2>
          <div style={{ display: 'grid', gap: '.75rem' }}>
            {EXERCISES.map(ex => (
              <div key={ex.id} style={{ background: 'var(--card)', border: `1px solid ${completed.includes(ex.id) ? 'rgba(67,233,123,.4)' : 'var(--border)'}`, borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => openExercise(ex)}>
                <span style={{ fontSize: '1.75rem' }}>{ex.icon}</span>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 800 }}>{ex.title}</div><div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{levelLabel(ex.level)}</div></div>
                <span>{completed.includes(ex.id) ? '✅' : '⬜'}</span>
                <span style={{ color: 'var(--warning)', fontSize: '.85rem', fontWeight: 700 }}>⭐ {ex.stars}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div id="page-results" className={`page${page === 'results' ? ' active' : ''}`}>
        <div className="page-header">
          <h1>📊 Kết Quả Học Tập</h1>
          <p>Bảng tổng hợp kết quả tất cả bài tập của bạn</p>
        </div>
        <div className="results-page">
          {/* REPORT CARD */}
          {(() => {
            const totalStars = EXERCISES.reduce((s, e) => s + e.stars, 0)
            const earnedStars = EXERCISES.filter(e => completed.includes(e.id)).reduce((s, e) => s + e.stars, 0)
            const pctDone = Math.round((completed.length / EXERCISES.length) * 100)
            const grade = pctDone === 100 ? { label: 'A+', text: 'Xuất Sắc!', color: '#43E97B', emoji: '🎖️' }
              : pctDone >= 75 ? { label: 'A', text: 'Giỏi!', color: '#82AAFF', emoji: '🏅' }
                : pctDone >= 50 ? { label: 'B', text: 'Khá!', color: '#F7971E', emoji: '👍' }
                  : pctDone >= 25 ? { label: 'C', text: 'Trung Bình', color: '#FF9FB4', emoji: '✏️' }
                    : { label: 'D', text: 'Cần Cố Gắng', color: '#9896B8', emoji: '💪' }
            return (
              <>
                {/* Grade card */}
                <div className="results-report-card">
                  <div className="report-grade" style={{ color: grade.color }}>
                    <div className="grade-emoji">{grade.emoji}</div>
                    <div className="grade-label" style={{ background: grade.color }}>{grade.label}</div>
                    <div className="grade-text">{grade.text}</div>
                  </div>
                  <div className="report-summary">
                    <div className="report-stat-row">
                      <span className="report-stat-label">📚 Bài hoàn thành</span>
                      <span className="report-stat-val">{completed.length} / {EXERCISES.length}</span>
                    </div>
                    <div className="report-stat-row">
                      <span className="report-stat-label">⭐ Tổng sao
                      </span>
                      <span className="report-stat-val" style={{ color: 'var(--warning)' }}>{earnedStars} / {totalStars}</span>
                    </div>
                    <div className="report-stat-row">
                      <span className="report-stat-label">📊 Tiến độ</span>
                      <span className="report-stat-val">{pctDone}%</span>
                    </div>
                    <div className="report-star-bar-wrap">
                      <div className="report-star-bar-track">
                        <div className="report-star-bar-fill" style={{ width: `${pctDone}%`, background: grade.color }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Per-exercise table */}
                <div className="results-table-header">
                  <span>Bài học</span>
                  <span>Cấp độ</span>
                  <span>Sao</span>
                  <span>Trạng thái</span>
                </div>
                <div className="results-table">
                  {EXERCISES.map(ex => {
                    const done = completed.includes(ex.id)
                    return (
                      <div key={ex.id} className={`results-row${done ? ' done' : ''}`} onClick={() => openExercise(ex)}>
                        <div className="results-row-title">
                          <span className="results-row-icon">{ex.icon}</span>
                          <div>
                            <div className="results-row-name">{ex.title}</div>
                            {ex.id === 'ex07' && <div className="results-row-badge">👋 Mở khóa 🐍 Rắn Săn Mồi</div>}
                            {ex.id === 'ex08' && <div className="results-row-badge">👋 Mở khóa ❌⮕ Cờ Caro</div>}
                          </div>
                        </div>
                        <div><span className={`card-level level-${ex.level}`} style={{ fontSize: '.75rem' }}>{levelLabel(ex.level)}</span></div>
                        <div className="results-row-stars">
                          {Array.from({ length: ex.stars }).map((_, i) => (
                            <span key={i} style={{ color: done ? 'var(--warning)' : 'var(--bg3)', fontSize: '1rem' }}>⭐</span>
                          ))}
                          <span style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginLeft: '.25rem' }}>{done ? ex.stars : 0}/{ex.stars}</span>
                        </div>
                        <div className="results-row-status">
                          {done
                            ? <span className="status-done">✅ Hoàn thành</span>
                            : <span className="status-pending">⏳ Chưa làm</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="results-actions">
                  {completed.length < EXERCISES.length && (
                    <button className="btn-primary" onClick={() => setPage('exercises')}>🚀 Tiếp tục học</button>
                  )}
                  {completed.length === EXERCISES.length && (
                    <button className="btn-primary" onClick={() => setPage('games')}>🎮 Chơi Thưởng</button>
                  )}
                  <button className="btn-secondary" onClick={() => {
                    if (window.confirm('Reset tất cả tiến trình? (không thể hoàn tác)')) { setCompleted([]); setStars(0); storeSet('ck_completed', '[]'); storeSet('ck_stars', '0') }
                  }}>🔄 Reset tiến trình</button>
                </div>
              </>
            )
          })()}
        </div>
      </div>

      {/* TEACHER PAGE */}
      <div id="page-teacher" className={`page${page === 'teacher' ? ' active' : ''}`}>
        <div className="page-header">
          <h1>🔑 Đáp Án Dành Cho Giáo Viên</h1>
          <p>Tổng hợp đáp án đúng của tất cả bài tập — dùng để chấm điểm hoặc hướng dẫn học sinh</p>
        </div>
        <div className="teacher-page">
          <div className="teacher-notice">
            <span>📘</span>
            <div>
              <strong>Hướng dẫn chấm điểm:</strong> Mỗi bài có 3 bước, mỗi bước đúng được số sao tương ứng. Đáp án đúng được tô xanh bên dưới.
            </div>
          </div>

          {EXERCISES.map((ex, exIdx) => (
            <div key={ex.id} className="teacher-exercise">
              <div className="teacher-ex-header">
                <span className="teacher-ex-num">Bài {exIdx + 1}</span>
                <span className="teacher-ex-icon">{ex.icon}</span>
                <div className="teacher-ex-title">
                  <h2>{ex.title}</h2>
                  <div style={{ display: 'flex', gap: '.75rem', marginTop: '.25rem', flexWrap: 'wrap' }}>
                    <span className={`card-level level-${ex.level}`}>{levelLabel(ex.level)}</span>
                    <span style={{ color: 'var(--warning)', fontWeight: 700, fontSize: '.85rem' }}>⭐ {ex.stars} sao</span>
                  </div>
                </div>
              </div>

              {ex.steps.map((step, sIdx) => (
                <div key={sIdx} className="teacher-step">
                  <div className="teacher-step-header">
                    <span className="teacher-step-num">Bước {sIdx + 1}</span>
                    <h3>{step.title}</h3>
                    <span className={`teacher-step-type type-${step.type}`}>
                      {step.type === 'quiz' ? '💡 Trắc nghiệm' : step.type === 'code' ? '⌨️ Viết code' : '🧩 Sắp xếp'}
                    </span>
                  </div>

                  {/* Show code context if available */}
                  {step.code && (
                    <div className="teacher-code-ref">
                      <div className="teacher-label">💻 Code tham khảo (hiển thị cho học sinh):</div>
                      <pre className="teacher-code">{step.code}</pre>
                    </div>
                  )}

                  {/* QUIZ answer */}
                  {step.type === 'quiz' && (
                    <div className="teacher-answer-block">
                      <div className="teacher-label">✅ Đáp án đúng:</div>
                      <div className="teacher-quiz-options">
                        {step.options!.map((opt, oi) => (
                          <div key={oi} className={`teacher-quiz-opt ${oi === step.correct ? 'teacher-correct' : ''}`}>
                            <span className="teacher-opt-letter">{String.fromCharCode(65 + oi)}</span>
                            <span>{opt}</span>
                            {oi === step.correct && <span className="teacher-correct-badge">✓ Đúng</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CODE answer */}
                  {step.type === 'code' && (
                    <div className="teacher-answer-block">
                      <div className="teacher-label">✅ Code mẫu (học sinh cần viết tương tự):</div>
                      <pre className="teacher-code teacher-answer-code">{step.placeholder}</pre>
                      {step.hint && (
                        <div className="teacher-hint">💡 <strong>Gợi ý đã cấp:</strong> {step.hint}</div>
                      )}
                    </div>
                  )}

                  {/* ARRANGE answer */}
                  {step.type === 'arrange' && (
                    <div className="teacher-answer-block">
                      <div className="teacher-label">✅ Thứ tự đúng:</div>
                      <div className="teacher-arrange-answer">
                        {(step.correct as number[]).map((idx, pos) => (
                          <div key={pos} className="teacher-arrange-row">
                            <span className="teacher-arrange-pos">{pos + 1}</span>
                            <code className="teacher-arrange-block">{step.blocks![idx]}</code>
                          </div>
                        ))}
                      </div>
                      <div className="teacher-label" style={{ marginTop: '1rem' }}>🔀 Các khối (cho học sinh xáo trộn):</div>
                      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
                        {step.blocks!.map((b, bi) => (
                          <code key={bi} className="teacher-block-chip">{b}</code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className="teacher-footer">
            <button className="btn-secondary" onClick={() => window.print()}>🖨️ In trang này</button>
            <button className="btn-primary" onClick={() => setPage('exercises')}>📚 Xem Bài Tập</button>
          </div>
        </div>
      </div>

      {/* SNAKE MODAL */}
      <div className={`game-modal${snakeOpen ? ' open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>🐍 Rắn Săn Mồi</h2>
            <div className="snake-stats"><span>Điểm: <strong>{snakeScore}</strong></span><span>Kỷ lục: <strong>{Math.max(snakeScore, snakeHigh)}</strong></span></div>
            <button className="close-btn" onClick={() => { stopSnake(); setSnakeOpen(false) }}>✕</button>
          </div>
          <div className="snake-controls-info"><span>⬆️ W/↑</span><span>⬇️ S/↓</span><span>⬅️ A/←</span><span>➡️ D/→</span></div>
          <div style={{ position: 'relative' }}>
            <canvas ref={canvasRef} id="snake-canvas" width={400} height={400} />
            {snakeOverlay.show && (
              <div className="game-overlay">
                <div className="overlay-content">
                  <div style={{ fontSize: '3rem' }}>{snakeOverlay.icon}</div>
                  <h3>{snakeOverlay.title}</h3>
                  <p>{snakeOverlay.msg}</p>
                  <button className="btn-primary" onClick={startSnake}>{snakeOverlay.startLabel}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TTT MODAL */}
      <div className={`game-modal${tttOpen ? ' open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>❌⭕ Cờ Caro</h2>
            <div className="ttt-mode-btns">
              <button className={`mode-btn${tttMode === 'pvp' ? ' active' : ''}`} onClick={() => { setTttMode('pvp'); resetTTT() }}>👥 2 Người</button>
              <button className={`mode-btn${tttMode === 'ai' ? ' active' : ''}`} onClick={() => { setTttMode('ai'); resetTTT() }}>🤖 Vs Máy</button>
            </div>
            <button className="close-btn" onClick={() => setTttOpen(false)}>✕</button>
          </div>
          <div className="ttt-status">{tttStatus}</div>
          <div className="ttt-board">
            {tttBoard.map((cell, i) => (
              <div key={i} className={`ttt-cell${cell ? ' taken' : ''}${tttWinLine.includes(i) ? ' win' : ''}`} onClick={() => tttClick(i)}>
                {cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ''}
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ marginTop: '1rem', display: 'block', marginInline: 'auto' }} onClick={resetTTT}>🔄 Chơi lại</button>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <div className={`game-modal${successOpen ? ' open' : ''}`}>
        <div className="modal-content success-modal">
          <div className="confetti-container">
            {successOpen && Array.from({ length: 30 }, (_, i) => (
              <div key={i} className="confetti-piece" style={{ left: `${Math.random() * 100}%`, background: ['#6C63FF', '#FF6584', '#43E97B', '#F7971E'][i % 4], animationDelay: `${Math.random() * 0.8}s`, animationDuration: `${1.5 + Math.random()}s` }} />
            ))}
          </div>
          <div className="success-icon">🎉</div>
          <h2>Xuất Sắc!</h2>
          <p>{successMsg}</p>
          <div className="stars-earned">{successStars > 0 ? `${'⭐'.repeat(successStars)} (+${successStars} sao!)` : '✅ Đã có trong bộ sưu tập!'}</div>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => setSuccessOpen(false)}>Tiếp tục</button>
            <button className="btn-secondary" onClick={() => { setSuccessOpen(false); setPage('games') }}>🎮 Chơi thưởng</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExCard({ ex, completed, onClick }: { ex: Exercise; completed: string[]; onClick: () => void }) {
  const done = completed.includes(ex.id)
  return (
    <div className={`exercise-card${done ? ' completed' : ''}`} onClick={onClick}>
      <div className={`card-level level-${ex.level}`}>{levelLabel(ex.level)}</div>
      <h3>{ex.icon} {ex.title}</h3>
      <p>{ex.description}</p>
      <div className="card-footer">
        <span className="card-stars">⭐ {ex.stars} sao</span>
        {done ? <span className="card-status-done">✅ Hoàn thành</span> : <span style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>→ Bắt đầu</span>}
      </div>
    </div>
  )
}
