# StudyPlanner Web Frontend Görevleri
**Front-end Test Videosu:** [Link buraya eklenecek](https://youtu.be/jIyX5-M5Eno](https://youtu.be/A2I8zI60Xr8)](https://youtu.be/A2I8zI60Xr8))

## 1. Üye Olma (Kayıt) Sayfası
- **API Endpoint:** `POST /api/auth/register`
- **Görev:** Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Responsive kayıt formu (desktop ve mobile uyumlu)
  - Ad (name) input alanı (autocomplete="name")
  - Email input alanı (type="email", autocomplete="email")
  - Şifre input alanı (type="password", şifre gücü göstergesi)
  - "Kayıt Ol" butonu (primary button style, Todoist kırmızısı #e44332)
  - "Zaten hesabınız var mı? Giriş Yap" linki
  - Loading spinner (kayıt işlemi sırasında)
  - Form container (card veya centered layout, Todoist tarzı minimal tasarım)
  - Logo ve başlık alanı (StudyPlanner branding)
- **Form Validasyonu:**
  - HTML5 form validation (required, pattern attributes)
  - JavaScript real-time validation
  - Email format kontrolü (regex pattern)
  - Şifre güvenlik kuralları (min 6 karakter)
  - Ad alanı boş olamaz kontrolü
  - Tüm alanlar geçerli olmadan buton disabled
  - Client-side ve server-side validation
- **Kullanıcı Deneyimi:**
  - Form hatalarını input altında gösterilmesi (inline validation)
  - Başarılı kayıt sonrası success notification ve otomatik dashboard sayfasına yönlendirme
  - Hata durumlarında kullanıcı dostu mesajlar (409 Conflict: "Bu email zaten kullanılıyor")
  - Form submission prevention (double-click koruması)
  - Accessible form labels ve ARIA attributes
  - Keyboard navigation desteği (Tab, Enter)
- **Teknik Detaylar:**
  - Vanilla JS (mevcut implementasyon korunacak)
  - API istekleri için api.js modülü kullanılacak
  - State management (form state, loading state, error state)
  - Routing (kayıt sayfasından dashboard'a geçiş)
  - LocalStorage'a token ve user bilgisi kaydetme
  - Responsive design (mobile-first approach)

## 2. Giriş Yapma (Login) Sayfası
- **API Endpoint:** `POST /api/auth/login`
- **Görev:** Kullanıcı giriş işlemi için web sayfası tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Responsive giriş formu (desktop ve mobile uyumlu)
  - Email input alanı (type="email", autocomplete="email")
  - Şifre input alanı (type="password", show/hide toggle)
  - "Giriş Yap" butonu (primary button style, #e44332)
  - "Hesabınız yok mu? Kayıt Ol" linki
  - Loading spinner (giriş işlemi sırasında)
  - Form container (card layout, Todoist tarzı)
  - Logo ve başlık alanı (StudyPlanner branding)
  - "Beni hatırla" checkbox (opsiyonel)
- **Form Validasyonu:**
  - Email format kontrolü
  - Şifre alanı boş olamaz
  - Tüm alanlar geçerli olmadan buton disabled
- **Kullanıcı Deneyimi:**
  - Başarılı giriş sonrası dashboard sayfasına yönlendirme
  - Hata durumlarında kullanıcı dostu mesajlar (401: "Geçersiz email veya şifre")
  - Loading state gösterimi
  - Şifre göster/gizle toggle
- **Teknik Detaylar:**
  - Vanilla JS
  - api.js modülü kullanımı
  - JWT token LocalStorage'a kaydetme
  - Sonraki sayfalara yönlendirme (redirect)

## 3. Dashboard (Ana Sayfa) - Tüm Görevler Görünümü
- **API Endpoint:** `GET /api/tasks`, `GET /api/courses`, `GET /api/statistics`
- **Görev:** Kullanıcının tüm görevlerini ve kurslarını görüntüleme sayfası
- **UI Bileşenleri:**
  - Sidebar navigation (sol menü)
    - Kullanıcı profil özeti (avatar, isim)
    - "Tüm Görevler" nav item (aktif durumda)
    - "İstatistikler" nav item
    - Kurs listesi (dinamik, kullanıcının kursları)
    - "Kurs Ekle" butonu
    - Logout butonu
  - Main content area
    - Header (sayfa başlığı: "Tüm Görevler", görev sayısı)
    - Filtre dropdown (Tümü / Bekleyen / Tamamlanan)
    - İlerleme kartı (tamamlama yüzdesi, progress bar)
    - "Yeni Görev Ekle" kutusu (Todoist tarzı)
    - Görev listesi (task items)
      - Checkbox (tamamlama durumu)
      - Görev başlığı
      - Kurs adı (renkli dot ile)
      - Deadline (varsa, tarih formatında)
      - Edit/Delete butonları (hover'da görünür)
- **Görev Öğesi (Task Item) Bileşeni:**
  - Checkbox (circular, completed durumunda yeşil tik)
  - Başlık (completed ise üstü çizili, gri renk)
  - Meta bilgiler (kurs adı, deadline)
  - Hover actions (edit, delete butonları)
  - Responsive layout
- **Kullanıcı Deneyimi:**
  - Loading skeleton screen (veri yüklenirken)
  - Empty state (görev yoksa)
  - Smooth checkbox animation (toggle complete/incomplete)
  - Real-time progress update (tamamlama yüzdesi anlık güncellenir)
  - Infinite scroll veya pagination (opsiyonel)
- **Teknik Detaylar:**
  - Sidebar ve main content responsive layout
  - API'den gelen verilerin işlenmesi ve render edilmesi
  - Event delegation (dinamik görev öğeleri için)
  - State management (courses, tasks, currentView)

## 4. Kurs Detay Sayfası (Kursa Özel Görevler)
- **API Endpoint:** `GET /api/tasks?courseId={id}`, `GET /api/courses/{id}`
- **Görev:** Belirli bir kursun görevlerini görüntüleme sayfası
- **UI Bileşenleri:**
  - Sidebar'da ilgili kursun aktif (highlighted) gösterimi
  - Header (kurs adı, renkli dot ile)
  - Kurs istatistikleri (sadece bu kurs için tamamlama yüzdesi)
  - Filtre dropdown (Tümü / Bekleyen / Tamamlanan)
  - "Yeni Görev Ekle" kutusu (otomatik olarak bu kurs seçili)
  - Görev listesi (sadece bu kursun görevleri)
  - "Kursu Düzenle" ve "Kursu Sil" butonları (header'da)
- **Kullanıcı Deneyimi:**
  - Kurs değişiminde smooth transition
  - Sidebar'da aktif kurs vurgulanması
  - Boş durum ("Bu kursta henüz görev yok")
- **Teknik Detaylar:**
  - URL parametreleri veya state management ile kurs ID'si yönetimi
  - Sidebar active state yönetimi
  - Breadcrumb navigation (opsiyonel)

## 5. Kurs Ekleme Modalı
- **API Endpoint:** `POST /api/courses`
- **Görev:** Yeni kurs oluşturma modalı
- **UI Bileşenleri:**
  - Modal overlay (arka plan blur/dim)
  - Modal container (centered)
  - Başlık ("Yeni Kurs Ekle")
  - Kurs adı input alanı
  - Açıklama input alanı (opsiyonel, textarea)
  - Renk seçici (8 renk seçeneği, circular buttons)
  - "İptal" butonu (secondary)
  - "Kaydet" butonu (primary)
- **Form Validasyonu:**
  - Kurs adı zorunlu
  - Varsayılan renk seçili (Todoist kırmızısı)
- **Kullanıcı Deneyimi:**
  - Modal açılış/kapanış animation'ı
  - ESC tuşu ile kapatma
  - Dışarı tıklama ile kapatma
  - Başarılı ekleme sonrası sidebar otomatik güncellenir
  - Input focus (modal açıldığında)
- **Teknik Detaylar:**
  - Modal state management (open/close)
  - Event handling (ESC, outside click)
  - API call ve sonrası courses listesi refresh

## 6. Kurs Düzenleme Modalı
- **API Endpoint:** `PUT /api/courses/{id}`
- **Görev:** Mevcut kursu düzenleme modalı
- **UI Bileşenleri:**
  - Modal container
  - Başlık ("Kursu Düzenle")
  - Kurs adı input alanı (mevcut değerle dolu)
  - Açıklama input alanı (mevcut değerle dolu)
  - Renk seçici (mevcut renk seçili)
  - "Sil" butonu (danger style, sol alt köşede)
  - "İptal" butonu
  - "Kaydet" butonu
- **Form Validasyonu:**
  - Kurs adı boş olamaz
  - Değişiklik yoksa "Kaydet" disabled
- **Kullanıcı Deneyimi:**
  - Mevcut değerlerin formda gösterilmesi
  - Değişiklik yapıldığında "Kaydet" aktif olur
  - Silme butonuna basıldığında confirmation dialog
- **Teknik Detaylar:**
  - Course ID'ye göre veri çekme
  - Form state management (initial vs current)
  - Edit ve delete işlemlerinin yönetimi

## 7. Görev Ekleme Modalı
- **API Endpoint:** `POST /api/tasks`
- **Görev:** Yeni görev oluşturma modalı
- **UI Bileşenleri:**
  - Modal container
  - Başlık ("Yeni Görev Ekle")
  - Görev başlığı input alanı
  - Kurs seçici dropdown (tüm kurslar listesi)
  - Deadline input alanı (datetime-local, opsiyonel)
  - "İptal" butonu
  - "Kaydet" butonu
- **Form Validasyonu:**
  - Görev başlığı zorunlu
  - Kurs seçimi zorunlu
  - Deadline opsiyonel
- **Kullanıcı Deneyimi:**
  - Eğer kurs detay sayfasından açıldıysa, o kurs otomatik seçili
  - Başarılı ekleme sonrası görev listesi otomatik güncellenir
  - Yeni görev animasyonlu şekilde listeye eklenir
- **Teknik Detaylar:**
  - Kurs listesinin API'den çekilmesi
  - Default course ID yönetimi
  - Date format handling

## 8. Görev Düzenleme Modalı
- **API Endpoint:** `PUT /api/tasks/{id}`
- **Görev:** Mevcut görevi düzenleme modalı
- **UI Bileşenleri:**
  - Modal container
  - Başlık ("Görevi Düzenle")
  - Görev başlığı input alanı (mevcut değerle dolu)
  - Kurs seçici dropdown (mevcut kurs seçili)
  - Deadline input alanı (mevcut tarihle dolu, opsiyonel)
  - "Sil" butonu (danger style)
  - "İptal" butonu
  - "Kaydet" butonu
- **Form Validasyonu:**
  - Görev başlığı boş olamaz
  - Değişiklik yoksa "Kaydet" disabled
- **Kullanıcı Deneyimi:**
  - Mevcut değerlerin formda gösterilmesi
  - Deadline temizleme butonu (opsiyonel)
- **Teknik Detaylar:**
  - Task ID'ye göre veri çekme
  - Date format conversion (ISO string to datetime-local)

## 9. İstatistikler Sayfası
- **API Endpoint:** `GET /api/statistics`
- **Görev:** Kullanıcının genel ilerleme istatistiklerini görüntüleme
- **UI Bileşenleri:**
  - Sidebar'da "İstatistikler" nav item aktif
  - Header ("İlerleme İstatistikleri")
  - Özet kartları (4 adet):
    - Toplam Görev
    - Tamamlanan
    - Tamamlama Oranı (%)
    - Aktif Kurs Sayısı
  - Kurs bazlı ilerleme listesi
    - Kurs adı (renkli dot ile)
    - İlerleme çubuğu (progress bar)
    - İstatistikler (tamamlanan/toplama)
    - Yüzde değeri
- **Kullanıcı Deneyimi:**
  - Progress bar animation'ları
  - Hover effects (kurs üzerine gelince detay)
  - Responsive grid layout
- **Teknik Detaylar:**
  - API'den gelen statistics verisinin işlenmesi
  - Progress bar CSS animation
  - Responsive card layout

## 10. Hesap Silme Akışı
- **API Endpoint:** `DELETE /api/courses/{id}` (kurs silme), `DELETE /api/tasks/{id}` (görev silme)
- **Görev:** Kullanıcı hesabını silme işlemi için web UI akışı (opsiyonel, ekstra özellik)
- **UI Bileşenleri:**
  - "Hesabı Sil" butonu (sidebar'da veya profil sayfasında, danger style)
  - Modal dialog (destructive action için)
  - Şifre doğrulama alanı (güvenlik için)
  - Son onay ekranı
  - Warning icons ve visual cues
- **Kullanıcı Deneyimi:**
  - Destructive action için görsel uyarılar (kırmızı renk, warning icons)
  - Açık ve net uyarı mesajları ("Bu işlem geri alınamaz")
  - İptal seçeneği her zaman mevcut
  - Silme işlemi sırasında loading indicator
  - Başarılı silme sonrası logout ve login sayfasına yönlendirme
- **Teknik Detaylar:**
  - Modal/Dialog component
  - Multi-step flow yönetimi
  - Logout işlemi entegrasyonu
  - LocalStorage temizleme

---

## Genel Teknik Gereksinimler

### Responsive Design
- **Mobile:** < 768px (single column, sidebar hamburger menu)
- **Tablet:** 768px - 1024px (adjusted sidebar)
- **Desktop:** > 1024px (full sidebar + main content)

### State Management
- `currentUser`: Giriş yapmış kullanıcı bilgisi
- `courses`: Kullanıcının kursları listesi
- `tasks`: Mevcut görünümdeki görevler
- `currentView`: 'all' veya courseId
- `filters`: Filtreleme durumu

### API Integration
- Tüm API call'ları `api.js` modülü üzerinden yapılacak
- Error handling (try-catch)
- Loading states
- Token-based authentication (JWT)

### Styling
- Todoist-inspired design
- Primary color: #e44332 (kırmızı)
- Success color: #058527 (yeşil)
- Background: #fafafa (açık gri)
- Font: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)

### Accessibility
- ARIA labels
- Keyboard navigation
- Focus states
- Color contrast (WCAG AA)

### Performance
- Lazy loading (opsiyonel)
- Image optimization
- Minimal reflows/repaints
- Efficient DOM updates
