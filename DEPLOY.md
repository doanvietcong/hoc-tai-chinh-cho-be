# 🚀 Hướng dẫn Deploy lên Cloudflare Pages

Cloudflare Pages là dịch vụ hosting static miễn phí, hỗ trợ Next.js xuất static rất tốt. Pé Ti đã được config `output: "export"` nên build ra folder `out/` — Cloudflare sẽ deploy trực tiếp folder này.

## Bước 1: Tạo Cloudflare account (nếu chưa có)

- Vào https://dash.cloudflare.com/sign-up
- Đăng ký miễn phí (chỉ cần email)

## Bước 2: Kết nối GitHub

1. Vào https://dash.cloudflare.com → mục **Workers & Pages** (menu trái)
2. Click **Create application**
3. Chọn tab **Pages** → Click **Connect to Git**
4. Chọn **GitHub** → Authorize Cloudflare truy cập repo
5. Tìm và chọn repo `doanvietcong/hoc-tai-chinh-cho-be`
6. Click **Begin setup**

## Bước 3: Cấu hình Build

| Setting | Giá trị |
|---|---|
| **Project name** | `hoc-tai-chinh-cho-be` (mặc định sẽ tạo subdomain `hoc-tai-chinh-cho-be.pages.dev`) |
| **Production branch** | `main` |
| **Framework preset** | **Next.js** (nếu có) — hoặc chọn **None** rồi tự điền |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | (để trống) |
| **Environment variables** | (không cần) |

Click **Save and Deploy**.

## Bước 4: Đợi build (1-3 phút)

Cloudflare sẽ:
1. Clone repo
2. Chạy `npm install`
3. Chạy `npm run build` → tạo folder `out/`
4. Deploy `out/` lên edge network

Sau khi xong, bạn sẽ có URL:
- **Production:** `https://hoc-tai-chinh-cho-be.pages.dev`

## Bước 5: Custom domain (tùy chọn)

Nếu anh có domain riêng (vd `hoc-taichinh.vn`):

1. Vào project trong Cloudflare Pages
2. Tab **Custom domains** → **Set up a custom domain**
3. Nhập domain → Cloudflare tự động thêm DNS records
4. SSL tự động được cấp (Let's Encrypt)

## Bước 6: Tự động deploy khi push code

Mỗi lần anh push code mới lên GitHub (branch `main`), Cloudflare sẽ tự động:
1. Detect commit mới
2. Build & deploy
3. Tạo preview URL cho mỗi commit (vd `abc123.hoc-tai-chinh-cho-be.pages.dev`)

**Preview deployments** rất hữu ích: mỗi branch / PR có URL riêng để test trước khi merge vào main.

## Cách kiểm tra build thành công

Sau khi deploy, mở URL `hoc-tai-chinh-cho-be.pages.dev`:
- ✅ Landing page với Pé Ti waving
- ✅ Onboarding flow chọn tên + tuổi
- ✅ Home dashboard với level map zig-zag
- ✅ 9 bài học, mỗi bài 3-5 câu hỏi
- ✅ Mascot Pé Ti có animation

## Troubleshooting

### Lỗi "Build failed"
- Check tab **Build logs** trong Cloudflare Pages
- Thường là do thiếu env var hoặc build command sai
- Đảm bảo `package.json` có script `build: next build`

### Lỗi 404 khi vào `/lesson/money-1`
- Đảm bảo `next.config.ts` có `output: "export"` 
- Trong Cloudflare Pages, **Build output directory = `out`** (không phải `.next`)

### Site load nhưng trắng
- Mở DevTools → Console → xem lỗi
- Thường do font Be Vietnam Pro không load — Cloudflare có thể bị block Google Fonts. Fix: dùng `next/font/local` thay vì `next/font/google`.

## Chi phí

- **Free tier:** Unlimited requests, 500 builds/tháng, 100GB bandwidth
- Cho 1 app như Pé Ti thì FREE dùng thoải mái

## Tóm tắt

✅ **GitHub:** https://github.com/doanvietcong/hoc-tai-chinh-cho-be
✅ **Cloudflare Pages:** sẽ là https://hoc-tai-chinh-cho-be.pages.dev (sau khi deploy)
✅ **Auto-deploy:** push GitHub → Cloudflare tự build & deploy
✅ **Free:** không tốn xu nào
