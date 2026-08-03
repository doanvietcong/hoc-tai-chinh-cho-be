# 🎙️ Hướng dẫn tích hợp ElevenLabs V3 TTS (giọng Việt tự nhiên + audio tags)

App hiện dùng **Web Speech API** (giọng mặc định trình duyệt) - chất lượng không ổn định, phụ thuộc máy. **ElevenLabs V3** cho **giọng tự nhiên nhất hiện nay**, hỗ trợ **audio tags** để kể chuyện sinh động (vui vẻ, thì thầm, cười...).

---

## 🚀 V3 có gì hay?

ElevenLabs V3 (2025) là model mới nhất:
- ✅ **Expressive hơn V2** - giọng có cảm xúc tự nhiên (kể chuyện cho trẻ cực hợp)
- ✅ **Hỗ trợ audio tags** - chèn trực tiếp vào text để tạo biểu cảm: `[excited]`, `[whispers]`, `[laughs]`, `[sighs]`, `[happy]`, `[cheerful]`, `[curious]`, `[sad]`, `[angry]`
- ✅ **Tiếng Việt tốt hơn** - phát âm tự nhiên, không bị "đọc máy"
- ⚠️ **Tính credit gấp đôi V2** - 1 char V3 = ~2 chars V2. Free tier 10K chars/tháng = thực tế ~5K chars cho V3.

**Ví dụ audio tags trong text:**
```
Hôm nay [excited] Pé Ti sẽ kể cho bạn nghe về tiền nhé! [whispers] Bí mật lắm đó...
Mua kẹo thì vui [laughs] nhưng để dành mua đồ chơi thì còn vui hơn nữa!
```

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

> ⚠️ **GIỮ BÍ MẬT** key. Lưu vào password manager (Bitwarden, 1Password, ...). **Không paste key lên chat/email**.

## 🛠️ Bước 3: Setup môi trường local (1 phút)

Tại thư mục project `D:\MiniMax\projects\pe-ti-finance`:

```powershell
# Copy file example
Copy-Item .env.local.example .env.local

# Mở file bằng Notepad
notepad .env.local
```

Paste API key vào dòng `ELEVENLABS_API_KEY=` (sau dấu `=`). Mặc định đã dùng V3, không cần đổi gì thêm:

```
ELEVENLABS_API_KEY=sk_your_actual_key_here
ELEVENLABS_VOICE_ID=
ELEVENLABS_MODEL_ID=
```

**Save** (Ctrl+S) và đóng Notepad.

> File `.env.local` đã có trong `.gitignore` - an toàn không bị commit.

## 🎤 Bước 4: Chọn giọng (optional - mặc định "Adam")

Default script dùng **Adam** (`pNInz6obpgDQGcFmaJgB`) - nam trầm, kể chuyện tốt. V3 hỗ trợ audio tags tốt với mọi voice.

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

Xem thêm giọng tại: https://elevenlabs.io/voice-library (filter "Multilingual")

## 🎵 Bước 5: Generate audio (3-5 phút)

```powershell
npm run generate-audio
```

Script sẽ:
- Auto-detect provider từ `.env.local` (ElevenLabs nếu có key)
- Đọc 90 scenes từ `lib/stories.ts`
- Gọi ElevenLabs **V3 API** cho mỗi scene
- Lưu MP3 vào `public/audio/{lessonId}/{sceneIdx}.mp3`
- Skip files đã có (idempotent - dùng `--force` để regen)

**Output mẫu:**
```
🎙️  Pé Ti TTS Audio Generator

   Provider: ELEVENLABS
   Voice: pNInz6obpgDQGcFmaJgB (model: eleven_v3)
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

> 🎁 **ElevenLabs free tier: 10,000 chars/tháng** - chúng ta dùng ~8,700 chars V3 = ~17,400 effective. Có thể vượt quota, nếu fail thì chạy lại script sẽ skip file đã tạo.

## 🚀 Bước 6: Commit + Push (1 phút)

```powershell
git add public/audio/
git commit -m "feat: ElevenLabs V3 Vietnamese TTS audio"
git push origin main
```

Sau ~30 giây Cloudflare rebuild xong → audio tự động live trên production!

## 🔧 Khi nào cần generate lại?

- Thêm **story mới** vào `lib/stories.ts` → chạy lại `npm run generate-audio` (skip file cũ, tạo file mới)
- Muốn **đổi giọng** hoặc **đổi model** → sửa `.env.local`, xóa folder `public/audio/` cũ, chạy lại với `--force`:
  ```powershell
  Remove-Item -Recurse -Force public/audio
  npm run generate-audio -- --force
  ```

## 🛠️ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách fix |
|------|-------------|----------|
| `401 Unauthorized` | API key sai/thiếu | Check lại key trong `.env.local` |
| `403 Payment Required` | Hết free tier V3 (V3 tốn credit gấp đôi) | Đợi sang tháng hoặc nâng cấp plan ($5/tháng = 30K chars) |
| `429 Too Many Requests` | Gọi quá nhanh | Script delay 1.1s, nếu vẫn lỗi thì đợi 1 phút rồi chạy lại (skip file cũ) |
| `Invalid voice_id` | Voice ID sai format | Lấy lại ID chính xác từ voice library |
| `model_not_found` | V3 chưa available cho tài khoản | Đổi sang `eleven_multilingual_v2` trong `ELEVENLABS_MODEL_ID=` |
| MP3 không phát | File chưa serve | Restart `npm run dev`, hard refresh browser (Ctrl+Shift+R) |

## 🎛️ Tùy chỉnh nâng cao

### Đổi model

Trong `.env.local`:
```
ELEVENLABS_MODEL_ID=eleven_turbo_v3      # nhanh hơn, ít expressive
ELEVENLABS_MODEL_ID=eleven_v3            # chuẩn, expressive nhất (MẶC ĐỊNH)
ELEVENLABS_MODEL_ID=eleven_multilingual_v2  # V2 fallback
```

### Voice settings (đã tune sẵn cho V3)

Trong `scripts/generate-audio.js`, function `callElevenLabs`:

**V3 (mặc định):**
```js
voice_settings: {
  stability: 0.3,        // V3: thấp = expressive hơn
  similarity_boost: 0.75, // giữ giọng gốc
  style: 0.4,             // V3: thêm phong cách
  use_speaker_boost: true, // tăng cường clarity
  speed: 0.95,            // V3: chậm hơn một chút cho dễ nghe
}
```

**V2 (fallback):**
```js
voice_settings: {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
}
```

### Audio tags (V3 only)

Chèn trực tiếp vào text trong `lib/stories.ts`:

| Tag | Hiệu ứng |
|-----|----------|
| `[excited]` | Hào hứng, năng lượng cao |
| `[whispers]` | Thì thầm, bí ẩn |
| `[laughs]` | Cười |
| `[sighs]` | Thở dài |
| `[happy]` | Vui vẻ |
| `[cheerful]` | Tươi vui |
| `[curious]` | Tò mò |
| `[sad]` | Buồn |
| `[angry]` | Giận |

**Ví dụ thêm vào story:**
```typescript
{
  text: "Hôm nay [excited] Pé Ti sẽ kể cho bạn nghe về tiền nhé! [whispers] Bí mật lắm đó...",
  visual: { prop: "coin", label: "Đồng xu" },
}
```

### Multi-provider

Script tự động detect. Nếu muốn ép dùng provider cụ thể, thêm vào `.env.local`:
```
TTS_PROVIDER=elevenlabs  # hoặc vbee, fpt
```

## ❓ FAQ

**Q: ElevenLabs V3 có free không?**
A: Free 10,000 chars/tháng, nhưng V3 tính credit gấp đôi → thực tế ~5,000 chars V3. Project dùng ~8,700 chars, có thể vượt quota 1 chút. Script sẽ skip file đã tạo nên chạy lại nhiều lần OK.

**Q: Tại sao chọn V3 thay vì V2?**
A: V3 giọng tự nhiên hơn nhiều, có cảm xúc (hào hứng, vui, buồn...) - rất hợp kể chuyện cho trẻ em. V2 hơi "đọc máy".

**Q: Nếu tài khoản hết quota V3?**
A: Set `ELEVENLABS_MODEL_ID=eleven_multilingual_v2` trong `.env.local` để fallback V2.

**Q: Mất bao lâu để generate?**
A: 90 scenes × 1.1s delay ≈ ~100 giây (~2 phút). Plus thời gian API response. Tổng ~3-5 phút.

**Q: Có thể dùng cả ElevenLabs + Vbee không?**
A: Có! Set cả 2 key trong `.env.local`. Auto-detect ưu tiên ElevenLabs.

**Q: Audio tags có hoạt động với voice của tôi không?**
A: Hầu hết voice trong library đều hỗ trợ V3 + audio tags. Nếu 1 voice nào đó không hoạt động, thử voice khác (Adam, Rachel, Domi đều OK).

---

Nếu gặp vấn đề, cứ chụp ảnh màn hình gửi em fix nhé! 🐧
