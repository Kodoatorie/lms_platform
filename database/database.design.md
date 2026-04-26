# 🗄️ Проектирование базы данных (PostgreSQL)

## 🧩 Проект: Онлайн платформа обучения (LMS)

---

## 1. 📌 Общее описание

Данный документ описывает структуру базы данных образовательной платформы LMS.

Система построена на PostgreSQL и использует реляционную модель данных как основу. JSON используется только для хранения вспомогательных метаданных и не затрагивает основную бизнес-логику.

---

## 2. 🧠 Принципы проектирования

* PostgreSQL — источник истины (Single Source of Truth)
* Чёткая реляционная структура
* Минимальное использование JSON (только метаданные)
* Нормализация основных сущностей
* Готовность к масштабированию (SaaS модель)

---

## 3. 👤 Пользователи и авторизация

### users

Основная таблица пользователей системы.

* id (PK)
* email (unique)
* password_hash
* role (student | teacher | admin)
* created_at
* updated_at

---

### student_profiles

Дополнительные данные студента.

* id (PK)
* user_id (FK → users.id)
* full_name
* avatar_url
* metadata (JSON, опционально)

---

### teacher_profiles

Профиль преподавателя.

* id (PK)
* user_id (FK → users.id)
* full_name
* bio
* avatar_url

---

## 4. 📚 Система курсов

### courses

Основная сущность курса.

* id (PK)
* title
* description
* teacher_id (FK → users.id)
* created_at
* updated_at

---

### modules

Модули внутри курса.

* id (PK)
* course_id (FK → courses.id)
* title
* order_index

---

### lessons

Уроки внутри модулей.

* id (PK)
* module_id (FK → modules.id)
* title
* content_type (video | text | practice)
* content (TEXT)
* order_index

---

## 5. 🎓 Запись и прогресс обучения

### enrollments

Запись студента на курс.

* id (PK)
* user_id (FK → users.id)
* course_id (FK → courses.id)
* status (active | completed | dropped)
* progress_percent
* enrolled_at

---

### lesson_progress

Прогресс по отдельным урокам.

* id (PK)
* user_id (FK → users.id)
* lesson_id (FK → lessons.id)
* is_completed
* completed_at

---

## 6. 📝 Домашние задания

### assignments

Домашние задания.

* id (PK)
* lesson_id (FK → lessons.id)
* title
* description
* max_score
* created_at

---

### submissions

Ответы студентов.

* id (PK)
* assignment_id (FK → assignments.id)
* user_id (FK → users.id)
* content (текст или ссылка на файл)
* submitted_at

---

### grades

Оценивание работ.

* id (PK)
* submission_id (FK → submissions.id)
* score
* feedback
* graded_by (FK → users.id)
* graded_at

---

## 7. 🏆 Сертификаты

### certificates

Выдача сертификатов по завершению курса.

* id (PK)
* user_id (FK → users.id)
* course_id (FK → courses.id)
* issued_at
* pdf_url
* verification_code (уникальный)

---

## 8. 📊 Аналитика

### course_stats

Агрегированная статистика по курсу.

* id (PK)
* course_id (FK → courses.id)
* completion_rate
* average_score
* active_students_count
* updated_at

---

### user_stats

Статистика пользователя.

* id (PK)
* user_id (FK → users.id)
* total_courses
* completed_courses
* average_score
* updated_at

---

## 9. 🧠 ML / Proctoring система (будущее)

### proctoring_sessions

Сессии наблюдения (экзамены / контроль обучения).

* id (PK)
* user_id (FK → users.id)
* course_id (FK → courses.id)
* started_at
* ended_at
* status (active | ended | flagged)

---

### proctoring_events

События наблюдения.

* id (PK)
* session_id (FK → proctoring_sessions.id)
* event_type:

  * face_detected
  * no_face
  * multiple_faces
  * tab_switch
  * suspicious_behavior
* metadata (JSON)
* created_at

---

## 10. 🔐 Расширение авторизации

### refresh_tokens

Токены обновления сессий.

* id (PK)
* user_id (FK → users.id)
* token_hash
* expires_at
* created_at

---

## 11. 📌 Связи между сущностями

* users → courses (преподаватель создаёт курсы)
* courses → modules → lessons (иерархия курса)
* users → enrollments → courses (многие ко многим)
* lessons → assignments → submissions → grades
* users → certificates (по завершению курса)

---

## 12. 🚀 Примечания

* Основная логика строго реляционная
* JSON используется только для гибких данных
* ML/Proctoring вынесен в отдельный слой логики
* Схема подготовлена под дальнейшее масштабирование (Redis, очереди, ML сервисы)

---

## 💡 Итог

Ты спроектировал полноценную LMS-систему уровня SaaS, готовую к масштабированию и расширению в сторону ML и proctoring функционала.
