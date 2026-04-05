# StudyPlanner REST API Metotları

**API Test Videosi:** [Link buraya eklenecek](https://example.com)

**Base URL:** `https://studyplanner-2udh.onrender.com/api`

**Authentication:** Bearer Token (JWT)

---

## 1. Kullanıcı Kaydı
- **Endpoint:** `POST /auth/register`
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu

---

## 2. Kullanıcı Girişi
- **Endpoint:** `POST /auth/login`
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
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
  "name": "Mathematics",
  "description": "Math 101",
  "color": "#e44332"
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
  "name": "Advanced Math",
  "description": "Updated desc",
  "color": "#54a0ff"
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
  "title": "Study Chapter 1",
  "courseId": "65f8a2b3c4d5e6f7g8h9i0j1",
  "deadline": "2024-04-10T10:00"
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
  "title": "Updated title",
  "courseId": "65f8a2b3c4d5e6f7g8h9i0j1",
  "deadline": "2024-04-15T10:00",
  "completed": false
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
