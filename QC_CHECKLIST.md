# QC Checklist — Pé Ti Finance (Tier 4 manual review)

Checklist này dùng khi review thủ công trước khi merge major PR hoặc release.

## Cho mỗi bài học (lesson)

### A. Logic nội dung
- [ ] **Title + subtitle** rõ ràng, hấp dẫn với trẻ em
- [ ] **Age group** phù hợp với độ dài + độ phức tạp của text
- [ ] **XP/coin reward** tương xứng với độ khó

### B. Story (Pé Ti kể chuyện)
- [ ] **Scene 0** giới thiệu context thân thiện (Pé Ti làm gì đó quen thuộc)
- [ ] **Scene cuối** có CTA rõ ràng: "bạn cũng thử nhé" / tổng kết
- [ ] **Flow** tự nhiên: mở → phát triển → cao trào → kết
- [ ] **Mood** chuyển hợp lý (warning QC: sad sau happy có thể cố ý)
- [ ] **Visual props** match concept (vd: heo đất cho bài tiết kiệm)
- [ ] **Không có scene "thừa"** — mỗi scene dạy ít nhất 1 concept được test trong Q

### C. Questions
- [ ] **Câu hỏi đầu tiên** không quá khó (warm-up)
- [ ] **Mỗi Q test đúng concept đã dạy trong story** (không hỏi ngoài phạm vi)
- [ ] **Câu hỏi cuối** có twist hoặc vận dụng (cao hơn recall)
- [ ] **Explainer** giải thích tại sao đúng, không chỉ "đúng rồi"
- [ ] **Không có Q trùng nhau** về concept

### D. Audio
- [ ] Nghe 1-2 scene random, confirm giọng **Thắm** (ElevenLabs V3) — không phải Web Speech
- [ ] Audio khớp với text hiển thị trên màn hình
- [ ] Không nghe thấy audio tags như `[happy]`, `[curious]`

## Cho mỗi topic (3-4 lessons)

### E. Progression
- [ ] **Lesson 1**: giới thiệu concept cơ bản nhất
- [ ] **Lesson 2**: mở rộng concept (không lặp lại lesson 1)
- [ ] **Lesson 3**: vận dụng (tính toán / quyết định)
- [ ] **Lesson 4 (nếu có)**: edge case / pitfall / safety
- [ ] **Vocabulary** tăng dần (lesson 1 dùng từ đơn giản, sau phức tạp hơn)

### F. Cross-topic
- [ ] Mỗi topic có **mục tiêu rõ ràng** (không overlap với topic khác)
- [ ] Thứ tự topic: cơ bản (money) → nâng cao (invest) → safety (safety/epay)
- [ ] References giữa các topic (vd: saving lesson nhắc đến money lesson) — bonus

## Audio baseline

Sau khi verify toàn bộ audio cho 1 lesson (hoặc tất cả):

```bash
npm run qc:baseline          # snapshot toàn bộ
npm run qc:baseline -- --lesson=money-1   # chỉ 1 lesson
```

Baseline giúp CI phát hiện MP3 nào thay đổi ngoài ý muốn.

## Khi có warning từ `npm run qc`

1. **Đọc warning** — xem có phải vấn đề thật không
2. **Nếu vấn đề thật**:
   - Thêm Q test concept bị thiếu
   - Hoặc xóa scene thừa
   - Hoặc dùng từ vựng nhất quán giữa story + Q
3. **Nếu false positive**:
   - Skip warning đó (chấp nhận nó)
   - Hoặc refine QC (xem scripts/qc.js)
4. **Sau khi fix**: chạy lại `npm run qc` để confirm
5. **Nếu lesson đã clean 100%**: `npm run qc:baseline -- --lesson=X` để update baseline
