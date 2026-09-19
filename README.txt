پروژه لیست کارهای روزمره + Supabase — نسخه نهایی

ویژگی مهم این نسخه:
- هنگام افزودن کار، کاربر دیگر تاریخ یا ساعت انتخاب نمی‌کند.
- تاریخ و ساعت دقیق همان لحظه‌ای که روی «ذخیره» کلیک می‌شود، خودکار در registered_at ذخیره می‌شود.
- تاریخ ثبت در کارت کار به تقویم خورشیدی نمایش داده می‌شود.
- ساعت ثبت به صورت ۱۲ ساعته AM/PM نمایش داده می‌شود.
- هنگام ویرایش، زمان اصلی ثبت کار تغییر نمی‌کند.

Supabase:
در فایل index.html دو مقدار زیر را وارد کنید:
const SUPABASE_PROJECT_URL = "https://xxxxxxxx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_...";

فقط Publishable Key یا anon key را در HTML استفاده کنید؛ service_role/secret key را در مرورگر قرار ندهید.

مراحل:
1. supabase.sql را در Supabase > SQL Editor اجرا کنید.
2. index.html را باز کنید و URL و Publishable Key را وارد کنید.
3. کل فایل‌های پروژه را روی GitHub Pages قرار دهید.
