# 🔐 Test Accounts - Backend Database Seeder

## حسابات التجربة (Test Accounts)

### 👨‍🏫 المعلم (Teacher - Role 1)
```
Username: teacher
Password: Teacher@123
Email: teacher@ghazali.com
Full Name: 
```

### 👤 المساعد (Assistant - Role 2)
```
Username: assistant
Password: Assistant@123
Email: assistant@ghazali.com
Full Name: المساعد أحمد علي
```

### 👨‍🎓 الطلاب (Students - Role 3)

**Student 1:**
```
Username: student1
Password: Student@123
Email: student1@ghazali.com
Full Name: الطالب خالد محمود
```

**Student 2:**
```
Username: student2
Password: Student@123
Email: student2@ghazali.com
Full Name: الطالبة فاطمة أحمد
```

**Student 3:**
```
Username: student3
Password: Student@123
Email: student3@ghazali.com
Full Name: الطالب عمر حسن
```

---

## 📊 البيانات الإضافية (Additional Data)

### Fee Types (أنواع الرسوم)
1. رسوم شهرية - 500 جنيه
2. رسوم الكتب - 150 جنيه
3. رسوم الامتحانات - 100 جنيه

### Student Groups (مجموعات الطلاب)
1. المجموعة الأولى - الصف الثالث الثانوي
2. المجموعة الثانية - الصف الأول الثانوي

### Sessions (الحصص)
1. النحو - الجملة الاسمية
2. البلاغة - التشبيه

---

## 🚀 كيفية الاستخدام

### 1. تشغيل الـ Backend
```bash
cd C:\Users\ZALL\Desktop\araby\araby\araby
dotnet run
```

### 2. البيانات ستُضاف تلقائياً
عند تشغيل التطبيق لأول مرة، سيتم:
- ✅ تطبيق Migrations
- ✅ إضافة البيانات التجريبية
- ✅ طباعة الحسابات في Console

### 3. اختبار تسجيل الدخول
استخدم أي من الحسابات أعلاه في صفحة Login

---

## 📁 الملفات المُنشأة

### 1. DbSeeder.cs
**المسار:** `araby/Data/DbSeeder.cs`

**الوظيفة:**
- إنشاء حسابات المستخدمين
- إضافة أنواع الرسوم
- إضافة المجموعات
- إضافة الحصص

### 2. Program.cs (محدّث)
**التحديث:**
- إضافة استدعاء `DbSeeder.SeedDataAsync()`
- تطبيق Migrations تلقائياً
- معالجة الأخطاء

---

## ⚠️ ملاحظات مهمة

### إعادة تعيين قاعدة البيانات
إذا أردت إعادة إضافة البيانات:

**Option 1: حذف قاعدة البيانات**
```bash
dotnet ef database drop
dotnet run
```

**Option 2: حذف جميع البيانات**
```sql
DELETE FROM Users;
DELETE FROM FeeTypes;
DELETE FROM StudentGroups;
DELETE FROM Sessions;
```

### تغيير كلمات المرور
يمكنك تعديل كلمات المرور في ملف `DbSeeder.cs`:
```csharp
await userManager.CreateAsync(teacher, "YourNewPassword");
```

---

## 🔍 التحقق من البيانات

### في SQL Server Management Studio
```sql
-- عرض جميع المستخدمين
SELECT Id, UserName, FullName, Role, Email 
FROM AspNetUsers;

-- عرض أنواع الرسوم
SELECT * FROM FeeTypes;

-- عرض المجموعات
SELECT * FROM StudentGroups;

-- عرض الحصص
SELECT * FROM Sessions;
```

---

## ✅ جاهز للاختبار!

الآن يمكنك:
1. ✅ تشغيل الـ Backend
2. ✅ تسجيل الدخول بأي حساب
3. ✅ اختبار جميع الأدوار (Teacher, Assistant, Student)
4. ✅ اختبار الـ API endpoints

**البيانات جاهزة للاستخدام!** 🎉
