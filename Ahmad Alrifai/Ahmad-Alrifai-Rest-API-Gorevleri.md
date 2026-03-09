# StudyPlanner REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

---

## 1. Kullanıcı Kaydı
- **Endpoint:** `POST /auth/register`
- **Request Body:**
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "Guvenli123!"
}
```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu

---

## 2. Kullanıcı Girişi
- **Endpoint:** `POST /auth/login`
- **Request Body:**
```json
{
  "email": "ahmet@example.com",
  "password": "Guvenli123!"
}
```
- **Response:** `200 OK` - Kullanıcı başarıyla giriş yaptı ve token döndürüldü

---

## 3. Kullanıcı Çıkışı
- **Endpoint:** `POST /auth/logout`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı başarıyla çıkış yaptı

---

## 4. Ders Oluşturma
- **Endpoint:** `POST /courses`
- **Authentication:** Bearer Token gerekli
- **Request Body:**
```json
{
  "title": "Veri Yapıları",
  "description": "Veri yapıları ve algoritmalar dersi"
}
```
- **Response:** `201 Created` - Ders başarıyla oluşturuldu

---

## 5. Dersleri Görüntüleme
- **Endpoint:** `GET /courses`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının tüm dersleri listelendi

---

## 6. Ders Güncelleme
- **Endpoint:** `PUT /courses/{courseId}`
- **Path Parameters:**
  - `courseId` (string, required) - Güncellenecek dersin ID’si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
```json
{
  "title": "Veri Yapıları ve Algoritmalar",
  "description": "Güncellenmiş ders açıklaması"
}
```
- **Response:** `200 OK` - Ders başarıyla güncellendi

---

## 7. Ders Silme
- **Endpoint:** `DELETE /courses/{courseId}`
- **Path Parameters:**
  - `courseId` (string, required) - Silinecek dersin ID’si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Ders başarıyla silindi

---

## 8. Görev Oluşturma
- **Endpoint:** `POST /courses/{courseId}/tasks`
- **Path Parameters:**
  - `courseId` (string, required) - Görevin ekleneceği dersin ID’si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
```json
{
  "title": "Ödev 1",
  "deadline": "2026-04-10",
  "description": "Linked list ödevi"
}
```
- **Response:** `201 Created` - Görev başarıyla oluşturuldu

---

## 9. Görevleri Görüntüleme
- **Endpoint:** `GET /courses/{courseId}/tasks`
- **Path Parameters:**
  - `courseId` (string, required) - Görevlerin ait olduğu ders ID’si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Dersin görevleri listelendi

---

## 10. Görev Güncelleme
- **Endpoint:** `PUT /tasks/{taskId}`
- **Path Parameters:**
  - `taskId` (string, required) - Güncellenecek görev ID’si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
```json
{
  "title": "Ödev 1 Güncellendi",
  "deadline": "2026-04-12",
  "description": "Güncellenmiş ödev açıklaması"
}
```
- **Response:** `200 OK` - Görev başarıyla güncellendi

---

## 11. Görev Silme
- **Endpoint:** `DELETE /tasks/{taskId}`
- **Path Parameters:**
  - `taskId` (string, required) - Silinecek görev ID’si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Görev başarıyla silindi

---

## 12. Görevi Tamamlandı Olarak İşaretleme
- **Endpoint:** `PUT /tasks/{taskId}/complete`
- **Path Parameters:**
  - `taskId` (string, required) - Tamamlanan görev ID’si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Görev tamamlandı olarak işaretlendi

---

## 13. Görevleri Filtreleme
- **Endpoint:** `GET /tasks?status={status}`
- **Query Parameters:**
  - `status` (string, optional) - `completed` veya `pending`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Filtrelenmiş görev listesi döndürüldü

---

## 14. İlerleme İstatistiklerini Görüntüleme
- **Endpoint:** `GET /courses/{courseId}/progress`
- **Path Parameters:**
  - `courseId` (string, required) - Ders ID’si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Ders için tamamlanma yüzdesi ve görev istatistikleri döndürüldü
