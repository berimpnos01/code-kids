import { Link } from 'react-router-dom'
import { EXERCISES } from '../data/exercises'
import type { ExerciseLevel } from '../data/exercises'

function levelLabel(l: ExerciseLevel) {
    return l === 'beginner' ? '🌱 Cơ bản' : l === 'intermediate' ? '🌿 Trung cấp' : '🌳 Nâng cao'
}

export default function TeacherPage() {
    return (
        <div className="teacher-standalone">
            {/* Header */}
            <header className="teacher-standalone-header">
                <div className="teacher-standalone-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.75rem' }}>🔑</span>
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>Đáp Án Giáo Viên</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CodeKids – Bảng đáp án tất cả bài tập</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                            onClick={() => window.print()}>🖨️ In trang</button>
                        <Link to="/" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                            ← Về trang học sinh
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="teacher-page" style={{ paddingTop: '1rem' }}>
                <div className="teacher-notice">
                    <span>📘</span>
                    <div>
                        <strong>Hướng dẫn chấm điểm:</strong> Mỗi bài có 3 bước, mỗi bước đúng được số sao tương ứng.
                        Đáp án đúng được tô xanh bên dưới. Tổng: {EXERCISES.reduce((s, e) => s + e.stars, 0)} sao / {EXERCISES.length} bài.
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

                                {step.code && (
                                    <div className="teacher-code-ref">
                                        <div className="teacher-label">💻 Code tham khảo (hiển thị cho học sinh):</div>
                                        <pre className="teacher-code">{step.code}</pre>
                                    </div>
                                )}

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

                                {step.type === 'code' && (
                                    <div className="teacher-answer-block">
                                        <div className="teacher-label">✅ Code mẫu (học sinh cần viết tương tự):</div>
                                        <pre className="teacher-code teacher-answer-code">{step.placeholder}</pre>
                                        {step.hint && (
                                            <div className="teacher-hint">💡 <strong>Gợi ý đã cấp:</strong> {step.hint}</div>
                                        )}
                                    </div>
                                )}

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
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none', padding: '0.875rem 2rem', borderRadius: '100px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '1rem' }}>
                        ← Về trang học sinh
                    </Link>
                </div>
            </div>
        </div>
    )
}
