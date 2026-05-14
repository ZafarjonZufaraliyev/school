# Requirements Document

## Introduction

O'quv Markaz Boshqaruv Tizimi (eduUz) — Vue 3, Pinia, Vue Router, TailwindCSS va Axios asosida qurilgan to'liq funksional veb-ilova. Tizim uchta rol uchun mo'ljallangan: **Admin**, **O'qituvchi** va **O'quvchi**. Mavjud loyihada Vue Router o'rnatilgan bo'lib, `All_services.js` va `All_stores.js` fayllarida barcha servis va store'lar yozilgan — ularni alohida modullarga ajratish talab etiladi. Tizim JWT autentifikatsiyasi, RBAC (rol asosidagi kirish nazorati), dark/light rejim, bildirishnomalar, chartlar va mobil moslashuvchan interfeys bilan ta'minlanishi kerak.

### Lug'at

- **Tizim**: O'quv Markaz Boshqaruv Tizimi (eduUz) — ushbu veb-ilova
- **Admin**: Tizimni to'liq boshqaruvchi foydalanuvchi roli
- **O'qituvchi**: Guruhlar, topshiriqlar va resurslarni boshqaruvchi foydalanuvchi roli
- **O'quvchi**: Darslar, topshiriqlar va resurslardan foydalanadigan foydalanuvchi roli
- **JWT**: JSON Web Token — autentifikatsiya uchun ishlatiladigan token mexanizmi
- **RBAC**: Role-Based Access Control — rol asosidagi kirish nazorati
- **Guruh**: O'quvchilar va o'qituvchilar birlashtirilgan o'quv guruhi
- **Fan**: O'quv dasturidagi alohida o'quv predmeti
- **Topshiriq**: O'qituvchi tomonidan yaratilgan va o'quvchi tomonidan bajariladigan vazifa
- **Davomat**: O'quvchining darsga kelish/kelmaslik holati (kelgan/kelmagan/sababli)
- **Resurs**: O'qituvchi tomonidan yuklangan o'quv materiali (PDF, Word, Video, Link)
- **Router**: Vue Router — sahifalar orasida navigatsiya tizimi
- **Store**: Pinia store — reaktiv holat boshqaruvi
- **Servis**: Axios asosidagi API so'rovlar moduli
- **ApiService**: Axios instance'ini boshqaruvchi, JWT interceptor'larini o'z ichiga olgan sinf
- **AuthStore**: Autentifikatsiya holatini boshqaruvchi Pinia store
- **Sidebar**: Navigatsiya paneli — chap tomonda joylashgan menyu
- **Dashboard**: Asosiy boshqaruv paneli sahifasi
- **Deadline**: Topshiriqni topshirish muddati
- **Haftalik_Natijalar**: Bir hafta davomida to'plangan baho va davomat statistikasi

---

## Requirements

### Requirement 1: Modulli Arxitektura — Servis va Store'larni Ajratish

**User Story:** Dasturchi sifatida, men `All_services.js` va `All_stores.js` fayllaridagi kodlarni alohida modullarga ajratishni xohlayman, shunda loyiha kengaytirilishi va qo'llab-quvvatlanishi osonlashsin.

#### Qabul qilish mezonlari

1. THE Tizim SHALL `src/services/` papkasida har bir servis uchun alohida fayl yaratishi kerak: `api.service.js`, `auth.service.js`, `users.service.js`, `groups.service.js`, `assignments.service.js`, `attendance.service.js`, `resources.service.js`, `grades.service.js`, `schedule.service.js`, `notifications.service.js`.
2. THE Tizim SHALL `src/stores/` papkasida har bir store uchun alohida fayl yaratishi kerak: `auth.store.js`, `groups.store.js`, `assignments.store.js`, `attendance.store.js`, `notifications.store.js`, `theme.store.js`, `users.store.js`, `grades.store.js`, `resources.store.js`, `schedule.store.js`.
3. THE Tizim SHALL `src/router/routes/` papkasida `admin.routes.js`, `teacher.routes.js`, `student.routes.js` fayllarini alohida saqlashi kerak.
4. WHEN modullar ajratilganda, THE Tizim SHALL `All_services.js` va `All_stores.js` fayllaridagi barcha mavjud mantiqni o'zgartirishsiz yangi fayllarga ko'chirishi kerak.
5. THE Tizim SHALL `src/main.js` faylida Pinia, Vue Router va barcha kerakli plaginlarni ro'yxatdan o'tkazishi kerak.

---

### Requirement 2: Autentifikatsiya va Avtorizatsiya

**User Story:** Foydalanuvchi sifatida, men tizimga faqat login va parol orqali kirishni xohlayman, shunda ma'lumotlarim himoyalangan bo'lsin.

#### Qabul qilish mezonlari

1. WHEN foydalanuvchi login va parolni kiritib "Kirish" tugmasini bosganda, THE AuthStore SHALL `POST /auth/token/` so'rovini yuborishi va muvaffaqiyatli javob kelganda `access_token` hamda `refresh_token`ni `localStorage`ga saqlashi kerak.
2. WHEN `access_token` muddati tugaganda (401 xatosi), THE ApiService SHALL avtomatik ravishda `POST /auth/token/refresh/` so'rovini yuborib yangi token olishi va asl so'rovni qayta bajarishi kerak.
3. IF token yangilash ham muvaffaqiyatsiz bo'lsa, THEN THE ApiService SHALL `localStorage`dan tokenlarni o'chirib, foydalanuvchini `/login` sahifasiga yo'naltirishi kerak.
4. WHEN foydalanuvchi "Chiqish" tugmasini bosganda, THE AuthStore SHALL `POST /auth/token/blacklist/` so'rovini yuborib, `localStorage`ni tozalab, foydalanuvchini `/login` sahifasiga yo'naltirishi kerak.
5. THE Router SHALL har bir himoyalangan marshrutda `meta.requiresAuth` va `meta.role` maydonlarini tekshirib, foydalanuvchi roli mos kelmasa uni o'z dashboard'iga yo'naltirishi kerak.
6. WHEN foydalanuvchi autentifikatsiya qilinmagan holda himoyalangan sahifaga kirishga urinsa, THE Router SHALL foydalanuvchini `/login?redirect={to.fullPath}` manziliga yo'naltirishi kerak.
7. THE AuthStore SHALL `isAdmin`, `isTeacher`, `isStudent` computed xususiyatlarini taqdim etishi kerak, ular `user.role` qiymatiga asoslanishi kerak.

---

### Requirement 3: Foydalanuvchi Profili va Hisob Ma'lumotlarini Boshqarish

**User Story:** Foydalanuvchi sifatida, men o'z login va parolimni o'zgartirishni xohlayman, shunda hisobim xavfsizligini ta'minlay olayim.

#### Qabul qilish mezonlari

1. THE Tizim SHALL barcha rollar (Admin, O'qituvchi, O'quvchi) uchun parolni o'zgartirish imkoniyatini taqdim etishi kerak.
2. THE Tizim SHALL barcha rollar uchun login (username) ni o'zgartirish imkoniyatini taqdim etishi kerak.
3. WHEN foydalanuvchi parolni o'zgartirganda, THE AuthStore SHALL `POST /auth/change-password/` so'rovini yuborishi kerak.
4. WHEN foydalanuvchi loginni o'zgartirganda, THE AuthStore SHALL `POST /auth/change-username/` so'rovini yuborib, `user.username` qiymatini yangilashi kerak.
5. THE Tizim SHALL faqat Admin rolida bo'lgan foydalanuvchiga boshqa foydalanuvchilarning profil ma'lumotlarini (ism, familiya, telefon va boshqalar) tahrirlash imkoniyatini berishi kerak.
6. IF foydalanuvchi Admin rolida bo'lmasa, THEN THE Tizim SHALL profil ma'lumotlarini tahrirlash tugmalarini ko'rsatmasligi kerak.

---

### Requirement 4: Admin — Foydalanuvchilarni Boshqarish (CRUD)

**User Story:** Admin sifatida, men tizimga yangi o'qituvchi va o'quvchilarni qo'shishni, tahrirlashni va o'chirishni xohlayman, shunda foydalanuvchilar bazasini nazorat qilay olayim.

#### Qabul qilish mezonlari

1. THE Tizim SHALL faqat Admin rolida bo'lgan foydalanuvchiga yangi foydalanuvchi yaratish imkoniyatini berishi kerak.
2. WHEN Admin yangi foydalanuvchi yaratganda, THE Tizim SHALL `POST /users/` so'rovini yuborib, foydalanuvchi ro'yxatini yangilashi kerak.
3. WHEN Admin foydalanuvchini tahrirlaganda, THE Tizim SHALL `PUT /users/{id}/` so'rovini yuborishi kerak.
4. WHEN Admin foydalanuvchini o'chirganda, THE Tizim SHALL tasdiqlash oynasini ko'rsatib, tasdiqdan so'ng `DELETE /users/{id}/` so'rovini yuborishi kerak.
5. THE Tizim SHALL foydalanuvchilar ro'yxatini rol bo'yicha filtrlash imkoniyatini taqdim etishi kerak (Admin, O'qituvchi, O'quvchi).
6. THE Tizim SHALL foydalanuvchilar ro'yxatida sahifalash (pagination) ni qo'llab-quvvatlashi kerak.

---

### Requirement 5: Admin — Guruh va Fan Boshqaruvi

**User Story:** Admin sifatida, men guruhlar va fanlarni yaratib, ularga o'qituvchi va o'quvchilarni biriktirmoqchiman, shunda o'quv jarayonini tashkil qilay olayim.

#### Qabul qilish mezonlari

1. THE Tizim SHALL Admin uchun guruh yaratish, tahrirlash va o'chirish imkoniyatini taqdim etishi kerak.
2. WHEN Admin guruh yaratganda, THE Tizim SHALL guruh nomini, fanini, o'qituvchisini va boshlanish sanasini kiritish maydonlarini taqdim etishi kerak.
3. THE Tizim SHALL Admin uchun fan (subject) yaratish, tahrirlash va o'chirish imkoniyatini taqdim etishi kerak.
4. WHEN Admin guruhga o'quvchi qo'shganda, THE Tizim SHALL `POST /groups/{id}/students/` so'rovini yuborishi kerak.
5. THE Tizim SHALL guruh tafsilotlari sahifasida guruh a'zolari, dars jadvali va statistikani ko'rsatishi kerak.

---

### Requirement 6: Dars Jadvali

**User Story:** Admin va O'qituvchi sifatida, men dars jadvalini ko'rib, boshqarishni xohlayman, shunda darslar tartibli o'tkazilsin.

#### Qabul qilish mezonlari

1. THE Tizim SHALL haftalik dars jadvalini vizual ko'rinishda (jadval yoki kalendarь) taqdim etishi kerak.
2. WHEN Admin yangi dars qo'shganda, THE Tizim SHALL `POST /schedule/` so'rovini yuborib, jadvalga yangi yozuv qo'shishi kerak.
3. THE Tizim SHALL O'qituvchiga faqat o'ziga tegishli guruhlarning dars jadvalini ko'rsatishi kerak.
4. THE Tizim SHALL O'quvchiga faqat o'zi a'zo bo'lgan guruhlarning dars jadvalini ko'rsatishi kerak.
5. WHEN dars jadvali o'zgartirilganda, THE Tizim SHALL barcha tegishli foydalanuvchilarga bildirishnoma yuborishi kerak.

---

### Requirement 7: Topshiriqlar Tizimi

**User Story:** O'qituvchi sifatida, men topshiriqlar yaratib, deadline va fayl yuklash imkoniyatini boshqarishni xohlayman; O'quvchi sifatida esa topshiriqlarni ko'rib, deadline hisoblagichi bilan bajarishni xohlayman.

#### Qabul qilish mezonlari

1. WHEN O'qituvchi yangi topshiriq yaratganda, THE Tizim SHALL topshiriq nomi, tavsifi, deadline sanasi va `upload_open` (fayl yuklash ochiq/yopiq) maydonlarini kiritish imkoniyatini taqdim etishi kerak.
2. THE Tizim SHALL O'qituvchiga topshiriq uchun fayl yuklash imkoniyatini `PATCH /assignments/{id}/toggle-upload/` orqali yoqish yoki o'chirish imkoniyatini berishi kerak.
3. WHEN O'quvchi topshiriqni ko'rganda, THE Tizim SHALL deadline'gacha qolgan vaqtni real vaqtda hisoblab ko'rsatishi kerak.
4. WHEN `upload_open` qiymati `true` bo'lganda va deadline o'tmagan bo'lganda, THE Tizim SHALL O'quvchiga fayl yuklash tugmasini ko'rsatishi kerak.
5. IF `upload_open` qiymati `false` bo'lsa yoki deadline o'tgan bo'lsa, THEN THE Tizim SHALL O'quvchiga fayl yuklash tugmasini ko'rsatmasligi kerak.
6. WHEN O'quvchi fayl yuklasa, THE Tizim SHALL `POST /assignments/{id}/submit/` so'rovini `multipart/form-data` formatida yuborishi kerak.
7. THE Tizim SHALL O'qituvchiga topshiriq bo'yicha barcha o'quvchilarning topshiriqlarini ko'rish va baholash imkoniyatini berishi kerak.

---

### Requirement 8: Davomat Tizimi

**User Story:** O'qituvchi sifatida, men har bir dars uchun o'quvchilar davomatini belgilab, foizini ko'rishni xohlayman; O'quvchi sifatida esa o'z davomat foizimni ko'rishni xohlayman.

#### Qabul qilish mezonlari

1. THE Tizim SHALL O'qituvchiga har bir o'quvchi uchun davomat holatini belgilash imkoniyatini berishi kerak: `present` (kelgan), `absent` (kelmagan), `excused` (sababli).
2. WHEN O'qituvchi davomatni saqlasa, THE Tizim SHALL `POST /attendance/bulk-save/` so'rovini yuborib, barcha yozuvlarni bir vaqtda saqlashi kerak.
3. THE AttendanceStore SHALL har bir o'quvchi uchun davomat foizini `(present / total) * 100` formulasi asosida hisoblashi kerak.
4. THE Tizim SHALL O'quvchiga o'z davomat foizini va har bir dars uchun holat tarixini ko'rsatishi kerak.
5. THE Tizim SHALL Admin uchun guruh bo'yicha umumiy davomat statistikasini chart ko'rinishida ko'rsatishi kerak.

---

### Requirement 9: Baholar Tizimi

**User Story:** O'qituvchi sifatida, men o'quvchilarga baho qo'yib, haftalik natijalarni ko'rishni xohlayman; O'quvchi sifatida esa o'z baholarimni ko'rishni xohlayman.

#### Qabul qilish mezonlari

1. THE Tizim SHALL O'qituvchiga o'quvchilarga baho qo'yish imkoniyatini berishi kerak (`POST /grades/` yoki `POST /grades/bulk-save/`).
2. THE Tizim SHALL O'qituvchiga guruh bo'yicha barcha baholarni jadval ko'rinishida ko'rsatishi kerak.
3. THE Tizim SHALL O'quvchiga o'z baholarini fan va sana bo'yicha ko'rsatishi kerak.
4. THE Tizim SHALL haftalik natijalar sahifasida o'quvchilarning o'rtacha baholarini va davomat foizini ko'rsatishi kerak.
5. WHEN topshiriq baholanganda, THE Tizim SHALL `PATCH /submissions/{id}/grade/` so'rovini yuborib, natijani yangilashi kerak.

---

### Requirement 10: Resurslar Tizimi

**User Story:** O'qituvchi sifatida, men o'quv materiallarini (PDF, Word, Video, Link) yuklashni va boshqarishni xohlayman; O'quvchi sifatida esa resurslarni yuklab olishni xohlayman.

#### Qabul qilish mezonlari

1. THE Tizim SHALL O'qituvchiga resurs yuklash imkoniyatini berishi kerak: fayl turi (PDF, Word, Video) yoki tashqi havola (Link).
2. WHEN O'qituvchi resurs yuklasa, THE Tizim SHALL `POST /resources/` so'rovini `multipart/form-data` formatida yuborishi kerak.
3. THE Tizim SHALL O'quvchiga o'z guruhiga tegishli resurslarni ko'rish va yuklab olish imkoniyatini berishi kerak.
4. WHEN O'quvchi resursni yuklab olsa, THE Tizim SHALL `GET /resources/{id}/download/` so'rovini yuborishi kerak.
5. THE Tizim SHALL Admin uchun barcha resurslarni ko'rish, filtrlash va o'chirish imkoniyatini taqdim etishi kerak.
6. THE Tizim SHALL resurs turini ikonka bilan vizual ko'rsatishi kerak (PDF — qizil, Word — ko'k, Video — yashil, Link — sariq).

---

### Requirement 11: Bildirishnomalar Tizimi

**User Story:** Foydalanuvchi sifatida, men tizimdan muhim hodisalar haqida bildirishnomalar olishni xohlayman, shunda hech narsani o'tkazib yubormasam.

#### Qabul qilish mezonlari

1. THE Tizim SHALL barcha rollar uchun bildirishnomalar panelini taqdim etishi kerak.
2. THE NotificationsStore SHALL o'qilmagan bildirishnomalar sonini `unreadCount` computed xususiyati orqali hisoblashi kerak.
3. WHEN foydalanuvchi bildirishnomani o'qiganda, THE NotificationsStore SHALL `markAsRead(id)` metodini chaqirib, `is_read` qiymatini `true` ga o'zgartirishi kerak.
4. THE Tizim SHALL foydalanuvchiga barcha bildirishnomalarni bir vaqtda o'qilgan deb belgilash imkoniyatini berishi kerak.
5. WHEN yangi bildirishnoma kelganda, THE NotificationsStore SHALL `addNotification()` metodi orqali uni ro'yxat boshiga qo'shishi kerak.
6. THE Tizim SHALL Sidebar'da o'qilmagan bildirishnomalar soni uchun badge ko'rsatishi kerak.

---

### Requirement 12: Dark/Light Rejim

**User Story:** Foydalanuvchi sifatida, men interfeys rangini o'z xohishimga ko'ra dark yoki light rejimga o'tkazishni xohlayman.

#### Qabul qilish mezonlari

1. THE ThemeStore SHALL joriy rejimni `localStorage`da saqlashi va sahifa yangilanganida uni tiklashi kerak.
2. WHEN foydalanuvchi rejimni o'zgartirganda, THE ThemeStore SHALL `document.documentElement` elementiga `dark` klassini qo'shishi yoki olib tashlashi kerak.
3. THE Tizim SHALL TailwindCSS `dark:` prefiksi orqali barcha komponentlarda dark rejimni qo'llab-quvvatlashi kerak.
4. THE Tizim SHALL rejim o'zgartirish tugmasini Sidebar yoki Header'da ko'rinadigan joyda joylashtirishishi kerak.

---

### Requirement 13: Admin Dashboard va Chartlar

**User Story:** Admin sifatida, men tizimning umumiy statistikasini chartlar orqali ko'rishni xohlayman, shunda o'quv markaz faoliyatini nazorat qilay olayim.

#### Qabul qilish mezonlari

1. THE Tizim SHALL Admin Dashboard'ida umumiy statistikani ko'rsatishi kerak: jami o'quvchilar soni, o'qituvchilar soni, faol guruhlar soni, o'rtacha davomat foizi.
2. THE Tizim SHALL davomat dinamikasini chiziqli chart (line chart) ko'rinishida ko'rsatishi kerak.
3. THE Tizim SHALL o'quvchilarning o'zlashtirish ko'rsatkichlarini ustunli chart (bar chart) ko'rinishida ko'rsatishi kerak.
4. THE Tizim SHALL guruhlar bo'yicha taqsimotni doira chart (pie/doughnut chart) ko'rinishida ko'rsatishi kerak.
5. THE Tizim SHALL chartlar kutubxonasi sifatida Chart.js yoki Vue-ChartJS dan foydalanishi kerak.

---

### Requirement 14: Sidebar va Navigatsiya

**User Story:** Foydalanuvchi sifatida, men qulay sidebar orqali tizimning barcha bo'limlariga tez o'tishni xohlayman.

#### Qabul qilish mezonlari

1. THE Tizim SHALL har bir rol uchun alohida Sidebar komponentini taqdim etishi kerak: `AdminSidebar`, `TeacherSidebar`, `StudentSidebar`.
2. THE Tizim SHALL Sidebar'da foydalanuvchi ismi, roli va profil rasmini ko'rsatishi kerak.
3. THE Tizim SHALL mobil qurilmalarda Sidebar'ni yig'ib qo'yish (collapse) imkoniyatini berishi kerak.
4. WHEN foydalanuvchi navigatsiya havolasini bosganda, THE Router SHALL tegishli sahifaga o'tib, faol havolani vizual belgilashi kerak.
5. THE Tizim SHALL Sidebar'da bildirishnomalar badge'ini va dark/light rejim tugmasini ko'rsatishi kerak.

---

### Requirement 15: Mobil Moslashuvchanlik

**User Story:** Foydalanuvchi sifatida, men tizimdan mobil qurilmada ham qulay foydalanishni xohlayman.

#### Qabul qilish mezonlari

1. THE Tizim SHALL TailwindCSS responsive prefikslari (`sm:`, `md:`, `lg:`, `xl:`) orqali barcha sahifalarda mobil moslashuvchan dizaynni ta'minlashi kerak.
2. THE Tizim SHALL mobil qurilmalarda (ekran kengligi 768px dan kichik) Sidebar'ni overlay ko'rinishida ko'rsatishi kerak.
3. THE Tizim SHALL jadvallarni mobil qurilmalarda gorizontal aylantirish (horizontal scroll) yoki kartochka ko'rinishiga o'tkazishi kerak.
4. THE Tizim SHALL barcha tugmalar va interaktiv elementlarning minimal o'lchamini 44x44 piksel bo'lishini ta'minlashi kerak.

---

### Requirement 16: Xato Boshqaruvi va Foydalanuvchi Xabarlari

**User Story:** Foydalanuvchi sifatida, men tizimda xato yuz berganda tushunarli xabar ko'rishni xohlayman, shunda nima qilishim kerakligini bilayim.

#### Qabul qilish mezonlari

1. WHEN API so'rovi muvaffaqiyatli bo'lganda, THE Tizim SHALL foydalanuvchiga muvaffaqiyat toast xabarini ko'rsatishi kerak.
2. WHEN API so'rovi muvaffaqiyatsiz bo'lganda, THE Tizim SHALL xato xabarini toast yoki alert ko'rinishida ko'rsatishi kerak.
3. IF tarmoq ulanishi yo'q bo'lsa, THEN THE Tizim SHALL foydalanuvchiga tarmoq xatosi haqida xabar ko'rsatishi kerak.
4. THE Tizim SHALL forma validatsiyasi xatolarini tegishli maydon yonida ko'rsatishi kerak.
5. WHEN sahifa yuklanayotganda, THE Tizim SHALL yuklanish indikatorini (spinner yoki skeleton) ko'rsatishi kerak.

---

### Requirement 17: O'qituvchi Paneli

**User Story:** O'qituvchi sifatida, men o'z guruhlarim, dars jadvalim, topshiriqlarim va o'quvchilarim natijalarini bitta paneldan boshqarishni xohlayman.

#### Qabul qilish mezonlari

1. THE Tizim SHALL O'qituvchiga faqat o'ziga biriktirilgan guruhlarni ko'rsatishi kerak.
2. THE Tizim SHALL O'qituvchi Dashboard'ida joriy hafta dars jadvali, so'nggi topshiriqlar va guruhlar statistikasini ko'rsatishi kerak.
3. THE Tizim SHALL O'qituvchiga guruh bo'yicha davomat kiritish sahifasini taqdim etishi kerak.
4. THE Tizim SHALL O'qituvchiga guruh bo'yicha baholar jadvalini ko'rish va tahrirlash imkoniyatini berishi kerak.
5. THE Tizim SHALL O'qituvchiga haftalik natijalar sahifasida o'quvchilarning o'rtacha ko'rsatkichlarini ko'rsatishi kerak.

---

### Requirement 18: O'quvchi Paneli

**User Story:** O'quvchi sifatida, men o'z guruhlarim, dars jadvalim, topshiriqlarim, baholarim va davomat foizimni bitta paneldan ko'rishni xohlayman.

#### Qabul qilish mezonlari

1. THE Tizim SHALL O'quvchiga faqat o'zi a'zo bo'lgan guruhlarni ko'rsatishi kerak.
2. THE Tizim SHALL O'quvchi Dashboard'ida joriy hafta dars jadvali, kutilayotgan topshiriqlar va so'nggi baholarni ko'rsatishi kerak.
3. THE Tizim SHALL O'quvchiga topshiriqlar ro'yxatida har bir topshiriq uchun deadline'gacha qolgan vaqtni real vaqtda ko'rsatishi kerak.
4. THE Tizim SHALL O'quvchiga o'z davomat foizini va baholarini ko'rsatishi kerak.
5. THE Tizim SHALL O'quvchiga haftalik natijalar sahifasida o'z ko'rsatkichlarini ko'rsatishi kerak.
6. THE Tizim SHALL O'quvchiga profil sahifasida o'z ma'lumotlarini ko'rish imkoniyatini berishi kerak.
