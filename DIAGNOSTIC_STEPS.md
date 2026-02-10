# خطوات التشخيص - دليل سريع

## 🔧 ما تم إنجازه:

### 1. ✅ إضافة Enhanced Logging
تم إضافة logging مفصل في `AttendancePreMarkingService.cs`:
- `[PRE-MARK]` prefix لسهولة البحث
- Emojis للوضوح (✅ نجاح، ⚠️ تحذير، etc.)
- معلومات مفصلة عن كل خطوة

### 2. ✅ التأكد من AttendanceSettings
```json
{
  "AllowEarlyScan": true,
  "EarlyScanMinutes": 30,
  "PreMarkingIntervalMinutes": 2,
  "OnTimeGraceMinutes": 15
}
```

### 3. ✅ إنشاء SQL Queries تشخيصية
في ملف: [`diagnostic_queries.sql`](file:///C:/Users/ZALL/Desktop/araby/diagnostic_queries.sql)

---

## 📋 خطوات التنفيذ (يُرجى اتباعها):

### الخطوة 1: إعادة بناء وتشغيل Server 🔄

في نفس Terminal الموجود:

```bash
# إيقاف Server الحالي (إذا كان يعمل)
Ctrl+C

# الانتقال للمجلد
cd C:\Users\ZALL\Desktop\araby\araby\araby

# إعادة البناء
dotnet build

# تشغيل Server
dotnet run
```

**انتظر**: يجب أن ترى رسالة `"Attendance Pre-Marking Service starting..."`

---

### الخطوة 2: مراقبة Logs (بعد دقيقتين) 👀

افتح terminal جديد وشغّل:

```powershell
# افحص آخر 50 سطر من الـ console output
# أو إذا كان هناك log files:
Get-ChildItem "C:\Users\ZALL\Desktop\araby\araby\araby\bin\Debug\net9.0\logs" -Recurse -ErrorAction SilentlyContinue

# أو راقب console output مباشرة
```

**ابحث عن**:
- `[PRE-MARK] Starting check` ← Service يعمل ✅
- `[PRE-MARK] Found X total sessions` ← Sessions موجودة
- `[PRE-MARK] ✅ Session X will be processed` ← Session ستُعالج
- `[PRE-MARK] 📝 Session X: Found Y enrolled students` ← Enrollment موجود
- `[PRE-MARK] ⚠️ Session X has NO enrolled students!` ← **هذه هي المشكلة!**

---

### الخطوة 3: تشغيل SQL Queries 💾

افتح SQL Server Management Studio أو أي SQL client وشغّل Queries من:
[`diagnostic_queries.sql`](file:///C:/Users/ZALL/Desktop/araby/diagnostic_queries.sql)

#### Query 1: فحص Session & Enrollment
```sql
SELECT 
    s.Id,
    s.Title,
    s.IsRecurring,
    -- ... (كامل Query من الملف)
FROM Sessions s
WHERE s.Title LIKE '%جماعي%'
```

**النتيجة المتوقعة**:
| Id | Title | IndividualStudentCount | GroupStudentCount | TotalEnrolled |
|----|-------|------------------------|-------------------|---------------|
| 1  | جماعي | 5 | 0 | 5 ✅ |

**لو TotalEnrolled = 0**: ❌ **هذه المشكلة!**

#### Query 2: فحص Attendance Records
```sql
DECLARE @SessionId INT = 1; -- استبدل بـ ID من Query 1
-- ... (كامل Query من الملف)
```

**النتيجة المتوقعة**:
| StudentId | FullName | Status | AttendanceStatus |
|-----------|----------|--------|------------------|
| abc | dsafsdfasd | Present | Exists ✅ |
| def | Student B | Absent | Exists ✅ |
| ghi | Student C | Absent | Exists ✅ |

**النتيجة الحالية (المشكلة)**:
| StudentId | FullName | Status | AttendanceStatus |
|-----------|----------|--------|------------------|
| abc | dsafsdfasd | Present | Exists ✅ |
| def | Student B | NULL | Missing ❌ |

---

## 🎯 السيناريوهات المحتملة:

### السيناريو أ: لا يوجد طلاب مسجلين

**الأعراض**:
- Log: `[PRE-MARK] ⚠️ Session X has NO enrolled students!`
- Query 1: `TotalEnrolled = 0`

**الحل**:
يجب إضافة الطلاب للحصة من Frontend:
1. اذهب لصفحة Sessions
2. عدّل حصة "جماعي"
3. أضف طلاب (Individual أو Groups)
4. احفظ

---

### السيناريو ب: Service لم يبدأ

**الأعراض**:
- لا يوجد logs بـ `[PRE-MARK]`
- Server console لا يُظهر "Attendance Pre-Marking Service starting..."

**الأسباب المحتملة**:
1. Exception في constructor
2. AttendanceSettings مفقود (لكن فحصناه - موجود ✅)
3. Build error

**الحل**:
- راجع build errors
- تأكد من restart Server

---

### السيناريو ج: RecurringPattern خطأ

**الأعراض**:
- Log: `[PRE-MARK] ⏭️ Session X skipped`
- Query 3: `RecurringPattern` = NULL أو غير صحيح

**الحل**:
```sql
UPDATE Sessions
SET RecurringPattern = '{"DaysOfWeek":[1],"EndDate":null}'
WHERE Id = <SessionId> AND IsRecurring = 1
```

---

## 📊 التقرير النهائي

بعد تنفيذ الخطوات أعلاه، يُرجى إرسال:

1. **Console Output**: أول 100 سطر من logs
2. **Query 1 Result**: Screenshot أو نص
3. **Query 2 Result**: Screenshot أو نص

سأحدد المشكلة بالضبط وأقدم الحل!

---

## ⚡ إتمام سريع

إذا كنت تريد إصلاح سريع دون انتظار:

```bash
# في Terminal
cd C:\Users\ZALL\Desktop\araby\araby\araby
dotnet build
dotnet run
```

بعد دقيقتين، السيرفر سيحاول pre-marking وستظهر logs واضحة توضح المشكلة!
