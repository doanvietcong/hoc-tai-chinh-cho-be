# 🎙️ Hướng dẫn tích hợp Vbee TTS (giọng Việt native)

App hiện dùng **Web Speech API** (giọng mặc định trình duyệt) - chất lượng không ổn định, phụ thuộc máy. **Vbee** (VNG) cho **giọng Việt tự nhiên nhất** vì được ghi từ giọng đọc Việt Nam thật, model native hỗ trợ đầy đủ thanh điệu và ngữ điệu.

**Ưu điểm so với FPT.AI & ElevenLabs:**
- 🇻🇳 Giọng đọc Việt chuẩn 100% (không phải AI nước ngoài học tiếng Việt)
- 🎁 Free tier **~100,000 chars/tháng** (gấp 10 lần ElevenLabs, 5 lần FPT.AI)
- 🎭 Nhiều giọng miền Bắc/Nam, nam/nữ đa dạng
- ⚡ Tốc độ nhanh, ổn định

---

## 🆓 Bước 1: Tạo tài khoản Vbee (3 phút)

1. Truy cập **https://vbee.vn**
2. Click **"Đăng ký"** / **"Tạo tài khoản"**
3. Dùng email hoặc số điện thoại Việt Nam
4. Xác thực OTP → vào Dashboard

## 🔑 Bước 2: Lấy API Key (1 phút)

1. Trong Dashboard Vbee, vào **"API Keys"** hoặc **"Quản lý API"** (menu user góc phải)
2. Click **"Tạo API Key"** nếu chưa có
3. Copy key (thường bắt đầu bằng `VBEE...` hoặc UUID)

> ⚠️ **GIỮ BÍ MẬT** key. Lưu vào password manager.

## 🎤 Bước 3: Chọn voice code (30 giây)

Trong Dashboard Vbee, vào **"Giọng đọc"** / **"Voice Library"** để xem danh sách giọng có sẵn trong tài khoản của anh.

Một số voice code phổ biến (verify trong dashboard của anh - có thể khác tùy plan):

| Voice code | Tên | Giới tính | Vùng |
|------------|-----|-----------|------|
| `hn_female_ngochuyen_full_48k-fhg` | **Ngọc Huyền** | Nữ | Bắc — **MẶC ĐỊNH** |
| `hn_male_minhquang_full_48k-fhg` | Minh Quang | Nam | Bắc |
| `hcm_female_thuyduong_full_48k-fhg` | Thùy Dương | Nữ | Nam |
| `hcm_male_minhtriet_full_48k-fhg` | Minh Triết | Nam | Nam |

> Tip: dùng thử vài giọng xem cái nào hợp với Pé Ti nhất (nam trầm kể chuyện tốt, nữ dịu dàng ấm áp).

## 🛠️ Bước 4: Setup môi trường local (1 phút)

Tại thư mục project `D:\MiniMax\projects\pe-ti-finance`:

```powershell
# Copy file example
Copy-Item .env.local.example .env.local

# Mở file bằng Notepad
notepad .env.local
```

Paste API key vào dòng `VBEE_API_KEY=`:

```
VBEE_API_KEY=VBEE_your_actual_key_here
VBEE_VOICE_CODE=hn_female_ngochuyen_full_48k-fhg
VBEE_SPEED=1.0
```

**Save** (Ctrl+S) và đóng Notepad.

> File `.env.local` đã có trong `.gitignore` - an toàn không bị commit lên Git.

## 🎵 Bước 5: Generate audio (3-5 phút)

```powershell
npm run generate-audio
```

Script sẽ:
- Auto-detect Vbee từ `.env.local`
- Đọc 90 scenes từ `lib/stories.ts` (~8,700 chars)
- Gọi Vbee API cho mỗi scene
- Lưu MP3 vào `public/audio/{lessonId}/{sceneIdx}.mp3`
- Skip files đã có (idempotent - dùng `--force` để regen)

**Output mẫu:**
```
🎙️  Pé Ti TTS Audio Generator

   Provider: VBEE
   Voice: hn_female_ngochuyen_full_48k-fhg (speed: 1)
   Found 90 scenes in stories.ts

   Tổng ký tự: 8669 (8.7% free tier Vbee)

   ✓ [1/90] saving-1/0.mp3 (32.5KB) "Hôm nay Pé Ti được mẹ cho..."
   ✓ [2/90] saving-1/1.mp3 (38.1KB) "Mỗi ngày Pé Ti bỏ vào..."
   ...

📊 Kết quả:
   ✓ Tạo mới: 90
   ⏭  Skip (đã có): 0
   ✗ Lỗi: 0
   📁 Tổng dung lượng: 3.2 MB
```

> 🎁 **Vbee free tier: ~100,000 chars/tháng** - chúng ta dùng chỉ ~8,700 chars = 8.7%. Còn dư cho 10 lần generate thêm!

## 🚀 Bước 6: Commit + Push (1 phút)

```powershell
git add public/audio/
git commit -m "feat: Vbee Vietnamese TTS audio"
git push origin main
```

Sau ~30 giây Cloudflare rebuild xong → audio tự động live trên production!

## 🔧 Khi nào cần generate lại?

- Thêm **story mới** vào `lib/stories.ts` → chạy lại `npm run generate-audio` (skip file cũ, tạo file mới)
- Muốn **đổi giọng** → sửa `VBEE_VOICE_CODE` trong `.env.local`, xóa folder `public/audio/` cũ, chạy lại với `--force`:
  ```powershell
  Remove-Item -Recurse -Force public/audio
  npm run generate-audio -- --force
  ```

## 🛠️ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách fix |
|------|-------------|----------|
| `401 Unauthorized` / `403 Forbidden` | API key sai/thiếu | Check lại key trong `.env.local` |
| `Voice not found` | Voice code sai | Verify trong Dashboard Vbee |
| `Quota exceeded` | Hết free tier tháng | Đợi sang tháng sau hoặc nâng cấp plan |
| `Response timeout` | Vbee server bận | Chạy lại (script skip file đã tạo) |
| MP3 không phát trên web | File chưa serve | Hard refresh browser (Ctrl+Shift+R) hoặc incognito |

## 🎛️ Tùy chỉnh nâng cao

### Thay đổi tốc độ

Trong `.env.local`:
```
VBEE_SPEED=0.8   # chậm hơn (dễ nghe cho trẻ nhỏ)
VBEE_SPEED=1.0   # bình thường ← MẶC ĐỊNH
VBEE_SPEED=1.2   # nhanh hơn
```

### Test 1 file trước

Sửa tạm script để chỉ chạy 1 scene, check chất lượng trước khi generate full 90.

## ❓ FAQ

**Q: Vbee có thực sự miễn phí không?**
A: Free tier ~100K chars/tháng. Đủ cho project này + 10 lần generate lại. Plan trả phí từ ~100K VND/tháng nếu cần nhiều hơn.

**Q: Vbee vs ElevenLabs: chọn cái nào?**
A: **Vbee** nếu muốn giọng Việt chuẩn 100% và free tier cao. **ElevenLabs** nếu muốn giọng AI đa ngôn ngữ mượt hơn (nhưng giọng Việt vẫn "AI" chứ không tự nhiên bằng Vbee).

**Q: Tại sao không dùng FPT.AI?**
A: FPT.AI giọng tốt, free 20K chars. Nhưng Vbee:
- Free tier cao hơn (5x)
- Giọng đa dạng hơn (nhiều lựa chọn nam/nữ/Bắc/Nam)
- Native tiếng Việt (FPT.AI cũng tốt nhưng Vbee chuyên TV hơn)

**Q: Tôi đã có key FPT.AI/ElevenLabs, dùng được không?**
A: Có! Set key đó trong `.env.local`, set `TTS_PROVIDER=fpt` hoặc `=elevenlabs` để ép dùng. Script hỗ trợ cả 3.

**Q: Nếu API Vbee thay đổi format?**
A: Check docs tại https://vbee.vn. Script em viết theo API v1, nếu họ update thì sửa lại function `callVbeeTts` trong `scripts/generate-audio.js`.

---

Nếu gặp vấn đề, chụp ảnh lỗi gửi em fix nhé! 🐧
