# Pé Ti – Học tài chính vui như chơi 🐧

Một web app học tài chính cá nhân cho trẻ em Việt Nam 5–15 tuổi, lấy cảm hứng từ Duolingo. Mascot là chú chim cánh cụt **Pé Ti** dẫn dắt bé qua các bài học ngắn, vui nhộn, có gamification đầy đủ (streak, hearts, xu, huy hiệu, level map).

## ✨ Tính năng MVP

- **6 chủ đề × 3 bài = 18 bài học** đầy đủ nội dung
- **4 dạng câu hỏi tương tác:** Trắc nghiệm, Đúng/Sai, Kéo-xếp (drag-sort), Nhập số
- **Mascot Pé Ti** với animation (idle/happy/sad/thinking/celebrate/wave)
- **Level map zig-zag** giống Duolingo, mở bài theo thứ tự
- **Gamification:** Streak hàng ngày, Hearts (5 tim, sai mất 1, hồi bằng 50 xu), Xu & XP, **14 huy hiệu**
- **Hồ sơ cá nhân:** Thống kê XP, xu, streak, tỉ lệ chính xác, tiến độ từng chủ đề, huy hiệu
- **Lưu localStorage** – không cần backend, refresh là có dữ liệu
- **Responsive** cho cả mobile & desktop
- **100% tiếng Việt**, font Be Vietnam Pro

## 🚀 Chạy local

```bash
npm install
npm run dev
# mở http://localhost:3000
```

Build production:

```bash
npm run build
npm start
```

## 🛠 Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** với theme màu vui nhộn (Duolingo palette)
- **Zustand** + **persist middleware** (localStorage)
- **Framer Motion** cho animation
- **Lucide React** cho icons
- **Be Vietnam Pro** (Google Fonts) - hỗ trợ đầy đủ tiếng Việt

## 📚 Nội dung bài học

### Chủ đề 1: Tiền là gì? 💵 (5-11 tuổi)
1. **Tiền đến từ đâu?** – Nguồn gốc, Ngân hàng Nhà nước, đơn vị VND
2. **Làm quen với tờ tiền** – Nhận biết mệnh giá, tính tiền thừa
3. **Tiền dùng để làm gì?** – Công dụng, giới hạn của tiền

### Chủ đề 2: Nhu cầu & Mong muốn 🎯 (8-15 tuổi)
1. **Nhu cầu vs. Mong muốn** – Phân biệt thứ cần và thứ thích
2. **Tình huống mua sắm** – Ra quyết định thông minh
3. **Lập danh sách ưu tiên** – Quy trình 4 bước

### Chủ đề 3: Tiết kiệm thông minh 🐷 (8-15 tuổi)
1. **Mục tiêu tiết kiệm** – SMART, tính thời gian đạt mục tiêu
2. **Heo đất ảo** – Thói quen tiết kiệm, công thức 30-50%
3. **Lãi kép & đầu tư cơ bản** – Cách tiền sinh ra tiền

### Chủ đề 4: Kiếm tiền & Nghề nghiệp 💼 (8-15 tuổi) ⭐ MỚI
1. **Tiền đến từ đâu?** – Kiếm tiền chính đáng vs xin tiền
2. **Lao động & giá trị** – Mỗi nghề đều đáng trân trọng
3. **Làm việc nhóm & chia tiền** – Công bằng theo công sức

### Chủ đề 5: An toàn tài chính 🛡️ (12-15 tuổi) ⭐ MỚI
1. **Bảo vệ tiền của mình** – OTP, mật khẩu, lừa đảo
2. **Quỹ dự phòng** – Cứu cánh khẩn cấp
3. **Tránh tín dụng đen** – Cho vay nặng lãi

### Chủ đề 6: Đầu tư cơ bản 📈 (12-15 tuổi) ⭐ MỚI
1. **Gửi tiết kiệm ngân hàng** – Lãi suất đơn giản
2. **Lãi kép - Sức mạnh thời gian** – Lãi mẹ đẻ lãi con
3. **Cổ phiếu, trái phiếu là gì?** – Phân loại rủi ro

## 🗂 Cấu trúc project

```
pe-ti-finance/
├── app/
│   ├── layout.tsx              # Root layout (font, metadata)
│   ├── globals.css             # Tailwind v4 + theme
│   ├── page.tsx                # Landing + onboarding (3 bước)
│   ├── home/page.tsx           # Dashboard với level map zig-zag
│   ├── lesson/[id]/page.tsx    # Lesson player
│   └── profile/page.tsx        # Hồ sơ + huy hiệu
├── components/
│   ├── mascot/Penguin.tsx      # Mascot Pé Ti SVG
│   ├── ui/                     # Button, Card, ProgressBar, Hearts, Stats, Badge
│   ├── lesson/
│   │   ├── cards/              # MultipleChoice, TrueFalse, DragSort, InputNumber
│   │   ├── FeedbackBar.tsx
│   │   └── LessonComplete.tsx
│   └── useMounted.ts
├── lib/
│   ├── types.ts                # TypeScript domain types
│   ├── lessons.ts              # 9 bài học + 8 huy hiệu
│   ├── store.ts                # Zustand + localStorage
│   └── utils.ts
├── public/
│   └── favicon.svg             # Pé Ti icon
├── screenshots/                # Screenshots demo
└── ...
```

## 🎮 Luồng người dùng

1. **Landing** → chọn tên + tuổi (5–15)
2. **Home** → mascot chào, level map zig-zag với 9 nút bài học
3. **Lesson intro** → giới thiệu bài, thưởng tối đa
4. **Questions** → 3–5 câu hỏi các dạng
5. **Feedback** → Pé Ti phản hồi vui, giải thích
6. **Complete** → nhận XP, xu, huy hiệu (nếu đủ điều kiện)
7. **Home** → bài tiếp theo tự mở

## 🏆 14 huy hiệu

- 🌱 Bước đầu tiên – hoàn thành bài đầu tiên
- 🔥 Ba ngày liên tục – streak 3
- 🔥 Một tuần kiên trì – streak 7
- 💰 Chuyên gia tiền tệ – xong chủ đề "Tiền là gì?"
- 🛍️ Người mua sắm thông minh – xong "Nhu cầu & Mong muốn"
- 🐖 Cao thủ tiết kiệm – xong "Tiết kiệm thông minh"
- 💼 Bậc thầy kiếm tiền – xong "Kiếm tiền & Nghề nghiệp"
- 🛡️ Vệ sĩ tài chính – xong "An toàn tài chính"
- 📈 Nhà đầu tư nhí – xong "Đầu tư cơ bản"
- 🪙 Trăm xu đầu tiên – 100 xu
- 🎓 Học giả tí hon – 100 XP
- 📚 Học bá tập sự – 200 XP
- 🏆 Hoàn thành xuất sắc – xong tất cả 18 bài

## 🛣 Roadmap (sau MVP)

- [ ] Sound effects (Howler.js) với toggle
- [ ] Thêm chủ đề 4: Kiếm tiền & Khởi nghiệp (12-15)
- [ ] Thêm chủ đề 5: Quản lý thu chi cá nhân (12-15)
- [ ] Trang phụ huynh theo dõi tiến độ con
- [ ] Backend (Supabase) để đồng bộ giữa nhiều thiết bị
- [ ] Đăng nhập OAuth (Google) cho phụ huynh
- [ ] Bảng xếp hạng gia đình / lớp học
- [ ] Xuất báo cáo PDF cho phụ huynh
- [ ] Mini-game bổ sung: Mở tài khoản tiết kiệm ảo, Phát hiện quảng cáo lừa đảo

## 📸 Screenshots

Xem trong folder `screenshots/`.

---

Made with 💚 for Vietnamese kids.
