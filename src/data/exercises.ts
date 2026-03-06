export type StepType = 'quiz' | 'code' | 'arrange'
export type ExerciseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Step {
    title: string
    explanation: string
    code?: string
    type: StepType
    question?: string
    options?: string[]
    correct?: number | number[]
    placeholder?: string
    validate?: (val: string) => boolean
    hint?: string
    feedback: string
    blocks?: string[]
}

export interface Exercise {
    id: string
    title: string
    description: string
    level: ExerciseLevel
    stars: number
    icon: string
    steps: Step[]
}

export const EXERCISES: Exercise[] = [
    {
        id: 'ex01', title: 'Biến và Kiểu Dữ Liệu', icon: '📦',
        description: 'Tìm hiểu về biến – nơi lưu trữ dữ liệu trong lập trình.',
        level: 'beginner', stars: 3,
        steps: [
            {
                title: 'Biến là gì?', type: 'quiz',
                explanation: 'Biến (Variable) giống như một cái hộp để chứa thông tin. Mỗi hộp có một cái tên để bạn nhận ra nó.',
                code: '# Đây là một biến\nten = "An"\ntuoi = 10\nprint(ten, "năm nay", tuoi, "tuổi")',
                question: 'Trong đoạn code trên, "ten" là gì?',
                options: ['Một lệnh in', 'Một biến chứa tên', 'Một số', 'Một hàm'],
                correct: 1,
                feedback: '🎯 Đúng rồi! "ten" là một biến chứa chuỗi ký tự "An".'
            },
            {
                title: 'Tạo biến đầu tiên', type: 'code',
                explanation: 'Hãy tạo một biến tên là "truong" chứa tên trường của bạn.',
                code: '# Gợi ý:\nten = "Nguyễn Văn An"\ntuoi = 12',
                placeholder: 'truong = "Tên trường của bạn"',
                validate: (v) => v.includes('truong') && v.includes('='),
                hint: 'Gợi ý: truong = "Tên trường của bạn"',
                feedback: '🎉 Tuyệt! Bạn đã tạo biến thành công!'
            },
            {
                title: 'Các kiểu dữ liệu', type: 'arrange',
                explanation: 'Sắp xếp các khối code để in ra: "Xin chào, An!"',
                code: 'so_nguyen = 10\nso_thuc = 3.14\nchuoi = "Xin chào"\ndung_sai = True',
                blocks: ['print(loi_chao)', 'loi_chao = "Xin chào, " + ten + "!"', 'ten = "An"'],
                correct: [2, 1, 0],
                feedback: '🔥 Xuất sắc! Bạn hiểu cách dùng biến rồi!'
            }
        ]
    },
    {
        id: 'ex02', title: 'Câu Lệnh Điều Kiện', icon: '🔀',
        description: 'Học cách cho máy tính "đưa ra quyết định" với if-else.',
        level: 'beginner', stars: 3,
        steps: [
            {
                title: 'Lệnh IF là gì?', type: 'quiz',
                explanation: 'Lệnh IF giúp chương trình kiểm tra điều kiện và thực hiện hành động khác nhau.',
                code: 'diem = 8\nif diem >= 5:\n    print("Đậu rồi! 🎉")\nelse:\n    print("Học thêm nha 📚")',
                question: 'Nếu diem = 3, chương trình sẽ in ra gì?',
                options: ['Đậu rồi! 🎉', 'Học thêm nha 📚', 'Không in gì', 'Báo lỗi'],
                correct: 1, feedback: '✅ Đúng! Vì 3 < 5 nên điều kiện sai, chạy vào else.'
            },
            {
                title: 'Thực hành viết IF', type: 'code',
                explanation: 'Viết câu lệnh IF: nếu nhiệt độ > 30 in "Trời nóng quá!", ngược lại in "Thời tiết dễ chịu!"',
                code: 'nhiet_do = 35',
                placeholder: 'if nhiet_do > 30:\n    print("Trời nóng quá!")\nelse:\n    print("Thời tiết dễ chịu!")',
                validate: (v) => v.includes('if') && v.includes('else') && v.includes('nhiet_do'),
                hint: 'Gợi ý: if nhiet_do > 30:',
                feedback: '🌡️ Tuyệt! Bạn đã viết được câu lệnh if-else!'
            },
            {
                title: 'IF lồng nhau', type: 'arrange',
                explanation: 'Sắp xếp code để phân loại điểm (>=9: Xuất sắc, >=7: Khá, >=5: TB, <5: Yếu)',
                blocks: ['    print("Trung bình")', 'elif diem >= 7:', 'if diem >= 9:', '    print("Yếu")', '    print("Xuất sắc")', '    print("Khá")'],
                correct: [2, 4, 1, 5, 0, 3],
                feedback: '🏆 Hoàn hảo! Bạn đã nắm được if-elif-else!'
            }
        ]
    },
    {
        id: 'ex03', title: 'Vòng Lặp For', icon: '🔄',
        description: 'Lặp đi lặp lại một hành động nhiều lần với vòng lặp for.',
        level: 'beginner', stars: 3,
        steps: [
            {
                title: 'Vòng lặp là gì?', type: 'quiz',
                explanation: 'Thay vì viết print() 10 lần, bạn dùng vòng lặp for để lặp lại hành động đó.',
                code: 'for i in range(10):\n    print("Xin chào", i+1)',
                question: 'Vòng lặp "for i in range(5)" lặp bao nhiêu lần?',
                options: ['4 lần', '5 lần', '6 lần', '1 lần'],
                correct: 1, feedback: '✅ Đúng! range(5) tạo ra 0,1,2,3,4 – tổng 5 giá trị.'
            },
            {
                title: 'Bảng cửu chương', type: 'code',
                explanation: 'Hoàn thiện đoạn code để in bảng cửu chương số 3 (từ 3×1 đến 3×10).',
                code: 'so = 3\n# Cần lặp từ 1 đến 10',
                placeholder: 'so = 3\nfor i in range(1, 11):\n    print(so, "x", i, "=", so * i)',
                validate: (v) => v.includes('for') && v.includes('range') && v.includes('print'),
                hint: 'Gợi ý: for i in range(1, 11): rồi print(so, "x", i, "=", so*i)',
                feedback: '✖️ Bảng cửu chương của thần đồng lập trình đây!'
            },
            {
                title: 'Sắp xếp vòng lặp', type: 'arrange',
                explanation: 'Sắp xếp các khối để in ra dãy Fibonacci: 0 1 1 2 3 5 8',
                blocks: ['a, b = b, a + b', 'print(a, end=" ")', 'a, b = 0, 1', 'for _ in range(7):'],
                correct: [2, 3, 1, 0],
                feedback: '🌀 Fibonacci master! Bạn xuất sắc!'
            }
        ]
    },
    {
        id: 'ex04', title: 'Hàm (Function)', icon: '⚙️',
        description: 'Đóng gói code vào hàm để dùng lại nhiều lần.',
        level: 'intermediate', stars: 4,
        steps: [
            {
                title: 'Hàm là gì?', type: 'quiz',
                explanation: 'Hàm là đoạn code được đặt tên, bạn có thể gọi nhiều lần mà không cần viết lại.',
                code: 'def chao(ten):\n    print("Xin chào,", ten, "!")\n\nchao("An")\nchao("Bình")',
                question: 'Từ khóa nào dùng để định nghĩa hàm trong Python?',
                options: ['function', 'def', 'fun', 'define'],
                correct: 1, feedback: '✅ Đúng! Trong Python dùng "def" để tạo hàm.'
            },
            {
                title: 'Viết hàm tính diện tích', type: 'code',
                explanation: 'Viết hàm tinh_dien_tich(dai, rong) trả về diện tích hình chữ nhật.',
                code: '# def ten_ham(tham_so):\n#     return ket_qua',
                placeholder: 'def tinh_dien_tich(dai, rong):\n    return dai * rong\n\nprint(tinh_dien_tich(5, 3))',
                validate: (v) => v.includes('def') && v.includes('return') && v.includes('*'),
                hint: 'Gợi ý: def tinh_dien_tich(dai, rong): return dai * rong',
                feedback: '📐 Tuyệt! Hàm tính diện tích hoạt động hoàn hảo!'
            },
            {
                title: 'Hàm đệ quy', type: 'arrange',
                explanation: 'Sắp xếp để tạo hàm tính giai thừa: n! = n × (n-1) × ... × 1',
                blocks: ['def giai_thua(n):', 'print(giai_thua(5))', '    if n == 1: return 1', '    return n * giai_thua(n-1)'],
                correct: [0, 2, 3, 1],
                feedback: '♾️ Đệ quy master! Bạn thật sự xuất sắc!'
            }
        ]
    },
    {
        id: 'ex05', title: 'Danh Sách (List)', icon: '📋',
        description: 'Lưu nhiều giá trị trong một biến với cấu trúc danh sách.',
        level: 'intermediate', stars: 4,
        steps: [
            {
                title: 'List là gì?', type: 'quiz',
                explanation: 'List giống như danh sách mua hàng – chứa nhiều thứ. Mỗi phần tử có vị trí (index) bắt đầu từ 0.',
                code: 'trai_cay = ["Táo", "Chuối", "Xoài"]\nprint(trai_cay[0])  # Táo\nprint(trai_cay[1])  # Chuối',
                question: 'Nếu list = ["A","B","C","D"], thì list[2] bằng gì?',
                options: ['"A"', '"B"', '"C"', '"D"'],
                correct: 2, feedback: '✅ Đúng! Index bắt đầu từ 0, nên index 2 là "C".'
            },
            {
                title: 'Thêm phần tử', type: 'code',
                explanation: 'Dùng .append() để thêm "Dưa Hấu" vào danh sách trái cây.',
                code: 'trai_cay = ["Táo", "Chuối", "Xoài"]',
                placeholder: 'trai_cay = ["Táo", "Chuối", "Xoài"]\ntrai_cay.append("Dưa Hấu")\nprint(trai_cay)',
                validate: (v) => v.includes('.append(') || v.includes('append('),
                hint: 'Gợi ý: trai_cay.append("...")',
                feedback: '🍉 Dưa Hấu đã vào danh sách!'
            },
            {
                title: 'Duyệt List', type: 'arrange',
                explanation: 'Sắp xếp code để in từng môn học.',
                blocks: ['    print("Môn:", mon)', 'mon_hoc = ["Toán", "Văn", "Anh"]', 'for mon in mon_hoc:'],
                correct: [1, 2, 0],
                feedback: '📚 Tuyệt! Bạn biết duyệt list rồi!'
            }
        ]
    },
    {
        id: 'ex06', title: 'Bug Hunting 🐛', icon: '🐛',
        description: 'Tìm và sửa lỗi trong code – kỹ năng quan trọng của lập trình viên!',
        level: 'advanced', stars: 5,
        steps: [
            {
                title: 'Debug là gì?', type: 'quiz',
                explanation: 'Debug là việc tìm và sửa lỗi (bug) trong code.',
                code: '# Code có lỗi:\nfor i in range(1, 6)\n    print("Số:", i)',
                question: 'Dòng nào bị lỗi?',
                options: ['Dòng 1: for i in range(1, 6)', 'Cả hai dòng', 'Dòng 2: print', 'Không có lỗi'],
                correct: 0, feedback: '🔍 Tìm ra bug rồi! Thiếu dấu ":" cuối lệnh for.'
            },
            {
                title: 'Sửa code lỗi', type: 'code',
                explanation: 'Sửa lại đoạn code sau cho đúng để in bảng cửu chương 2.',
                code: '# Code lỗi:\nfor i in range(1, 11)\n    prit("2 x", i, "=", 2*i)',
                placeholder: 'for i in range(1, 11):\n    print("2 x", i, "=", 2*i)',
                validate: (v) => v.includes('print') && v.includes(':') && v.includes('range'),
                hint: 'Có 2 lỗi: thiếu ":" và sai tên hàm (prit → print)',
                feedback: '🏅 Bug hunter xuất sắc! Code đã chạy đúng!'
            },
            {
                title: 'Thử thách cuối', type: 'arrange',
                explanation: 'Sắp xếp để tính tổng từ 1 đến 100 (kết quả đúng: 5050)',
                blocks: ['tong = 0', 'print("Tổng 1→100:", tong)', 'for i in range(1, 101):', '    tong += i'],
                correct: [0, 2, 3, 1],
                feedback: '🎓 Hoàn hảo! 1+2+...+100 = 5050!'
            }
        ]
    },
    {
        id: 'ex07', title: 'Lập Trình Rắn Săn Mồi 🐍', icon: '🐍',
        description: 'Khám phá cách lập trình trò chơi Rắn Săn Mồi từng bước — rồi chơi thử ngay!',
        level: 'advanced', stars: 5,
        steps: [
            {
                title: 'Game hoạt động như thế nào?', type: 'quiz',
                explanation: 'Rắn Săn Mồi dùng một vòng lặp game (game loop) chạy liên tục: cập nhật vị trí rắn → vẽ lại màn hình → kiểm tra va chạm → lặp lại.',
                code: '# Cấu trúc cơ bản của game loop:\nwhile dang_chay:\n    xu_ly_phim_bam()    # Đọc input\n    cap_nhat_vi_tri()   # Di chuyển rắn\n    kiem_tra_va_cham()  # Tường? Thân rắn?\n    ve_lai_man_hinh()   # Hiển thị',
                question: 'Thành phần nào KHÔNG có trong game loop của Rắn Săn Mồi?',
                options: ['Đọc phím mũi tên', 'Di chuyển vị trí rắn', 'Tính điểm môn học', 'Vẽ lại màn hình'],
                correct: 2,
                feedback: '🐍 Đúng! Tính điểm môn học không liên quan — game loop chỉ xử lý: input, cập nhật, vẽ!'
            },
            {
                title: 'Lập trình di chuyển rắn', type: 'code',
                explanation: 'Rắn được lưu như một danh sách các ô (x, y). Mỗi bước, ta thêm đầu mới và xóa đuôi cũ — rắn "di chuyển" mà không cần dịch từng ô!',
                code: '# Rắn là list các tọa độ:\nran = [(5,5), (4,5), (3,5)]  # đầu→đuôi\nhướng = (1, 0)               # đang đi sang phải\n\n# Di chuyển: thêm đầu mới\ndau_moi = (ran[0][0] + hướng[0],\n           ran[0][1] + hướng[1])',
                placeholder: 'ran = [(5,5), (4,5), (3,5)]\nhuong = (1, 0)\ndau_moi = (ran[0][0] + huong[0], ran[0][1] + huong[1])\nran.insert(0, dau_moi)\nran.pop()  # xóa đuôi',
                validate: (v) => v.includes('insert') && v.includes('pop') && (v.includes('ran') || v.includes('rắn')),
                hint: 'Gợi ý: ran.insert(0, dau_moi) rồi ran.pop() để xóa đuôi',
                feedback: '🎮 Rắn biết di chuyển rồi! Thêm thức ăn và va chạm là xong!'
            },
            {
                title: 'Sắp xếp logic game đầy đủ', type: 'arrange',
                explanation: 'Sắp xếp các bước để hoàn thiện vòng lặp game Rắn Săn Mồi.',
                blocks: [
                    'if dau_moi == vi_tri_thuc_an:',
                    '    ran.pop()  # xóa đuôi (di chuyển bình thường)',
                    'ran.insert(0, dau_moi)  # thêm đầu mới',
                    '    diem += 1  # ăn được mồi!',
                    'else:',
                    'dau_moi = tinh_dau_moi(ran[0], huong)',
                ],
                correct: [5, 2, 0, 3, 4, 1],
                feedback: '🏆 Xuất sắc! Bạn vừa lập trình xong logic cốt lõi của Rắn Săn Mồi!'
            }
        ]
    },
    {
        id: 'ex08', title: 'Lập Trình Cờ Caro ❌⭕', icon: '❌',
        description: 'Học cách xây dựng trò chơi Cờ Caro — từ bàn cờ đến kiểm tra thắng thua!',
        level: 'advanced', stars: 5,
        steps: [
            {
                title: 'Bàn cờ là gì trong lập trình?', type: 'quiz',
                explanation: 'Bàn cờ 3×3 được lưu như một danh sách 9 ô. Mỗi ô có giá trị: "X", "O", hoặc "" (trống). Index từ 0→8, từ trái→phải, trên→dưới.',
                code: '# Bàn cờ 3x3:\nban_co = ["", "", "",   # hàng 1: ô 0,1,2\n          "", "", "",   # hàng 2: ô 3,4,5\n          "", "", ""]  # hàng 3: ô 6,7,8\n\nban_co[4] = "X"  # đánh vào ô giữa',
                question: 'Để đánh vào góc trên-phải (hàng 1, cột 3), dùng index nào?',
                options: ['ban_co[0]', 'ban_co[2]', 'ban_co[3]', 'ban_co[6]'],
                correct: 1,
                feedback: '✅ Đúng! Index 2 là ô cuối hàng đầu tiên (0→trái, 1→giữa, 2→phải).'
            },
            {
                title: 'Kiểm tra điều kiện thắng', type: 'code',
                explanation: 'Có 8 tổ hợp thắng: 3 hàng ngang, 3 hàng dọc, 2 đường chéo. Viết hàm kiem_tra_thang(ban_co, nguoi_choi) trả về True nếu người chơi đó thắng.',
                code: '# 8 tổ hợp thắng:\nTO_HOP_THANG = [\n    [0,1,2], [3,4,5], [6,7,8],  # ngang\n    [0,3,6], [1,4,7], [2,5,8],  # dọc\n    [0,4,8], [2,4,6]            # chéo\n]',
                placeholder: 'def kiem_tra_thang(ban_co, nguoi_choi):\n    for to_hop in TO_HOP_THANG:\n        if all(ban_co[o] == nguoi_choi for o in to_hop):\n            return True\n    return False',
                validate: (v) => v.includes('def') && v.includes('return True') && v.includes('return False'),
                hint: 'Gợi ý: dùng for to_hop in TO_HOP_THANG: rồi kiểm tra all(ban_co[o] == nguoi_choi ...)',
                feedback: '🎯 Hàm kiểm tra thắng hoạt động! Giờ cờ caro có thể biết ai thắng rồi!'
            },
            {
                title: 'Sắp xếp lượt chơi AI', type: 'arrange',
                explanation: 'Sắp xếp code để AI biết đi nước cờ tốt nhất: ưu tiên thắng → chặn → giữa → ngẫu nhiên.',
                blocks: [
                    'def ai_di(ban_co):',
                    '    if o_giua_trong: return 4       # ưu tiên giữa',
                    '    nuoc_thang = tim_nuoc(ban_co, "O")',
                    '    if nuoc_thang is not None: return nuoc_thang',
                    '    nuoc_chan = tim_nuoc(ban_co, "X")',
                    '    if nuoc_chan is not None: return nuoc_chan',
                ],
                correct: [0, 2, 3, 4, 5, 1],
                feedback: '🤖 AI của bạn biết suy nghĩ rồi! Ưu tiên thắng → chặn đối thủ → giữa bàn!'
            }
        ]
    }
]

export const HERO_LINES = [
    { text: '# CodeKids - Học lập trình siêu vui!', cls: 'code-comment' },
    { text: 'ten = "Bạn"', cls: '' },
    { text: 'diem = 10', cls: '' },
    { text: '', cls: '' },
    { text: 'def xin_chao(ten):', cls: 'code-func' },
    { text: '    print("Chào " + ten + "!")', cls: 'code-string' },
    { text: '', cls: '' },
    { text: '# Gọi hàm:', cls: 'code-comment' },
    { text: 'xin_chao(ten)', cls: 'code-func' },
    { text: '# Output: Chào Bạn!', cls: 'code-comment' },
]
