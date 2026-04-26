# 📘 Technical Specification (Техническое задание)

## 🧩 Project: Online Learning Management Platform (LMS)

## 1. 📌 Overview

Проект представляет собой образовательную платформу (LMS — Learning Management System) для онлайн-школ, преподавателей и студентов. Система позволяет создавать курсы, обучать студентов, принимать домашние задания, оценивать прогресс и выдавать цифровые сертификаты.

Основная цель — создать масштабируемую SaaS-платформу для управления образовательным процессом.

---

## 2. 🎯 Goals

* Обеспечить полный цикл обучения: от записи на курс до получения сертификата
* Дать преподавателям инструменты для управления курсами и студентами
* Дать студентам удобный интерфейс обучения и отслеживания прогресса
* Обеспечить систему аналитики для обеих сторон

---

## 3. 👥 User Roles

### 👨‍🎓 Student (Студент)

* Просмотр курсов
* Прохождение уроков
* Отправка домашних заданий
* Просмотр оценок и прогресса
* Получение сертификатов

### 👨‍🏫 Teacher (Преподаватель)

* Создание и редактирование курсов
* Добавление лекций (видео/текст/практика)
* Проверка домашних заданий
* Выставление оценок
* Просмотр аналитики студентов

### 🛠 Admin (ПОКА НЕ НУЖНО!!!!!!!!!!!)

* Управление пользователями
* Управление платформой

---

## 4. 📚 Core Features

### 4.1 Courses System

* Создание курсов
* Структура курса:

  * Course → Modules → Lessons
* Типы контента:

  * Video (YouTube links)
  * Text lecture
  * Practice tasks

---

### 4.2 Assignments System

* Создание домашних заданий
* Отправка решений студентами
* Проверка и оценка преподавателем

---

### 4.3 Grading System

* Оценки за задания
* Балльная система
* Итоговая оценка курса

---

### 4.4 Certificates

* Автоматическая генерация PDF
* Имя студента + курс + дата
* Подпись преподавателя (digital)
* Возможность верификации (future feature)

---

### 4.5 Analytics

#### Student Analytics:

* Прогресс по курсам
* Выполненные задания
* Средний балл

#### Teacher Analytics:

* Активность студентов
* Процент завершения курсов
* Статистика по заданиям

---

### 4.6 Course Editor

* Создание и редактирование лекций
* Поддержка rich text / markdown
* Добавление видео ссылок
* Управление структурой курса

---

## 4.7 🧠 ML Monitoring System (AI Proctoring)

### 4.7.1 AI Code Detection System

* Анализ кода студента в реальном времени или при сдаче задания
* Определение:

  * использование AI-генерации (ChatGPT / Copilot-like patterns)
  * подозрительных паттернов копирования
  * similarity detection с внешними источниками
* Возможная интеграция:

  * AST-анализ кода
  * embeddings similarity search
  * plagiarism detection engine

---

### 4.7.2 Camera-Based Student Monitoring (Proctoring)

* Использование камеры во время обучения / экзамена
* Возможности:

  * отслеживание присутствия студента
  * detection: multiple faces / no face / looking away
  * фиксация подозрительного поведения
* ML задачи:

  * face detection
  * gaze tracking (направление взгляда)
  * anomaly detection в поведении

---

### 4.7.3 Privacy & Ethics Considerations

* обязательное согласие студента на мониторинг
* прозрачность использования данных
* хранение только метаданных (без постоянной записи видео — опционально)

---

## 5. 🗄️ Data Model (High-level)

### Основные сущности:

* User
* StudentProfile
* TeacherProfile
* Course
* Module
* Lesson
* Assignment
* Submission
* Grade
* Certificate
* Enrollment

---

## 6. 🧱 Architecture

### Frontend

* Next.js
* TypeScript
* SSR + Client Components

### Backend

* Node.js
* Express.js
* REST API

### Database

* PostgreSQL
* Partial JSON usage for flexible metadata (not core relations)

---

## 6.1 ⚡ Redis Infrastructure Layer

Redis используется как высокоскоростной in-memory слой для поддержки real-time функций, кэширования и фоновых задач.

### 6.1.1 📦 Caching Layer

* Кэширование часто запрашиваемых данных:

  * список курсов
  * структура курсов (modules → lessons)
  * профили пользователей
  * аналитика студентов и преподавателей
* Снижение нагрузки на PostgreSQL
* TTL-очистка устаревших данных

---

### 6.1.2 🔐 Session & Auth Layer

* Хранение сессий пользователей (опционально)
* Refresh tokens storage
* Blacklist JWT токенов (logout / revoke)

---

### 6.1.3 🚦 Rate Limiting & Security

* Ограничение запросов API (per user / IP)
* Защита ML endpoints и тяжелых операций
* Предотвращение abuse системы (особенно proctoring)

---

### 6.1.4 🧠 ML & Proctoring Runtime State

* Хранение временных данных:

  * состояние камеры (face detected / no face)
  * активность студента
  * текущая сессия экзамена
  * промежуточные результаты анализа кода
* Использование TTL для автоматического удаления данных

---

### 6.1.5 📡 Real-time Communication Layer

* Pub/Sub для WebSocket событий
* Live updates:

  * чат студент ↔ преподаватель
  * уведомления
  * мониторинг экзаменов

---

### 6.1.6 📊 Background Jobs Queue (BullMQ)

* Redis как брокер очередей задач:

  * генерация PDF сертификатов
  * анализ кода студентов (AI detection)
  * ML обработка видео/камеры
  * расчет аналитики

---

### 6.1.7 📈 Aggregations & Counters

* Быстрые метрики без SQL агрегаций:

  * leaderboard студентов
  * активность курсов
  * completion rate

---

## 7. 🔐 Authentication & Authorization

* JWT or session-based auth
* Role-based access control (RBAC):

  * student
  * teacher
  * admin

---

## 8. 📦 Non-Functional Requirements

* Scalable architecture
* Secure authentication
* Data consistency (PostgreSQL as source of truth)
* Modular backend structure

---

## 9. 🚀 Future Improvements

* Real-time chat between student and teacher
* AI assistant for grading / feedback
* Video hosting instead of YouTube links
* Mobile application
* Multi-school SaaS system (white-label)
* Certificate verification system (public links)

---

## 10. ⚠️ Risks

* Overcomplication of course editor
* Mixing business logic between frontend and backend
* Excessive JSON usage in database

---

## 11. 📌 Summary

Это LMS-платформа с SaaS-потенциалом, ориентированная на масштабирование онлайн-образования. Архитектура должна оставаться модульной, с четким разделением ответственности между frontend, backend и database layer.
