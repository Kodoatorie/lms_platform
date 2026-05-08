export class LessonService {
    constructor(lessonModel, moduleModel, courseModel) {
        this.lessonModel = lessonModel;
        this.moduleModel = moduleModel;
        this.courseModel = courseModel;
    }

    async createLesson(moduleId, data, currentUserId, userRole) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) throw new Error('Module not found');
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && course.teacher_id !== currentUserId) {
            throw new Error('Not authorized');
        }
        const maxOrder = await this.lessonModel.getMaxOrderIndex(moduleId);
        return this.lessonModel.create({ ...data, moduleId, orderIndex: maxOrder + 1 });
    }

    async getLessonsByModule(moduleId) {
        return this.lessonModel.findByModule(moduleId);
    }

    async updateLesson(lessonId, data, currentUserId, userRole) {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) throw new Error('Lesson not found');
        const module = await this.moduleModel.findById(lesson.module_id);
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && course.teacher_id !== currentUserId) {
            throw new Error('Not authorized');
        }
        return this.lessonModel.update(lessonId, data);
    }

    async deleteLesson(lessonId, currentUserId, userRole) {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) throw new Error('Lesson not found');
        const module = await this.moduleModel.findById(lesson.module_id);
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && course.teacher_id !== currentUserId) {
            throw new Error('Not authorized');
        }
        return this.lessonModel.delete(lessonId);
    }
}