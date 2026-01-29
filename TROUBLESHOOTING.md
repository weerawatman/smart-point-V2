# 🔧 แก้ไข Build Error บน Cloudflare Pages

## ปัญหา
Cloudflare พยายามรัน `npx wrangler deploy` ซึ่งไม่ถูกต้องสำหรับ static site

## วิธีแก้ไข

### ใน Cloudflare Pages Dashboard:

1. ไปที่โปรเจกต์ของคุณ
2. คลิกแท็บ **Settings**
3. เลื่อนลงไปที่ **Build & deployments**
4. คลิก **Edit configuration**

### แก้ไข Build settings เป็น:

```
Framework preset: None
Build command: (เว้นว่าง - ลบทิ้ง)
Build output directory: /
Root directory: (เว้นว่าง)
```

5. คลิก **Save**
6. กลับไปที่แท็บ **Deployments**
7. คลิก **Retry deployment** หรือ **Create new deployment**

---

## หรือ: สร้างไฟล์ Config (วิธีที่ดีกว่า)

สร้างไฟล์ `wrangler.toml` ในโปรเจกต์:

```toml
name = "smart-rewards"
compatibility_date = "2026-01-29"

[assets]
directory = "."
```

จากนั้น push ขึ้น GitHub:

```powershell
cd C:\Users\weerawat.m\.gemini\antigravity\scratch\rewards-app
# สร้างไฟล์ wrangler.toml ตามด้านบน
git add wrangler.toml
git commit -m "Add wrangler.toml for Cloudflare Pages"
git push
```

Cloudflare จะ auto-deploy ใหม่อัตโนมัติ!

---

## ตรวจสอบว่า Deploy สำเร็จ

เมื่อ deploy สำเร็จ จะเห็น:
- ✅ Status: Success
- 🌐 URL: `https://your-project.pages.dev`

---

**หากยังมีปัญหา ให้ลองวิธีแรก (แก้ไข Build settings ใน Dashboard) ครับ**
