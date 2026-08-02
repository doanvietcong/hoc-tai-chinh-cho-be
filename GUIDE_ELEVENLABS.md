# 🎙️ Hướng dẫn tích hợp ElevenLabs TTS (giọng Việt tự nhiên)

App hiện dùng **Web Speech API** (giọng mặc định trình duyệt) - chất lượng không ổn định, phụ thuộc máy. **ElevenLabs** cho **giọng tự nhiên nhất hiện nay** (dùng model `eleven_multilingual_v2`), mọi thiết bị nghe giống nhau.

---

## 🆓 Bước 1: Tạo tài khoản ElevenLabs (3 phút)

1. Truy cập **https://elevenlabs.io** 
2. Click **"Sign Up"** → đăng ký bằng Google/email
3. Verify email → vào Dashboard

## 🔑 Bước 2: Lấy API Key (1 phút)

1. Click avatar góc phải → **"Profile Settings"** (hoặc **"Settings"**)
2. Tab **"API Keys"** 
3. Click **"Create API Key"** → đặt tên (vd: "Pé Ti finance") → **Copy** key
4. Key có dạng: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (32 ký tự)

> ⚠️ **GIỮ BÍ MẬT** key. Lưu vào password manager (Bitwarden, 1Password, ...).

## 🛠️ Bước 3: Setup môi trường local (1 phút)

Tại thư mục project `D:\MiniMax\projects\pe-ti-finance`:

```powershell
# Copy file example
Copy-Item .env.local.example .env.local

# Mở file bằng Notepad
notepad .env.local
```

Paste API key vào dòng `ELEVENLABS_API_KEY=` (sau dấu `=`):

```
ELEVENLABS_API_KEY=sk_your_actual_key_here
ELEVENLABS_VOICE_ID=
```

**Save** (Ctrl+S) và đóng Notepad.

> File `.env.local` đã có trong `.gitignore` - an toàn không bị commit.

## 🎤 Bước 4: Chọn giọng (optional - mặc định "Adam")

Default script dùng **Adam** (`pNInz6obpgDQGcFmaJgB`) - nam trầm, kể chuyện tốt.

**Gợi ý giọng phù hợp với Pé Ti (kể chuyện cho trẻ em):**

| Voice ID | Tên | Giới tính | Phong cách |
|----------|-----|-----------|------------|
| `pNInz6obpgDQGcFmaJgB` | **Adam** | Nam | Trầm, kể chuyện tốt — **MẶC ĐỊNH** |
| `2EiwWnXFnvU5JinP4o6y` | **Sam** | Nam | Adventure, hào hứng |
| `gU0LNdkMOjJABWrEB4h3` | **Charlie** | Nam | Năng động, vui nhộn |
| `21m00Tcm4TlvDq8ikWAM` | **Rachel** | Nữ | Dịu dàng, ấm áp |
| `AZnzlk1XvdvUeBnXmlld` | **Domi** | Nữ | Trẻ trung, vui tươi |
| `EXAVITQu4vr4xnSDxMaL` | **Bella** | Nữ | Mềm mại, dễ thương |

Đổi giọng → sửa dòng `ELEVENLABS_VOICE_ID=` trong `.env.local` (paste voice ID).

Xem thêm giọng tại: https://elevenlabs.io/voice-library (filter "Multilingual v2")

## 🎵 Bước 5: Generate audio (3-5 phút)

```powershell
npm run generate-audio
```

Script sẽ:
- Auto-detect provider từ `.env.local` (ElevenLabs nếu có key)
- Đọc 90 scenes từ `lib/stories.ts`
- Gọi ElevenLabs API cho mỗi scene
- Lưu MP3 vào `public/audio/{lessonId}/{sceneIdx}.mp3`
- Skip files đã có (idempotent - dùng `--force` để regen)

**Output mẫu:**
```
🎙️  Pé Ti TTS Audio Generator

   Provider: ELEVENLABS
   Voice: pNInz6obpgDQGcFmaJgB (model: eleven_multilingual_v2)
   Found 90 scenes in stories.ts

   Tổng ký tự: 8669 (86.7% free tier ElevenLabs)

   ✓ [1/90] saving-1/0.mp3 (45.2KB) "Hôm nay Pé Ti được mẹ cho..."
   ✓ [2/90] saving-1/1.mp3 (52.1KB) "Mỗi ngày Pé Ti bỏ vào..."
   ...

📊 Kết quả:
   ✓ Tạo mới: 90
   ⏭  Skip (đã có): 0
   ✗ Lỗi: 0
   📁 Tổng dung lượng: 4.21 MB
```

> 🎁 **ElevenLabs free tier: 10,000 chars/tháng** - chúng ta dùng ~8,700 chars = 86.7%. Còn dư cho 1 lần generate thêm.

## 🚀 Bước 6: Commit + Push (1 phút)

```powershell
git add public/audio/
git commit -m "feat: ElevenLabs Vietnamese TTS audio"
git push origin main
```

Sau ~30 giây Cloudflare rebuild xong → audio tự động live trên production!

## 🔧 Khi nào cần generate lại?

- Thêm **story mới** vào `lib/stories.ts` → chạy lại `npm run generate-audio` (skip file cũ, tạo file mới)
- Muốn **đổi giọng** → sửa `ELEVENLABS_VOICE_ID` trong `.env.local`, xóa folder `public/audio/` cũ, chạy lại với `--force`:
  ```powershell
  Remove-Item -Recurse -Force public/audio
  npm run generate-audio -- --force
  ```

## 🛠️ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách fix |
|------|-------------|----------|
| `401 Unauthorized` | API key sai/thiếu | Check lại key trong `.env.local` |
| `429 Too Many Requests` | Gọi quá nhanh | Script delay 1.1s, nếu vẫn lỗi thì đợi 1 phút rồi chạy lại (skip file cũ) |
| `Quota exceeded` | Hết free tier tháng | Đợi sang tháng sau hoặc nâng cấp plan (từ $5/tháng) |
| `Invalid voice_id` | Voice ID sai format | Lấy lại ID chính xác từ voice library |
| MP3 không phát | File chưa serve | Restart `npm run dev`, hard refresh browser |

## 🎛️ Tùy chỉnh nâng cao

### Thay đổi cách đọc

Trong `scripts/generate-audio.js`, function `callElevenLabs`:

```js
voice_settings: {
  stability: 0.5,        // 0-1: càng cao càng ổn định, càng thấp càng biểu cảm
  similarity_boost: 0.75, // 0-1: giữ giọng gốc
  style: 0.0,             // 0-1: thêm phong cách (chỉ một số voice hỗ trợ)
  use_speaker_boost: true, // tăng cường clarity
}
```

Gợi ý cho giọng trẻ em:
- `stability: 0.3` - biểu cảm hơn, tự nhiên hơn
- `style: 0.2` - thêm chút hào hứng (nếu voice hỗ trợ)

### Multi-provider

Script tự động detect. Nếu muốn ép dùng provider cụ thể, thêm vào `.env.local`:
```
TTS_PROVIDER=elevenlabs  # hoặc fpt
```

## ❓ FAQ

**Q: ElevenLabs có free không?**
A: Free 10,000 chars/tháng. Mình dùng 8,700 → **0đ**. Nếu vượt, plan từ $5/tháng (30K chars).

**Q: Tại sao chọn ElevenLabs thay vì FPT.AI?**
A: ElevenLabs giọng tự nhiên hơn nhiều (AI model tiên tiến). FPT.AI chuẩn hơn về phát âm nhưng hơi "robotic". Tùy preference.

**Q: Mất bao lâu để generate?**
A: 90 scenes × 1.1s delay ≈ ~100 giây (~2 phút). Plus thời gian API response.

**Q: Có thể dùng cả ElevenLabs + FPT.AI không?**
A: Có! Set cả 2 key trong `.env.local`. Auto-detect ưu tiên ElevenLabs. Muốn force FPT.AI thì `TTS_PROVIDER=fpt`.

**Q: Nếu tôi muốn đổi giọng sau?**
A: Chỉ cần sửa `ELEVENLABS_VOICE_ID` trong `.env.local`, xóa `public/audio/`, chạy lại với `--force`.

---

Nếu gặp vấn đề, cứ chụp ảnh màn hình gửi em fix nhé! 🐧
