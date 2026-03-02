**1. Kullanıcı Kaydı (POST):** Yeni bir kullanıcının ad, e-posta ve şifre
bilgileriyle sisteme hesap oluşturmasını sağlar.

**2. Kullanıcı Girişi (POST):** Kullanıcının e-posta ve şifresi ile doğrulanarak
sisteme giriş yapmasını sağlar.

**3. Kullanıcı Çıkışı (POST):** Aktif oturumu sonlandırarak kullanıcının
sistemden çıkış yapmasını sağlar.

**4. Ders Oluşturma (POST):** Kullanıcının görevlerini düzenlemek için yeni
bir ders eklemesini sağlar.

**5. Dersleri Görüntüleme (GET):** Giriş yapan kullanıcıya ait tüm derslerin
listelenmesini sağlar.

**6. Ders Güncelleme (PUT):** Mevcut bir dersin ad veya açıklama gibi
bilgilerinin düzenlenmesini sağlar.

**7. Ders Silme (DELETE):** Seçilen dersin ve ona ait görevlerin sistemden
kaldırılmasını sağlar.

**8. Görev Oluşturma (POST):** Belirli bir derse ait yeni bir görev ve isteğe
bağlı son tarih eklenmesini sağlar.

**9. Görevleri Görüntüleme (GET):** Seçilen derse ait tüm görevlerin
listelenmesini sağlar.

**10.Görev Güncelleme (PUT):** Görev başlığı, son tarih veya durum gibi
bilgilerin düzenlenmesini sağlar.

**11.Görev Silme (DELETE):** Seçilen görevin sistemden silinmesini sağlar.

**12.Görevi Tamamlandı Olarak İşaretleme (PUT):** Görevin durumunu
tamamlandı olarak güncelleyerek ilerleme takibini sağlar.

**13.Görevleri Filtreleme (GET):** Görevlerin tamamlandı veya beklemede
durumuna göre filtrelenmesini sağlar.

**14.İlerleme İstatistiklerini Görüntüleme (GET):** Derslere göre
tamamlanan görev yüzdesi gibi ilerleme bilgilerinin gösterilmesini
sağlar
