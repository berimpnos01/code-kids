/* ============================================================
   CodeKids - Application Logic
   ============================================================ */

// ============================================================
// STATE
// ============================================================
const state = {
  stars: parseInt(localStorage.getItem('ck_stars') || '0'),
  completed: JSON.parse(localStorage.getItem('ck_completed') || '[]'),
  currentExercise: null,
  currentStep: 0,
  tttMode: 'pvp',       // 'pvp' | 'ai'
  tttBoard: Array(9).fill(''),
  tttCurrent: 'X',
  tttGameOver: false,
  snakeInterval: null,
};

function saveState() {
  localStorage.setItem('ck_stars',     state.stars);
  localStorage.setItem('ck_completed', JSON.stringify(state.completed));
}

// ============================================================
// EXERCISES DATA
// ============================================================
const EXERCISES = [
  {
    id: 'ex01',
    title: 'Biến và Kiểu Dữ Liệu',
    description: 'Tìm hiểu về biến – nơi lưu trữ dữ liệu trong lập trình.',
    level: 'beginner',
    stars: 3,
    icon: '📦',
    steps: [
      {
        title: 'Biến là gì?',
        explanation: 'Biến (Variable) giống như một cái hộp để chứa thông tin. Mỗi hộp có một cái tên để bạn nhận ra nó.',
        code: '# Đây là một biến\nten = "An"\ntuoi = 10\nprint(ten, "năm nay", tuoi, "tuổi")',
        type: 'quiz',
        question: 'Trong đoạn code trên, "ten" là gì?',
        options: ['Một lệnh in', 'Một biến chứa tên', 'Một số', 'Một hàm'],
        correct: 1,
        feedback: '🎯 Đúng rồi! "ten" là một biến chứa chuỗi ký tự "An".'
      },
      {
        title: 'Tạo biến đầu tiên',
        explanation: 'Hãy tạo một biến tên là "truong" chứa tên trường của bạn. Dùng dấu = để gán giá trị cho biến.',
        code: '# Gợi ý:\nten = "Nguyễn Văn An"\ntuoi = 12',
        type: 'code',
        placeholder: 'truong = "....."',
        validate: (val) => val.includes('truong') && val.includes('='),
        hint: 'Gợi ý: truong = "Tên trường của bạn"',
        feedback: '🎉 Tuyệt vời! Bạn đã tạo biến thành công!'
      },
      {
        title: 'Các kiểu dữ liệu',
        explanation: 'Có nhiều kiểu dữ liệu khác nhau: số nguyên (int), số thực (float), chuỗi (string), và đúng/sai (boolean).',
        code: 'so_nguyen = 10\nso_thuc  = 3.14\nchuoi    = "Xin chào"\ndung_sai = True',
        type: 'arrange',
        question: 'Sắp xếp các khối code theo thứ tự để in ra: "Xin chào, An!"',
        blocks: ['print(loi_chao)', 'loi_chao = "Xin chào, " + ten + "!"', 'ten = "An"'],
        correct: [2, 1, 0],
        feedback: '🔥 Xuất sắc! Bạn hiểu cách dùng biến rồi!'
      }
    ]
  },
  {
    id: 'ex02',
    title: 'Câu Lệnh Điều Kiện',
    description: 'Học cách cho máy tính "đưa ra quyết định" với if-else.',
    level: 'beginner',
    stars: 3,
    icon: '🔀',
    steps: [
      {
        title: 'Lệnh IF là gì?',
        explanation: 'Lệnh IF giúp chương trình kiểm tra một điều kiện và thực hiện hành động khác nhau dựa trên kết quả.',
        code: 'diem = 8\nif diem >= 5:\n    print("Đậu rồi! 🎉")\nelse:\n    print("Học thêm nha 📚")',
        type: 'quiz',
        question: 'Nếu diem = 3, chương trình sẽ in ra gì?',
        options: ['Đậu rồi! 🎉', 'Học thêm nha 📚', 'Không in gì', 'Báo lỗi'],
        correct: 1,
        feedback: '✅ Đúng! Vì 3 < 5 nên điều kiện sai, chạy vào else.'
      },
      {
        title: 'Thực hành viết IF',
        explanation: 'Hãy viết một câu lệnh IF để kiểm tra nếu nhiệt độ > 30 thì in "Trời nóng quá!", ngược lại thì in "Thời tiết dễ chịu!"',
        code: 'nhiet_do = 35',
        type: 'code',
        placeholder: 'if nhiet_do > 30:\n    print("Trời nóng quá!")\nelse:\n    print("Thời tiết dễ chịu!")',
        validate: (val) => val.includes('if') && val.includes('else') && val.includes('nhiet_do'),
        hint: 'Gợi ý: if nhiet_do > 30:',
        feedback: '🌡️ Tuyệt! Bạn đã viết được câu lệnh if-else đầu tiên!'
      },
      {
        title: 'IF lồng nhau',
        explanation: 'Bạn có thể dùng nhiều điều kiện với "elif" (else if). Hãy sắp xếp code để phân loại điểm.',
        code: '# Phân loại điểm:\n# >= 9: Xuất sắc\n# >= 7: Khá\n# >= 5: Trung bình\n# < 5:  Yếu',
        type: 'arrange',
        blocks: ['    print("Trung bình")', 'elif diem >= 7:', 'if diem >= 9:', '    print("Yếu")', '    print("Xuất sắc")', '    print("Khá")'],
        correct: [2, 4, 1, 5, 0, 3],
        feedback: '🏆 Hoàn hảo! Bạn đã nắm được if-elif-else!'
      }
    ]
  },
  {
    id: 'ex03',
    title: 'Vòng Lặp For',
    description: 'Lặp đi lặp lại một hành động nhiều lần với vòng lặp for.',
    level: 'beginner',
    stars: 3,
    icon: '🔄',
    steps: [
      {
        title: 'Vòng lặp là gì?',
        explanation: 'Thay vì viết print() 10 lần, bạn dùng vòng lặp for để lặp lại hành động đó. Tiết kiệm thời gian!',
        code: '# Không dùng vòng lặp:\nprint("Xin chào 1")\nprint("Xin chào 2")\n# ... viết mãi...\n\n# Dùng vòng lặp:\nfor i in range(10):\n    print("Xin chào", i+1)',
        type: 'quiz',
        question: 'Vòng lặp "for i in range(5)" lặp bao nhiêu lần?',
        options: ['4 lần', '5 lần', '6 lần', '1 lần'],
        correct: 1,
        feedback: '✅ Đúng! range(5) tạo ra 0,1,2,3,4 – tổng 5 giá trị.'
      },
      {
        title: 'Bảng cửu chương',
        explanation: 'Hãy hoàn thiện đoạn code để in bảng cửu chương số 3 (từ 3x1 đến 3x10).',
        code: 'so = 3\n# Cần lặp từ 1 đến 10',
        type: 'code',
        placeholder: 'so = 3\nfor i in range(1, 11):\n    print(so, "x", i, "=", so * i)',
        validate: (val) => val.includes('for') && val.includes('range') && val.includes('print'),
        hint: 'Gợi ý: for i in range(1, 11): rồi print(so, "x", i, "=", so*i)',
        feedback: '✖️ Bạng cửu chương của thần đồng lập trình đây!'
      },
      {
        title: 'Sắp xếp vòng lặp',
        explanation: 'Sắp xếp các khối để in ra dãy Fibonacci: 0 1 1 2 3 5 8',
        code: '# Dãy Fibonacci: mỗi số = tổng 2 số trước',
        type: 'arrange',
        blocks: ['b = a + b', 'a, b = b, a + b', 'print(a, end=" ")', 'a, b = 0, 1', 'for _ in range(7):'],
        correct: [3, 4, 2, 1],
        feedback: '🌀 Fibonacci master! Bạn xuất sắc!'
      }
    ]
  },
  {
    id: 'ex04',
    title: 'Hàm (Function)',
    description: 'Đóng gói code vào hàm để dùng lại nhiều lần.',
    level: 'intermediate',
    stars: 4,
    icon: '⚙️',
    steps: [
      {
        title: 'Hàm là gì?',
        explanation: 'Hàm (function) là một đoạn code được đặt tên, bạn có thể gọi nó nhiều lần mà không cần viết lại.',
        code: 'def chao(ten):\n    print("Xin chào,", ten, "!")\n\n# Gọi hàm:\nchao("An")\nchao("Bình")\nchao("Chi")',
        type: 'quiz',
        question: 'Từ khóa nào dùng để định nghĩa hàm trong Python?',
        options: ['function', 'def', 'fun', 'define'],
        correct: 1,
        feedback: '✅ Đúng! Trong Python dùng "def" để tạo hàm.'
      },
      {
        title: 'Viết hàm tính diện tích',
        explanation: 'Hãy viết hàm tinh_dien_tich(dai, rong) trả về diện tích hình chữ nhật (dai * rong).',
        code: '# Gợi ý:\n# def ten_ham(tham_so):\n#     return ket_qua',
        type: 'code',
        placeholder: 'def tinh_dien_tich(dai, rong):\n    return dai * rong\n\nprint(tinh_dien_tich(5, 3))',
        validate: (val) => val.includes('def') && val.includes('return') && (val.includes('*') || val.includes('x')),
        hint: 'Gợi ý: def tinh_dien_tich(dai, rong): return dai * rong',
        feedback: '📐 Tuyệt! Hàm tính diện tích hoạt động hoàn hảo!'
      },
      {
        title: 'Sắp xếp hàm đệ quy',
        explanation: 'Sắp xếp để tạo hàm tính giai thừa: n! = n × (n-1) × ... × 1',
        code: '# Ví dụ: 5! = 5×4×3×2×1 = 120',
        type: 'arrange',
        blocks: ['def giai_thua(n):', 'print(giai_thua(5))', '    if n == 1: return 1', '    return n * giai_thua(n-1)'],
        correct: [0, 2, 3, 1],
        feedback: '♾️ Đệ quy master! Bạn thật sự xuất sắc!'
      }
    ]
  },
  {
    id: 'ex05',
    title: 'Danh Sách (List)',
    description: 'Lưu nhiều giá trị trong một biến với cấu trúc danh sách.',
    level: 'intermediate',
    stars: 4,
    icon: '📋',
    steps: [
      {
        title: 'List là gì?',
        explanation: 'List giống như một danh sách mua hàng – chứa nhiều thứ trong một chỗ. Mỗi phần tử có vị trí (index) bắt đầu từ 0.',
        code: 'trai_cay = ["Táo", "Chuối", "Xoài"]\nprint(trai_cay[0])  # Táo\nprint(trai_cay[1])  # Chuối\nprint(trai_cay[2])  # Xoài',
        type: 'quiz',
        question: 'Nếu list = ["A", "B", "C", "D"], thì list[2] bằng gì?',
        options: ['"A"', '"B"', '"C"', '"D"'],
        correct: 2,
        feedback: '✅ Đúng! Index bắt đầu từ 0, nên index 2 là phần tử thứ 3: "C".'
      },
      {
        title: 'Thêm phần tử vào List',
        explanation: 'Dùng .append() để thêm phần tử vào cuối list. Hãy thêm "Dưa Hấu" vào danh sách trái cây.',
        code: 'trai_cay = ["Táo", "Chuối", "Xoài"]',
        type: 'code',
        placeholder: 'trai_cay = ["Táo", "Chuối", "Xoài"]\ntrai_cay.append("Dưa Hấu")\nprint(trai_cay)',
        validate: (val) => val.includes('.append(') || val.includes('append('),
        hint: 'Gợi ý: trai_cay.append("...")',
        feedback: '🍉 Dưa Hấu đã vào danh sách! Bạn thật khéo!'
      },
      {
        title: 'Duyệt List với For',
        explanation: 'Sắp xếp code để in từng môn học trong danh sách.',
        code: 'mon_hoc = ["Toán", "Văn", "Anh", "Lý", "Hóa"]',
        type: 'arrange',
        blocks: ['    print("Môn:", mon)', 'mon_hoc = ["Toán", "Văn", "Anh"]', 'for mon in mon_hoc:'],
        correct: [1, 2, 0],
        feedback: '📚 Tuyệt! Bạn biết duyệt list rồi!'
      }
    ]
  },
  {
    id: 'ex06',
    title: 'Bug Hunting 🐛',
    description: 'Tìm và sửa lỗi trong code – kỹ năng quan trọng của lập trình viên!',
    level: 'advanced',
    stars: 5,
    icon: '🐛',
    steps: [
      {
        title: 'Debug là gì?',
        explanation: 'Debug là việc tìm và sửa lỗi (bug) trong code. Lập trình viên giỏi phải giỏi debug!',
        code: '# Code có lỗi:\nfor i in range(1, 6)\n    print("Số:", i)\n\n# Lỗi: thiếu dấu ":" sau range(1,6)',
        type: 'quiz',
        question: 'Dòng nào bị lỗi trong đoạn code trên?',
        options: ['Dòng 1: for i in range(1, 6)', 'Cả hai dòng đều lỗi', 'Dòng 2: print("Số:", i)', 'Không có lỗi'],
        correct: 0,
        feedback: '🔍 Tìm ra bug rồi! Thiếu dấu ":" cuối lệnh for.'
      },
      {
        title: 'Sửa code bị lỗi',
        explanation: 'Đoạn code dưới đây có lỗi. Hãy sửa lại cho đúng để in bảng cửu chương 2.',
        code: '# Code lỗi:\nfor i in range(1, 11)\n    prit("2 x", i, "=", 2*i)',
        type: 'code',
        placeholder: 'for i in range(1, 11):\n    print("2 x", i, "=", 2*i)',
        validate: (val) => val.includes('print') && val.includes(':') && val.includes('range'),
        hint: 'Có 2 lỗi: thiếu ":" và sai tên hàm (prit → print)',
        feedback: '🏅 Bug hunter xuất sắc! Code đã chạy đúng!'
      },
      {
        title: 'Thử thách cuối',
        explanation: 'Đặt đúng thứ tự để chương trình tính tổng các số từ 1 đến 100.',
        code: '# Kết quả đúng: 5050',
        type: 'arrange',
        blocks: ['tong = 0', 'print("Tổng 1→100:", tong)', 'for i in range(1, 101):', '    tong += i'],
        correct: [0, 2, 3, 1],
        feedback: '🎓 Hoàn hảo! Từ 1 đến 100 bằng 5050 – bạn vừa code một bài toán Gauss!'
      }
    ]
  }
];

// ============================================================
// PAGE ROUTING
// ============================================================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const page = document.getElementById(`page-${name}`);
  const navBtn = document.getElementById(`nav-${name}`);

  if (page)   page.classList.add('active');
  if (navBtn) navBtn.classList.add('active');

  // Render page-specific content
  if (name === 'home')      renderHome();
  if (name === 'exercises') renderExercises();
  if (name === 'progress')  renderProgress();
  if (name === 'games')     checkGameUnlocks();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// HOME PAGE
// ============================================================
const HERO_CODE_LINES = [
  { text: '# CodeKids - Học lập trình siêu vui!', type: 'comment' },
  { text: 'ten = "Bạn"', type: 'var' },
  { text: 'diem = 10', type: 'var' },
  { text: '', type: 'var' },
  { text: 'def xin_chao(ten):', type: 'func' },
  { text: '    print("Chào " + ten + "!")', type: 'string' },
  { text: '', type: 'var' },
  { text: '# Gọi hàm:', type: 'comment' },
  { text: 'xin_chao(ten)', type: 'func' },
  { text: '# Output: Chào Bạn!', type: 'comment' },
];

function renderHome() {
  renderHeroCode();
  renderFeaturedExercises();
}

function renderHeroCode() {
  const el = document.getElementById('hero-code');
  el.innerHTML = '';
  HERO_CODE_LINES.forEach((line, i) => {
    setTimeout(() => {
      const span = document.createElement('span');
      span.classList.add('code-line');
      if (line.type === 'comment') span.innerHTML = `<span class="code-comment">${escHtml(line.text)}</span>`;
      else if (line.type === 'func') span.innerHTML = `<span class="code-func">${escHtml(line.text)}</span>`;
      else if (line.type === 'string') span.innerHTML = `<span class="code-string">${escHtml(line.text)}</span>`;
      else span.textContent = line.text;
      el.appendChild(span);
      if (i === HERO_CODE_LINES.length - 1) {
        const cursor = document.createElement('span');
        cursor.className = 'code-cursor';
        el.appendChild(cursor);
      }
    }, i * 140);
  });
}

function renderFeaturedExercises() {
  const grid = document.getElementById('featured-exercises');
  grid.innerHTML = '';
  EXERCISES.slice(0, 3).forEach(ex => {
    grid.appendChild(createExerciseCard(ex, true));
  });
}

// ============================================================
// EXERCISES PAGE
// ============================================================
let currentFilter = 'all';

function renderExercises() {
  const list = document.getElementById('exercise-list');
  list.innerHTML = '';
  EXERCISES
    .filter(ex => currentFilter === 'all' || ex.level === currentFilter)
    .forEach(ex => list.appendChild(createExerciseCard(ex, false)));
}

function filterExercises(level, btn) {
  currentFilter = level;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderExercises();
}

function createExerciseCard(ex, mini) {
  const done = state.completed.includes(ex.id);
  const card = document.createElement('div');
  card.className = `exercise-card ${done ? 'completed' : ''}`;
  card.innerHTML = `
    <div class="card-level level-${ex.level}">${levelLabel(ex.level)}</div>
    <h3>${ex.icon} ${ex.title}</h3>
    <p>${ex.description}</p>
    <div class="card-footer">
      <span class="card-stars">⭐ ${ex.stars} sao</span>
      ${done ? '<span class="card-status-done">✅ Hoàn thành</span>' : '<span style="color:var(--text-muted);font-size:.85rem">→ Bắt đầu</span>'}
    </div>
  `;
  card.addEventListener('click', () => openExercise(ex.id));
  return card;
}

function levelLabel(l) {
  if (l === 'beginner')     return '🌱 Cơ bản';
  if (l === 'intermediate') return '🌿 Trung cấp';
  return '🌳 Nâng cao';
}

// ============================================================
// EXERCISE DETAIL
// ============================================================
function openExercise(id) {
  const ex = EXERCISES.find(e => e.id === id);
  if (!ex) return;
  state.currentExercise = ex;
  state.currentStep = 0;
  showPage('exercise-detail');
  renderExerciseDetail(ex);

  const navBtn = document.getElementById('nav-exercises');
  if (navBtn) navBtn.classList.add('active');
}

function renderExerciseDetail(ex) {
  const container = document.getElementById('exercise-detail-content');
  const alreadyDone = state.completed.includes(ex.id);

  container.innerHTML = `
    <div class="exercise-hero">
      <div class="card-level level-${ex.level}" style="margin-bottom:.75rem">${levelLabel(ex.level)}</div>
      <h1>${ex.icon} ${ex.title}</h1>
      <p>${ex.description}</p>
      ${alreadyDone ? '<div style="margin-top:1rem;color:var(--success);font-weight:700">✅ Bạn đã hoàn thành bài này rồi! Có thể làm lại để ôn tập.</div>' : ''}
    </div>
    <div class="steps-container" id="steps-container"></div>
  `;

  renderSteps(ex);
}

function renderSteps(ex) {
  const container = document.getElementById('steps-container');
  container.innerHTML = '';

  ex.steps.forEach((step, idx) => {
    const card = document.createElement('div');
    card.id = `step-${idx}`;
    card.className = `step-card ${idx === 0 ? 'active' : ''}`;

    const stepHTML = buildStepHTML(step, idx, ex);
    card.innerHTML = `
      <div class="step-number">${idx < state.currentStep ? '✓' : idx + 1}</div>
      <div class="step-body">
        <h3>Bước ${idx + 1}: ${step.title}</h3>
        <div class="step-explanation">${step.explanation}</div>
        ${step.code ? `<div class="step-code-block"><code class="code-font" style="color:#C3E88D;white-space:pre">${escHtml(step.code)}</code></div>` : ''}
        ${stepHTML}
      </div>
    `;
    container.appendChild(card);
  });

  updateStepsDisplay();
}

function buildStepHTML(step, idx, ex) {
  if (step.type === 'quiz') {
    const opts = step.options.map((opt, i) =>
      `<button class="quiz-option" id="opt-${idx}-${i}" onclick="checkQuiz(${idx}, ${i})">${opt}</button>`
    ).join('');
    return `
      <div style="margin-bottom:.75rem;font-weight:700">${step.question}</div>
      <div class="quiz-options">${opts}</div>
      <div class="step-feedback" id="feedback-${idx}"></div>
    `;
  }

  if (step.type === 'code') {
    return `
      <div style="margin-bottom:.5rem;font-size:.85rem;color:var(--text-muted)">✏️ Viết code của bạn:</div>
      <div class="code-editor-wrap">
        <textarea class="code-textarea" id="code-input-${idx}" 
          placeholder="${escHtml(step.placeholder)}" rows="5"
          spellcheck="false"></textarea>
      </div>
      <div class="step-actions">
        <button class="btn-check" onclick="checkCode(${idx})">✅ Kiểm tra</button>
        <button class="btn-secondary" style="padding:.6rem 1rem;font-size:.85rem" onclick="showHint(${idx})">💡 Gợi ý</button>
        <span class="step-feedback" id="feedback-${idx}"></span>
      </div>
      <div class="step-hint" id="hint-${idx}" style="display:none;margin-top:.75rem;padding:.75rem;background:rgba(247,151,30,.1);border-radius:8px;color:var(--warning);font-size:.85rem">${step.hint || ''}</div>
    `;
  }

  if (step.type === 'arrange') {
    // Shuffle blocks
    const shuffled = [...step.blocks].sort(() => Math.random() - 0.5);
    const blockItems = shuffled.map((b, i) =>
      `<div class="drag-item" draggable="true" data-block="${escHtml(b)}" 
         ondragstart="dragStart(event)" onclick="moveBlock(this, ${idx})">${escHtml(b)}</div>`
    ).join('');
    return `
      <div style="margin-bottom:.5rem;font-weight:700">${step.question || 'Sắp xếp các khối code theo thứ tự đúng:'}</div>
      <div class="drag-area" id="drag-source-${idx}">${blockItems}</div>
      <div style="font-size:.85rem;color:var(--text-muted);margin-bottom:.5rem">📥 Kéo thả hoặc click để sắp xếp:</div>
      <div class="drop-zone" id="drop-zone-${idx}"
        ondragover="dragOver(event)" ondrop="dropBlock(event, ${idx})">
        <span class="drop-zone-label" id="drop-label-${idx}">Kéo code vào đây...</span>
      </div>
      <div class="step-actions">
        <button class="btn-check" onclick="checkArrange(${idx})">✅ Kiểm tra thứ tự</button>
        <button class="btn-secondary" style="padding:.6rem 1rem;font-size:.85rem" onclick="resetArrange(${idx})">🔄 Đặt lại</button>
        <span class="step-feedback" id="feedback-${idx}"></span>
      </div>
    `;
  }
  return '';
}

function updateStepsDisplay() {
  const ex = state.currentExercise;
  ex.steps.forEach((_, idx) => {
    const card = document.getElementById(`step-${idx}`);
    if (!card) return;
    card.classList.remove('active', 'done');
    const numEl = card.querySelector('.step-number');
    if (idx < state.currentStep) {
      card.classList.add('done');
      numEl.textContent = '✓';
    } else if (idx === state.currentStep) {
      card.classList.add('active');
      numEl.textContent = idx + 1;
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      numEl.textContent = idx + 1;
    }
  });
}

function advanceStep() {
  const ex = state.currentExercise;
  state.currentStep++;
  if (state.currentStep >= ex.steps.length) {
    completeExercise(ex);
  } else {
    updateStepsDisplay();
  }
}

function completeExercise(ex) {
  const isNew = !state.completed.includes(ex.id);
  if (isNew) {
    state.completed.push(ex.id);
    state.stars += ex.stars;
    saveState();
    updateStarDisplay();
  }
  showSuccessModal(ex, isNew);
  checkGameUnlocks();
}

// ============================================================
// QUIZ EXERCISE
// ============================================================
function checkQuiz(stepIdx, optIdx) {
  const ex = state.currentExercise;
  const step = ex.steps[stepIdx];
  if (state.currentStep !== stepIdx) return;

  const allOpts = document.querySelectorAll(`[id^="opt-${stepIdx}-"]`);
  allOpts.forEach(o => o.disabled = true);

  const correct = optIdx === step.correct;
  const selectedBtn = document.getElementById(`opt-${stepIdx}-${optIdx}`);
  const correctBtn  = document.getElementById(`opt-${stepIdx}-${step.correct}`);

  if (correct) {
    selectedBtn.classList.add('correct');
  } else {
    selectedBtn.classList.add('wrong');
    correctBtn.classList.add('correct');
  }

  const fb = document.getElementById(`feedback-${stepIdx}`);
  fb.textContent = correct ? step.feedback : '❌ Chưa đúng! Xem đáp án đúng nhé.';
  fb.className = `step-feedback show ${correct ? 'ok' : 'err'}`;

  if (correct) {
    setTimeout(() => advanceStep(), 1200);
  } else {
    setTimeout(() => {
      allOpts.forEach(o => { o.disabled = false; o.classList.remove('wrong', 'correct'); });
      fb.className = 'step-feedback';
    }, 2000);
  }
}

// ============================================================
// CODE EXERCISE
// ============================================================
function checkCode(stepIdx) {
  const ex = state.currentExercise;
  const step = ex.steps[stepIdx];
  const textarea = document.getElementById(`code-input-${stepIdx}`);
  const fb = document.getElementById(`feedback-${stepIdx}`);

  const val = textarea.value.trim();
  if (!val) { fb.textContent = '⚠️ Hãy viết code vào ô trên!'; fb.className = 'step-feedback show err'; return; }

  const ok = step.validate(val);
  fb.textContent = ok ? step.feedback : '❌ Code chưa đúng. Xem lại gợi ý nhé!';
  fb.className = `step-feedback show ${ok ? 'ok' : 'err'}`;

  if (ok) setTimeout(() => advanceStep(), 1500);
}

function showHint(stepIdx) {
  const hint = document.getElementById(`hint-${stepIdx}`);
  if (hint) hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
}

// ============================================================
// ARRANGE EXERCISE (Drag & Drop + Click)
// ============================================================
let dragging = null;
let dropZoneItems = {}; // stepIdx -> [{block, el}]

function dragStart(e) {
  dragging = e.target;
  e.target.classList.add('dragging');
}

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function dropBlock(e, stepIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!dragging) return;

  const block = dragging.dataset.block;
  addToDropZone(stepIdx, block, dragging);
  dragging.classList.remove('dragging');
  dragging = null;
}

function moveBlock(el, stepIdx) {
  const block = el.dataset.block;
  addToDropZone(stepIdx, block, el);
}

function addToDropZone(stepIdx, block, sourceEl) {
  const zone = document.getElementById(`drop-zone-${stepIdx}`);
  const label = document.getElementById(`drop-label-${stepIdx}`);
  if (label) label.style.display = 'none';

  if (!dropZoneItems[stepIdx]) dropZoneItems[stepIdx] = [];
  dropZoneItems[stepIdx].push(block);

  const item = document.createElement('div');
  item.className = 'drag-item';
  item.dataset.block = block;
  item.style.cursor = 'pointer';
  item.textContent = block;
  item.onclick = () => {
    dropZoneItems[stepIdx] = dropZoneItems[stepIdx].filter(b => b !== block || (() => { dropZoneItems[stepIdx].splice(dropZoneItems[stepIdx].lastIndexOf(block), 1); return false; })());
    item.remove();
    if (dropZoneItems[stepIdx].length === 0 && label) label.style.display = '';

    // Restore to source
    const source = document.getElementById(`drag-source-${stepIdx}`);
    const restored = document.createElement('div');
    restored.className = 'drag-item';
    restored.draggable = true;
    restored.dataset.block = block;
    restored.textContent = block;
    restored.ondragstart = dragStart;
    restored.onclick = () => moveBlock(restored, stepIdx);
    source.appendChild(restored);
  };
  zone.appendChild(item);
  sourceEl.remove();
}

function checkArrange(stepIdx) {
  const ex = state.currentExercise;
  const step = ex.steps[stepIdx];
  const zone = dropZoneItems[stepIdx] || [];
  const fb = document.getElementById(`feedback-${stepIdx}`);

  if (zone.length === 0) {
    fb.textContent = '⚠️ Kéo các khối code vào vùng sắp xếp!';
    fb.className = 'step-feedback show err'; return;
  }

  const correctOrder = step.correct.map(i => step.blocks[i]);
  const ok = JSON.stringify(zone) === JSON.stringify(correctOrder);

  fb.textContent = ok ? step.feedback : '❌ Thứ tự chưa đúng. Thử lại nhé!';
  fb.className = `step-feedback show ${ok ? 'ok' : 'err'}`;

  if (ok) setTimeout(() => advanceStep(), 1500);
}

function resetArrange(stepIdx) {
  dropZoneItems[stepIdx] = [];
  const ex = state.currentExercise;
  if (ex) renderSteps(ex);
}

// ============================================================
// SUCCESS MODAL
// ============================================================
function showSuccessModal(ex, isNew) {
  const modal = document.getElementById('modal-success');
  document.getElementById('success-message').textContent =
    isNew ? `Bạn đã hoàn thành "${ex.title}"!` : `Bạn đã ôn lại "${ex.title}"!`;

  const starsEl = document.getElementById('stars-earned');
  starsEl.textContent = isNew ? '⭐'.repeat(ex.stars) + ` (+${ex.stars} sao!)` : '✅ Đã có trong bộ sưu tập!';

  spawnConfetti();
  modal.classList.add('open');
}

function closeSuccessModal() {
  document.getElementById('modal-success').classList.remove('open');
}

function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#6C63FF','#FF6584','#43E97B','#F7971E','#38B2F8','#FFD700'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.8 + 's';
    piece.style.animationDuration = (1.5 + Math.random()) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(piece);
  }
}

// ============================================================
// STAR DISPLAY
// ============================================================
function updateStarDisplay() {
  document.getElementById('star-count').textContent = state.stars;
}

// ============================================================
// GAMES PAGE
// ============================================================
function checkGameUnlocks() {
  const done = state.completed.length;
  const snakeLock = document.getElementById('snake-lock');
  const snakeBtn  = document.getElementById('snake-btn');
  const tttLock   = document.getElementById('ttt-lock');
  const tttBtn    = document.getElementById('ttt-btn');

  if (done >= 1) {
    if (snakeLock) snakeLock.style.display = 'none';
    if (snakeBtn)  snakeBtn.style.display  = 'block';
  }
  if (done >= 2) {
    if (tttLock) tttLock.style.display = 'none';
    if (tttBtn)  tttBtn.style.display  = 'block';
  }
}

function startGame(type) {
  const modal = document.getElementById(`modal-${type}`);
  if (!modal) return;
  modal.classList.add('open');
  if (type === 'tictactoe') initTTT();
  buildSnakePreview();
}

function closeModal(type) {
  const modal = document.getElementById(`modal-${type}`);
  if (modal) modal.classList.remove('open');
  if (type === 'snake') stopSnake();
}

// ============================================================
// SNAKE GAME
// ============================================================
const CELL = 20;
const COLS = 20, ROWS = 20;
let snake, dir, food, snakeScore, snakeHigh, snakeRunning;

function initSnake() {
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dir = { x: 1, y: 0 };
  snakeScore = 0;
  snakeRunning = true;
  placeFoodSnake();
  updateSnakeScore();
}

function placeFoodSnake() {
  do {
    food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function startSnake() {
  document.getElementById('snake-overlay').style.display = 'none';
  initSnake();
  if (state.snakeInterval) clearInterval(state.snakeInterval);
  state.snakeInterval = setInterval(snakeTick, 120);
}

function stopSnake() {
  if (state.snakeInterval) { clearInterval(state.snakeInterval); state.snakeInterval = null; }
  snakeRunning = false;
}

function snakeTick() {
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      snake.some(s => s.x === head.x && s.y === head.y)) {
    stopSnake();
    gameOverSnake(); return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    snakeScore += 10;
    updateSnakeScore();
    placeFoodSnake();
  } else {
    snake.pop();
  }

  drawSnake();
}

function drawSnake() {
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,ROWS*CELL); ctx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(COLS*CELL,y*CELL); ctx.stroke(); }

  // Snake
  snake.forEach((seg, i) => {
    const alpha = 1 - (i / snake.length) * 0.5;
    ctx.fillStyle = i === 0 ? '#43E97B' : `rgba(67,233,123,${alpha})`;
    ctx.beginPath();
    ctx.roundRect(seg.x*CELL+1, seg.y*CELL+1, CELL-2, CELL-2, 4);
    ctx.fill();
    if (i === 0) {
      ctx.fillStyle = '#0A1A10';
      const ex = dir.x === 1 ? 12 : dir.x === -1 ? 5 : 9;
      const ey = dir.y === 1 ? 12 : dir.y === -1 ? 5 : 9;
      ctx.beginPath(); ctx.arc(seg.x*CELL+ex, seg.y*CELL+ey, 2, 0, Math.PI*2); ctx.fill();
    }
  });

  // Food
  ctx.fillStyle = '#FF6584';
  ctx.beginPath();
  ctx.arc(food.x*CELL + CELL/2, food.y*CELL + CELL/2, CELL/2 - 2, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#FF9FB4';
  ctx.beginPath();
  ctx.arc(food.x*CELL + CELL/2 - 2, food.y*CELL + CELL/2 - 2, 3, 0, Math.PI*2);
  ctx.fill();
}

function gameOverSnake() {
  const overlay = document.getElementById('snake-overlay');
  const high = parseInt(localStorage.getItem('ck_snake_high') || '0');
  if (snakeScore > high) { localStorage.setItem('ck_snake_high', snakeScore); }
  document.getElementById('snake-high').textContent = Math.max(snakeScore, high);

  document.getElementById('snake-overlay-icon').textContent = '💀';
  document.getElementById('snake-overlay-title').textContent = 'Game Over!';
  document.getElementById('snake-overlay-msg').textContent = `Điểm của bạn: ${snakeScore}`;
  overlay.style.display = 'flex';
  overlay.querySelector('button').textContent = '▶ Chơi lại';
}

function updateSnakeScore() {
  document.getElementById('snake-score').textContent = snakeScore;
  const high = parseInt(localStorage.getItem('ck_snake_high') || '0');
  document.getElementById('snake-high').textContent = Math.max(snakeScore, high);
}

document.addEventListener('keydown', (e) => {
  if (!snakeRunning) return;
  const keys = {
    ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right',
    w:'up', s:'down', a:'left', d:'right',
    W:'up', S:'down', A:'left', D:'right'
  };
  const d = keys[e.key];
  if (!d) return;
  e.preventDefault();
  if (d === 'up'    && dir.y !== 1)  dir = { x:0,  y:-1 };
  if (d === 'down'  && dir.y !== -1) dir = { x:0,  y:1  };
  if (d === 'left'  && dir.x !== 1)  dir = { x:-1, y:0  };
  if (d === 'right' && dir.x !== -1) dir = { x:1,  y:0  };
});

function buildSnakePreview() {
  const grid = document.getElementById('snake-preview-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const snakePos = [{r:2,c:4},{r:2,c:3},{r:2,c:2}];
  const foodPos  = {r:4,c:6};
  for (let r=0; r<6; r++) for (let c=0; c<8; c++) {
    const cell = document.createElement('div');
    cell.className = 'snake-cell';
    if (snakePos.some(s => s.r===r && s.c===c)) cell.classList.add('snake');
    if (foodPos.r===r && foodPos.c===c)         cell.classList.add('food');
    grid.appendChild(cell);
  }
}

// ============================================================
// TIC-TAC-TOE GAME
// ============================================================
function setTTTMode(mode) {
  state.tttMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`mode-${mode}`).classList.add('active');
  resetTTT();
}

function initTTT() {
  state.tttBoard = Array(9).fill('');
  state.tttCurrent = 'X';
  state.tttGameOver = false;
  renderTTTBoard();
  document.getElementById('ttt-status').textContent = 'Lượt của: ❌';
}

function resetTTT() { initTTT(); }

function renderTTTBoard() {
  const board = document.getElementById('ttt-board');
  board.innerHTML = '';
  state.tttBoard.forEach((cell, idx) => {
    const div = document.createElement('div');
    div.className = `ttt-cell ${cell ? 'taken' : ''}`;
    div.textContent = cell === 'X' ? '❌' : cell === 'O' ? '⭕' : '';
    div.addEventListener('click', () => tttClick(idx));
    board.appendChild(div);
  });
}

function tttClick(idx) {
  if (state.tttGameOver || state.tttBoard[idx]) return;

  state.tttBoard[idx] = state.tttCurrent;
  renderTTTBoard();

  const winner = checkTTTWin();
  if (winner) {
    highlightWin(winner);
    document.getElementById('ttt-status').textContent =
      winner === 'Draw' ? '🤝 Hòa!' : `🎉 ${state.tttCurrent === 'X' ? '❌' : '⭕'} Thắng!`;
    state.tttGameOver = true;
    return;
  }

  state.tttCurrent = state.tttCurrent === 'X' ? 'O' : 'X';
  document.getElementById('ttt-status').textContent =
    `Lượt của: ${state.tttCurrent === 'X' ? '❌' : '⭕'}`;

  if (state.tttMode === 'ai' && state.tttCurrent === 'O' && !state.tttGameOver) {
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  // Minimax-lite: try to win, then block, then random
  const board = state.tttBoard;
  let idx = findBestMove(board, 'O') || findBestMove(board, 'X');
  if (idx === null) {
    const empty = board.map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
    idx = empty[Math.floor(Math.random() * empty.length)];
  }
  if (idx !== null) tttClick(idx);
}

function findBestMove(board, player) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const line of lines) {
    const [a,b,c] = line;
    const vals = [board[a], board[b], board[c]];
    if (vals.filter(v => v===player).length === 2 && vals.includes('')) {
      return line[vals.indexOf('')];
    }
  }
  if (board[4] === '') return 4;
  return null;
}

function checkTTTWin() {
  const b = state.tttBoard;
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const line of lines) {
    const [a,c1,d] = line;
    if (b[a] && b[a] === b[c1] && b[a] === b[d]) return line;
  }
  if (b.every(v => v)) return 'Draw';
  return null;
}

function highlightWin(line) {
  if (line === 'Draw') return;
  const cells = document.querySelectorAll('.ttt-cell');
  line.forEach(i => cells[i].classList.add('win'));
}

// ============================================================
// PROGRESS PAGE
// ============================================================
function renderProgress() {
  const container = document.getElementById('progress-dashboard');
  const total = EXERCISES.length;
  const done  = state.completed.length;
  const pct   = Math.round((done / total) * 100);

  const BADGES = [
    { id: 'first', icon: '🥳', name: 'Bước đầu tiên', req: 1 },
    { id: 'half',  icon: '💪', name: 'Siêng năng',     req: 3 },
    { id: 'all',   icon: '🎓', name: 'Tốt nghiệp',     req: total },
    { id: 'star10',icon: '⭐', name: '10 Sao',          stars: 10 },
    { id: 'star25',icon: '🌟', name: '25 Sao',          stars: 25 },
    { id: 'snake', icon: '🐍', name: 'Kỳ thủ Rắn',     snake: true },
  ];

  container.innerHTML = `
    <div class="progress-overview">
      <div class="progress-stat">
        <div class="stat-value">${done}</div>
        <div class="stat-label">Bài hoàn thành</div>
      </div>
      <div class="progress-stat">
        <div class="stat-value">${state.stars}</div>
        <div class="stat-label">⭐ Sao tích lũy</div>
      </div>
      <div class="progress-stat">
        <div class="stat-value">${pct}%</div>
        <div class="stat-label">Tiến độ</div>
      </div>
      <div class="progress-stat">
        <div class="stat-value">${parseInt(localStorage.getItem('ck_snake_high') || 0)}</div>
        <div class="stat-label">🐍 Kỷ lục Rắn</div>
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar-label">
        <span>📈 Tiến trình học tập (${done}/${total} bài)</span>
        <span>${pct}%</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
    </div>

    <h2 style="font-size:1.5rem;font-weight:900;margin-bottom:1.25rem">🏅 Huy Hiệu</h2>
    <div class="badge-grid">
      ${BADGES.map(b => {
        let unlocked = false;
        if (b.req)   unlocked = done >= b.req;
        if (b.stars) unlocked = state.stars >= b.stars;
        return `
          <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
          </div>
        `;
      }).join('')}
    </div>

    <h2 style="font-size:1.5rem;font-weight:900;margin:2rem 0 1.25rem">📋 Chi tiết bài tập</h2>
    <div style="display:grid;gap:.75rem">
      ${EXERCISES.map(ex => {
        const isDone = state.completed.includes(ex.id);
        return `
          <div style="background:var(--card);border:1px solid ${isDone ? 'rgba(67,233,123,.4)' : 'var(--border)'};border-radius:12px;padding:1rem 1.25rem;display:flex;align-items:center;gap:1rem;cursor:pointer" onclick="openExercise('${ex.id}')">
            <span style="font-size:1.75rem">${ex.icon}</span>
            <div style="flex:1">
              <div style="font-weight:800">${ex.title}</div>
              <div style="font-size:.85rem;color:var(--text-muted)">${levelLabel(ex.level)}</div>
            </div>
            <span>${isDone ? '✅' : '⬜'}</span>
            <span style="color:var(--warning);font-size:.85rem;font-weight:700">⭐ ${ex.stars}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ============================================================
// UTILITY
// ============================================================
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateStarDisplay();
  renderHome();
  buildSnakePreview();
  checkGameUnlocks();
});
