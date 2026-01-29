# วิธี Deploy บน Cloudflare Pages

## ขั้นตอนที่ 1: เตรียม Git Repository

1. สร้าง Git repository ในโฟลเดอร์โปรเจกต์:
```powershell
cd C:\Users\weerawat.m\.gemini\antigravity\scratch\rewards-app
git init
git add .
git commit -m "Initial commit: SMART Rewards Application"
```

2. สร้าง repository บน GitHub:
   - ไปที่ https://github.com/new
   - ตั้งชื่อ repository เช่น `smart-rewards-app`
   - เลือก Public หรือ Private
   - **อย่า** เลือก "Initialize with README"
   - คลิก "Create repository"

3. เชื่อมต่อกับ GitHub:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/smart-rewards-app.git
git branch -M main
git push -u origin main
```

## ขั้นตอนที่ 2: Deploy บน Cloudflare Pages

### วิธีที่ 1: ผ่าน Git Integration (แนะนำ)

1. ไปที่ [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. เลือก **Pages** จากเมนูด้านซ้าย
3. คลิก **Create a project**
4. เลือก **Connect to Git**
5. เลือก **GitHub** และอนุญาตให้ Cloudflare เข้าถึง repository
6. เลือก repository `smart-rewards-app`
7. ตั้งค่า Build settings:
   - **Project name**: `smart-rewards-app` (หรือชื่อที่ต้องการ)
   - **Production branch**: `main`
   - **Build command**: *(เว้นว่าง - ไม่ต้องใส่)*
   - **Build output directory**: `/` (root directory)
8. คลิก **Save and Deploy**

### วิธีที่ 2: Direct Upload (ง่ายกว่า แต่ต้อง upload ใหม่ทุกครั้งที่แก้ไข)

1. ไปที่ [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. เลือก **Pages** จากเมนูด้านซ้าย
3. คลิก **Create a project**
4. เลือก **Direct Upload**
5. ตั้งชื่อโปรเจกต์ เช่น `smart-rewards-app`
6. ลากไฟล์ทั้งหมดในโฟลเดอร์ `rewards-app` มาวางในพื้นที่ upload:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
7. คลิก **Deploy site**

## ขั้นตอนที่ 3: ตรวจสอบและใช้งาน

1. รอ Cloudflare build และ deploy (ประมาณ 1-2 นาที)
2. เมื่อเสร็จแล้ว จะได้ URL เช่น:
   - `https://smart-rewards-app.pages.dev`
   - หรือ `https://YOUR_PROJECT_NAME.pages.dev`
3. เปิด URL ในเบราว์เซอร์เพื่อทดสอบ

## Custom Domain (ถ้าต้องการ)

1. ใน Cloudflare Pages dashboard
2. ไปที่แท็บ **Custom domains**
3. คลิก **Set up a custom domain**
4. ใส่ domain ของคุณ เช่น `rewards.yourdomain.com`
5. ทำตาม DNS configuration ที่แสดง

## การอัปเดตแอปพลิเคชัน

### ถ้าใช้ Git Integration:
```powershell
# แก้ไขไฟล์
git add .
git commit -m "Update: description of changes"
git push
```
Cloudflare จะ auto-deploy ให้อัตโนมัติ

### ถ้าใช้ Direct Upload:
1. ไปที่ Cloudflare Pages dashboard
2. เลือกโปรเจกต์
3. คลิก **Create deployment**
4. Upload ไฟล์ใหม่

## ข้อดีของ Cloudflare Pages

✅ **ฟรี** - Unlimited bandwidth และ requests
✅ **เร็ว** - Global CDN
✅ **SSL/HTTPS** - ฟรีและติดตั้งอัตโนมัติ
✅ **Auto-deploy** - จาก Git (ถ้าใช้ Git Integration)
✅ **Preview deployments** - สำหรับ Pull Requests

## Troubleshooting

### ปัญหา: หน้าเว็บไม่แสดงผล
- ตรวจสอบว่า `index.html` อยู่ใน root directory
- ตรวจสอบ Console ในเบราว์เซอร์ (F12)

### ปัญหา: CSS/JS ไม่ทำงาน
- ตรวจสอบว่าไฟล์ `styles.css` และ `app.js` ถูก upload ด้วย
- ตรวจสอบ path ในไฟล์ `index.html`

### ปัญหา: Local Storage ไม่ทำงาน
- ตรวจสอบว่าเปิดผ่าน HTTPS (Cloudflare ให้ HTTPS อัตโนมัติ)
- ตรวจสอบ Browser settings สำหรับ cookies/storage

## สนับสนุน

หากมีปัญหาในการ deploy สามารถดู:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
