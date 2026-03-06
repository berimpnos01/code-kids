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
