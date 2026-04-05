# StudyPlanner REST API Metotları

**API Test Videosi:** [Link buraya eklenecek](https://example.com)

**Base URL:** `https://studyplanner-2udh.onrender.com/api`

**Authentication:** Bearer Token (JWT)

---

## 1. Üye Olma (Kullanıcı Kaydı)

- **Endpoint:** `POST /auth/register`
- **Description:** Yeni kullanıcı hesabı oluşturma
- **Request Body:**
  ```json
  {
    "name": "Ahmad Alrifai",
    "email": "ahmad@example.com",
    "password": "password123"
  }
  ```
- **Validation:**
  - `name`: Zorunlu, minimum 2 karakter
  - `email`: Zorunlu, geçerli email formatı
  - `password`: Zorunlu, minimum 6 karakter
- **Response Success (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f8a2b3c4d5e6f7g8h9i0j1",
      "name": "Ahmad Alrifai",
      "email": "ahmad@example.com"
    }
  }
  ```
- **Response Error (409 Conflict):**
  ```json
  {
    "error": "User already exists with this email"
  }
  ```

---

## 2. Giriş Yapma (Kullanıcı Login)

- **Endpoint:** `POST /auth/login`
- **Description:** Mevcut kullanıcı ile giriş yapma
- **Request Body:**
  ```json
  {
    "email": "ahmad@example.com",
    "password": "password123"
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f8a2b3c4d5e6f7g8h9i0j1",
      "name": "Ahmad Alrifai",
      "email": "ahmad@example.com"
    }
  }
  ```
- **Response Error (401 Unauthorized):**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

---

## 3. Çıkış Yapma (Kullanıcı Logout)

- **Endpoint:** `POST /auth/logout`
- **Description:** Kullanıcı çıkışı (client-side token silme)
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Logout successful. Please remove token from client storage."
  }
  ```

---

## 4. Mevcut Kullanıcı Bilgilerini Görüntüleme

- **Endpoint:** `GET /auth/me`
- **Description:** Token ile mevcut kullanıcı bilgilerini getirme
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "user": {
      "_id": "65f8a2b3c4d5e6f7g8h9i0j1",
      "name": "Ahmad Alrifai",
      "email": "ahmad@example.com",
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  }
  ```
- **Response Error (403 Forbidden):**
  ```json
  {
    "error": "Invalid token"
  }
  ```

---

## 5. Tüm Kursları Listeleme

- **Endpoint:** `GET /courses`
- **Description:** Giriş yapmış kullanıcının tüm kurslarını getirme
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "count": 3,
    "courses": [
      {
        "_id": "65f8a2b3c4d5e6f7g8h9i0j2",
        "userId": "65f8a2b3c4d5e6f7g8h9i0j1",
        "name": "Mathematics",
        "description": "Math 101 Course",
        "color": "#e44332",
        "createdAt": "2024-03-15T10:35:00.000Z",
        "updatedAt": "2024-03-15T10:35:00.000Z"
      },
      {
        "_id": "65f8a2b3c4d5e6f7g8h9i0j3",
        "userId": "65f8a2b3c4d5e6f7g8h9i0j1",
        "name": "Physics",
        "description": "Physics Basics",
        "color": "#54a0ff",
        "createdAt": "2024-03-15T11:00:00.000Z",
        "updatedAt": "2024-03-15T11:00:00.000Z"
      }
    ]
  }
  ```

---

## 6. Yeni Kurs Oluşturma

- **Endpoint:** `POST /courses`
- **Description:** Yeni kurs ekleme
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Chemistry",
    "description": "Organic Chemistry Course",
    "color": "#1dd1a1"
  }
  ```
- **Validation:**
  - `name`: Zorunlu, boş olamaz
  - `description`: Opsiyonel
  - `color`: Opsiyonel, default: #e44332
- **Response Success (201 Created):**
  ```json
  {
    "message": "Course created successfully",
    "course": {
      "_id": "65f8a2b3c4d5e6f7g8h9i0j4",
      "userId": "65f8a2b3c4d5e6f7g8h9i0j1",
      "name": "Chemistry",
      "description": "Organic Chemistry Course",
      "color": "#1dd1a1",
      "createdAt": "2024-03-15T12:00:00.000Z",
      "updatedAt": "2024-03-15T12:00:00.000Z"
    }
  }
  ```
- **Response Error (400 Bad Request):**
  ```json
  {
    "error": "Course name is required"
  }
  ```

---

## 7. Kurs Güncelleme

- **Endpoint:** `PUT /courses/{id}`
- **Description:** Mevcut kursu güncelleme
- **Path Parameters:**
  - `id` (string, required) - Kurs ID'si (MongoDB ObjectId)
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Advanced Mathematics",
    "description": "Updated description",
    "color": "#ff9f43"
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Course updated successfully",
    "modifiedCount": 1
  }
  ```
- **Response Error (404 Not Found):**
  ```json
  {
    "error": "Course not found or access denied"
  }
  ```

---

## 8. Kurs Silme

- **Endpoint:** `DELETE /courses/{id}`
- **Description:** Kursu ve ilişkili tüm görevleri silme
- **Path Parameters:**
  - `id` (string, required) - Kurs ID'si
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Course and associated tasks deleted successfully",
    "deletedCourse": 1,
    "deletedTasks": 5
  }
  ```
- **Response Error (404 Not Found):**
  ```json
  {
    "error": "Course not found or access denied"
  }
  ```

---

## 9. Tüm Görevleri Listeleme

- **Endpoint:** `GET /tasks`
- **Description:** Tüm görevleri veya kursa özel görevleri listeleme
- **Authentication:** Bearer Token gerekli
- **Query Parameters (Opsiyonel):**
  - `courseId` (string) - Belirli bir kursun görevlerini filtreleme
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "count": 5,
    "courseId": "all",
    "tasks": [
      {
        "_id": "65f8a2b3c4d5e6f7g8h9i0j5",
        "userId": "65f8a2b3c4d5e6f7g8h9i0j1",
        "courseId": "65f8a2b3c4d5e6f7g8h9i0j2",
        "title": "Study Chapter 1",
        "deadline": "2024-03-20T10:00:00.000Z",
        "completed": false,
        "createdAt": "2024-03-15T10:40:00.000Z",
        "updatedAt": "2024-03-15T10:40:00.000Z"
      },
      {
        "_id": "65f8a2b3c4d5e6f7g8h9i0j6",
        "userId": "65f8a2b3c4d5e6f7g8h9i0j1",
        "courseId": "65f8a2b3c4d5e6f7g8h9i0j2",
        "title": "Complete Homework",
        "deadline": null,
        "completed": true,
        "createdAt": "2024-03-15T10:45:00.000Z",
        "updatedAt": "2024-03-15T11:00:00.000Z"
      }
    ]
  }
  ```

---

## 10. Yeni Görev Oluşturma

- **Endpoint:** `POST /tasks`
- **Description:** Yeni görev ekleme
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "title": "Read Chapter 3",
    "courseId": "65f8a2b3c4d5e6f7g8h9i0j2",
    "deadline": "2024-03-25T23:59:00.000Z"
  }
  ```
- **Validation:**
  - `title`: Zorunlu, boş olamaz
  - `courseId`: Zorunlu, geçerli kurs ID'si
  - `deadline`: Opsiyonel, ISO 8601 formatı
- **Response Success (201 Created):**
  ```json
  {
    "message": "Task created successfully",
    "task": {
      "_id": "65f8a2b3c4d5e6f7g8h9i0j7",
      "userId": "65f8a2b3c4d5e6f7g8h9i0j1",
      "courseId": "65f8a2b3c4d5e6f7g8h9i0j2",
      "title": "Read Chapter 3",
      "deadline": "2024-03-25T23:59:00.000Z",
      "completed": false,
      "createdAt": "2024-03-15T12:30:00.000Z",
      "updatedAt": "2024-03-15T12:30:00.000Z"
    }
  }
  ```

---

## 11. Görev Güncelleme

- **Endpoint:** `PUT /tasks/{id}`
- **Description:** Mevcut görevi güncelleme
- **Path Parameters:**
  - `id` (string, required) - Görev ID'si
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "title": "Updated Task Title",
    "courseId": "65f8a2b3c4d5e6f7g8h9i0j2",
    "deadline": "2024-03-26T23:59:00.000Z",
    "completed": false
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Task updated successfully",
    "modifiedCount": 1
  }
  ```

---

## 12. Görev Silme

- **Endpoint:** `DELETE /tasks/{id}`
- **Description:** Görevi silme
- **Path Parameters:**
  - `id` (string, required) - Görev ID'si
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Task deleted successfully",
    "deletedCount": 1
  }
  ```

---

## 13. Görevi Tamamlama (Complete)

- **Endpoint:** `PUT /tasks/{id}/complete`
- **Description:** Görevi tamamlandı olarak işaretleme
- **Path Parameters:**
  - `id` (string, required) - Görev ID'si
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Task marked as completed",
    "modifiedCount": 1
  }
  ```

---

## 14. Görev Durumunu Toggle (Alternatif)

- **Endpoint:** `PUT /tasks/{id}/toggle`
- **Description:** Görev durumunu tamamlandı/bekleyen arasında değiştirme
- **Path Parameters:**
  - `id` (string, required) - Görev ID'si
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Task marked as completed",
    "completed": true
  }
  ```

---

## 15. Görev Filtreleme

- **Endpoint:** `GET /tasks/filter`
- **Description:** Görevleri durum ve kursa göre filtreleme
- **Authentication:** Bearer Token gerekli
- **Query Parameters:**
  - `status` (string, opsiyonel) - `completed`, `pending`, veya `all`
  - `courseId` (string, opsiyonel) - Kurs ID'si
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Örnek URL:** `/api/tasks/filter?status=pending&courseId=65f8a2b3c4d5e6f7g8h9i0j2`
- **Response Success (200 OK):**
  ```json
  {
    "filter": {
      "status": "pending",
      "courseId": "65f8a2b3c4d5e6f7g8h9i0j2"
    },
    "count": 3,
    "tasks": [
      {
        "_id": "65f8a2b3c4d5e6f7g8h9i0j5",
        "title": "Study Chapter 1",
        "completed": false,
        "courseId": "65f8a2b3c4d5e6f7g8h9i0j2"
      }
    ]
  }
  ```

---

## 16. İstatistikleri Görüntüleme

- **Endpoint:** `GET /statistics`
- **Description:** Kullanıcının genel ilerleme istatistiklerini getirme
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "overall": {
      "totalCourses": 3,
      "totalTasks": 15,
      "completedTasks": 8,
      "pendingTasks": 7,
      "completionPercentage": 53,
      "dueSoon": 2,
      "overdue": 1
    },
    "courses": [
      {
        "courseId": "65f8a2b3c4d5e6f7g8h9i0j2",
        "courseName": "Mathematics",
        "courseColor": "#e44332",
        "totalTasks": 5,
        "completedTasks": 3,
        "pendingTasks": 2,
        "completionPercentage": 60
      },
      {
        "courseId": "65f8a2b3c4d5e6f7g8h9i0j3",
        "courseName": "Physics",
        "courseColor": "#54a0ff",
        "totalTasks": 4,
        "completedTasks": 2,
        "pendingTasks": 2,
        "completionPercentage": 50
      }
    ]
  }
  ```

---

## 17. Hızlı İstatistikler

- **Endpoint:** `GET /statistics/quick`
- **Description:** Özet istatistikleri hızlıca getirme
- **Authentication:** Bearer Token gerekli
- **Request Headers:**
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response Success (200 OK):**
  ```json
  {
    "totalCourses": 3,
    "totalTasks": 15,
    "completedTasks": 8,
    "pendingTasks": 7,
    "completionPercentage": 53
  }
  ```

---

## Postman Koleksiyonu

Postman'de test yapmak için aşağıdaki adımları izleyin:

### 1. Environment Variables
Postman'de bir Environment oluşturun ve şu değişkenleri ekleyin:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `https://studyplanner-2udh.onrender.com/api` | `https://studyplanner-2udh.onrender.com/api` |
| `token` | | (Boş bırakın, login sonrası otomatik doldurulacak) |

### 2. Test Script Örneği (Login)
Login request'in "Tests" tabına şunu ekleyin:

```javascript
// Token'ı environment variable'a kaydet
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### 3. Authorization Header
Diğer tüm request'ler için Authorization tab'ında:
- Type: `Bearer Token`
- Token: `{{token}}`

### 4. Test Sırası
1. `POST /auth/register` - Kayıt ol
2. `POST /auth/login` - Giriş yap (token otomatik kaydedilir)
3. Diğer endpoint'leri test et

---

## Hata Kodları

| Status Code | Anlamı | Örnek Durum |
|-------------|--------|-------------|
| `200 OK` | Başarılı GET/PUT/DELETE | Veri başarıyla getirildi/güncellendi/silindi |
| `201 Created` | Başarılı POST | Yeni kaynak oluşturuldu |
| `204 No Content` | Başarılı silme | İçerik dönülmedi |
| `400 Bad Request` | Geçersiz istek | Eksik veya hatalı parametreler |
| `401 Unauthorized` | Yetkisiz | Token eksik veya geçersiz |
| `403 Forbidden` | Yasak | Geçersiz token |
| `404 Not Found` | Bulunamadı | Kaynak mevcut değil |
| `409 Conflict` | Çakışma | Email zaten kullanımda |
| `500 Server Error` | Sunucu hatası | Beklenmeyen hata |

---

## Notlar

- Tüm tarihler ISO 8601 formatındadır (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- ObjectId'ler MongoDB'nin 24 karakterlik hex string formatındadır
- Token süresi 7 gündür (JWT expiration)
- Rate limiting: Dakikada 100 istek (Render free tier)
