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
        return this.courseModel.findAll();
    }

    async getCourseById(courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        return course;
    }

    async getCurriculum(courseId) {
        return await this.courseModel.getCurriculum(courseId);
    }

    async updateCourse(courseId, updateData, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        // FIX: JWT stores id as number but === comparison with DB integer fails
        // Use Number() on both sides to guarantee type-safe comparison
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }
        return this.courseModel.update(courseId, updateData);
    }

    async deleteCourse(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        // FIX: same type coercion fix as updateCourse
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }
        return this.courseModel.delete(courseId);
    }
}