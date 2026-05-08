// services/courseService.js
export class CourseService {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }

    async createCourse(data, teacherId) {
        return this.courseModel.create({ ...data, teacherId });
    }

    async getCourses(teacherId, requesterRole) {
        if (requesterRole === 'teacher' && teacherId) {
            return this.courseModel.findAll({ teacherId });
        }
        return this.courseModel.findAll(); // студент видит все
    }

    async getCourseById(courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        // TODO: загрузить модули и уроки (через отдельные модели)
        return course;
    }

    async updateCourse(courseId, updateData, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (role !== 'admin' && course.teacher_id !== userId) {
            throw new Error('Not authorized');
        }
        return this.courseModel.update(courseId, updateData);
    }

    async deleteCourse(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (role !== 'admin' && course.teacher_id !== userId) {
            throw new Error('Not authorized');
        }
        return this.courseModel.delete(courseId);
    }
}