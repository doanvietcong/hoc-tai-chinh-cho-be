# 🎙️ Hướng dẫn tích hợp FPT.AI TTS (giọng Việt chuẩn)

App hiện dùng **Web Speech API** (giọng mặc định của trình duyệt) - chất lượng không ổn định, phụ thuộc máy. FPT.AI TTS cho **giọng Việt chuẩn 100%**, mọi thiết bị nghe giống nhau.

---

## 🆓 Bước 1: Tạo tài khoản FPT.AI (5 phút)

1. Truy cập **https://fpt.ai/tts** (hoặc https://fpt.ai → API → TTS)
2. Click **"Đăng ký"** / **"Dùng thử miễn phí"**
3. Đăng ký bằng **email** (khuyến nghị) hoặc số điện thoại
4. Xác thực email → vào Dashboard

## 🔑 Bước 2: Lấy API Key (1 phút)

1. Trong Dashboard, vào **"API Console"** hoặc **"Quản lý API"**
2. Chọn sản phẩm **"Text to Speech"**
3. Click **"Tạo API Key"** (nếu chưa có) → copy key
4. API key có dạng: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

> ⚠️ **GIỮ BÍ MẬT** key này. Không commit lên Git. Sẽ để trong file `.env.local` (đã có trong .gitignore).

## 🛠️ Bước 3: Setup môi trường local (2 phút)

Mở PowerShell tại thư mục project, tạo file `.env.local`:

```powershell
# Tạo file .env.local với API key
"FPT_AI_API_KEY=your-key-here" | Out-File -FilePath .env.local -Encoding UTF8
```

Sau đó sửa lại bằng cách mở file `.env.local` và thay `your-key-here` bằng API key thật:

```
FPT_AI_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> File `.env.local` đã có sẵn trong `.gitignore` của Next.js, nên an toàn không bị push lên.

## 🎵 Bước 4: Generate audio cho tất cả stories (3-5 phút)

```powershell
# Cài đặt dependency mới (chỉ chạy 1 lần)
npm install node-fetch

# Chạy script generate audio
npm run generate-audio
```

Script sẽ:
- Đọc tất cả stories từ `lib/stories.ts`
- Gọi FPT.AI API cho mỗi scene (~70 scenes × 50 chars ≈ 3,500 chars)
- Lưu file MP3 vào `public/audio/{lessonId}/{sceneIdx}.mp3`
- Tổng thời gian: ~3-5 phút (rate-limited 1 request/giây)
- Tổng dung lượng: ~2-3 MB

**Output mẫu:**
```
📁 public/audio/
├── saving-1/
│   ├── 0.mp3  (16 KB) "Hôm nay Pé Ti được mẹ cho..."
│   ├── 1.mp3  (18 KB) "Mỗi ngày Pé Ti bỏ vào..."
│   └── ...
├── saving-4/
│   ├── 0.mp3
│   ├── 1.mp3
│   └── ...
```

> 🎁 **FPT.AI free tier: 20,000 chars/tháng** - chúng ta chỉ dùng ~3,500 chars, thoải mái. Nếu sau này muốn generate thêm (vd: feedback voices), vẫn còn dư hơn 16,000 chars.

## 🚀 Bước 5: App tự động dùng MP3 (đã có sẵn code)

Sau khi generate xong, app sẽ **TỰ ĐỘNG** dùng MP3 thay vì Web Speech API. Không cần sửa code gì thêm.

- Mở `/lesson/saving-4` → click "Nghe Pé Ti kể chuyện"
- Audio phát từ file MP3 (giọng Việt chuẩn)
- Nếu MP3 không tồn tại (vd: lesson mới chưa generate) → fallback Web Speech API

## 🔄 Khi nào cần generate lại?

- Thêm **story mới** vào `lib/stories.ts` → chạy lại `npm run generate-audio`
- Muốn **đổi giọng** (nam/nữ/giọng miền) → sửa `VOICE` trong `scripts/generate-audio.js`
- Cập nhật nội dung text → xóa file MP3 cũ + chạy lại script

## 🛠️ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách fix |
|------|-------------|----------|
| `401 Unauthorized` | API key sai | Kiểm tra lại key trong `.env.local` |
| `429 Too Many Requests` | Gọi quá nhanh | Script đã tự động delay 1s/request, nếu vẫn lỗi thì đợi 1 phút |
| `Quota exceeded` | Hết free tier tháng | Đợi sang tháng sau hoặc nâng cấp plan |
| MP3 không phát | File chưa được serve | Check `public/audio/` có file không, restart `npm run dev` |

## 🎤 Các giọng có sẵn trên FPT.AI

| Voice ID | Giới tính | Vùng miền | Gợi ý dùng cho |
|----------|-----------|-----------|----------------|
| `lemy` | Nữ | Miền Nam | **Mặc định - Pé Ti** ✓ |
| `myan` | Nữ | Miền Nam | Backup nếu muốn đổi |
| `thuminh` | Nữ | Miền Bắc | Bé miền Bắc |
| `leminh` | Nam | Miền Bắc | Giọng nam kể chuyện |
| `giahuy` | Nam | Miền Nam | Giọng nam miền Nam |
| `minhquang` | Nam | Miền Bắc | (legacy) |

Mặc định em chọn `lemy` (nữ, miền Nam - nghe dễ thương, rõ ràng). Muốn đổi, sửa dòng `VOICE = "lemy"` trong `scripts/generate-audio.js`.

## 📝 Cập nhật env cho production (Cloudflare Pages)

Khi deploy lên Cloudflare Pages, cần set biến môi trường `FPT_AI_API_KEY`:

1. Vào Cloudflare Dashboard → Pages → project → Settings → Environment variables
2. Add variable: `FPT_AI_API_KEY` = (key thật)
3. Nhưng thực ra: **script generate chạy LOCAL, không cần key trên Cloudflare**. Sau khi generate xong, MP3 files đã có trong `public/audio/` → commit lên Git → Cloudflare serve static. Không cần env var trên production.

## 💡 Tips

- **Test trước 1 file**: Sửa script để chỉ generate 1 scene, check chất lượng. Nếu OK thì chạy full.
- **Backup API key**: Lưu key vào password manager (Bitwarden, 1Password). Không email cho ai.
- **Rate limit**: FPT.AI free tier cho phép ~20 requests/giây. Script em viết delay 1s/request, an toàn.
- **Đổi giọng sau**: Nếu muốn thử giọng khác, chỉ cần đổi `VOICE` trong script + xóa folder `public/audio/` + chạy lại.

---

## ❓ Câu hỏi thường gặp

**Q: Có mất phí không?**
A: Free tier 20,000 chars/tháng. Mình dùng ~3,500 chars → **0đ**.

**Q: Mất bao lâu để generate hết?**
A: 70 scenes × 1 giây delay = ~70 giây. Plus thời gian API response.

**Q: File MP3 lưu ở đâu?**
A: `public/audio/{lessonId}/{sceneIdx}.mp3` (git-tracked, deploy cùng app).

**Q: Sau khi generate, cần làm gì?**
A: `git add public/audio/ && git commit && git push` → Cloudflare tự rebuild.

**Q: Tôi không có FPT.AI account, làm sao?**
A: Em có thể dùng **Zalo AI TTS** (cũng free, tiếng Việt) làm backup. Hoặc giữ Web Speech API.

---

Nếu anh gặp vấn đề ở bước nào, cứ chụp ảnh màn hình gửi em, em fix tiếp nhé! 🐧
