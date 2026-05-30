export class EnrollmentService {
    constructor(enrollmentModel, lessonProgressModel, courseModel, userModel, statsModel, lessonModel, moduleModel, pool) {
        this.enrollmentModel = enrollmentModel;
        this.lessonProgressModel = lessonProgressModel;
        this.courseModel = courseModel;
        this.userModel = userModel;
        this.statsModel = statsModel;
        this.lessonModel = lessonModel;
        this.moduleModel = moduleModel;
        this.pool = pool;
    }

    async enrollUser(userId, courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        const enrollment = await this.enrollmentModel.enroll(userId, courseId);
        return enrollment;
    }

    async getUserCourses(userId) {
        return this.enrollmentModel.findByUser(userId);
    }

    async completeLesson(userId, lessonId) {
        const progress = await this.lessonProgressModel.complete(userId, lessonId);
        // Обновить прогресс курса
        const lesson = await this.lessonModel?.findById(lessonId);
        if (lesson) {
            const module = await this.moduleModel?.findById(lesson.module_id);
            if (module) {
                // Вычисление процента: сколько всего уроков в курсе, сколько завершено
                const totalLessonsRes = await this.pool.query(
                    `SELECT COUNT(*) FROM lessons l 
                     JOIN modules m ON l.module_id = m.id 
                     WHERE m.course_id = $1`,
                    [module.course_id]
                );
                const totalLessons = parseInt(totalLessonsRes.rows[0].count, 10);
                const completedLessons = await this.lessonProgressModel.getCompletedLessonIdsByUserAndCourse(userId, module.course_id);
                const percent = totalLessons ? Math.floor((completedLessons.length / totalLessons) * 100) : 0;
                await this.enrollmentModel.updateProgress(userId, module.course_id, percent);
                if (percent === 100) {
                    await this.enrollmentModel.updateStatus(userId, module.course_id, 'completed');
                    // Триггер генерации сертификата
                    try {
                        const { addCertificateJob } = await import('../lib/queues.js');
                        await addCertificateJob(userId, module.course_id);
                    } catch (err) {
                        console.error('Failed to add certificate job:', err);
                    }
                }
            }
        }
        return progress;
    }

    async getCourseProgress(userId, courseId) {
        const enrollment = await this.enrollmentModel.findOne(userId, courseId);
        if (!enrollment) throw new Error('Not enrolled');
        return { progressPercent: enrollment.progress_percent, status: enrollment.status };
    }
}