// services/courseService.js
export class CourseService {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }

    async createCourse(data, teacherId) {
        return this.courseModel.create({ ...data, teacherId });
    }

    // FIX: search was undefined because it was never passed in — now it's the 3rd param
    async getCourses(teacherId, requesterRole, search) {
        if (requesterRole === 'teacher' && teacherId) {
            // Teacher sees only their own courses (published + draft)
            return this.courseModel.findAll({ teacherId, search, role: 'teacher' });
        }
        if (requesterRole === 'admin') {
            return this.courseModel.findAll({ search });
        }
        // Students see only published courses
        return this.courseModel.findAll({ search, role: 'student' });
    }

    async publishCourse(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }
        return this.courseModel.update(courseId, { is_published: true });
    }

    async unpublishCourse(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }
        return this.courseModel.update(courseId, { is_published: false });
    }

    async getCourseById(courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        return course;
    }

    async getCurriculum(courseId) {
        return this.courseModel.getCurriculum(courseId);
    }

    async updateCourse(courseId, updateData, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }
        return this.courseModel.update(courseId, updateData);
    }

    async deleteCourse(courseId, userId, role) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (role !== 'admin' && Number(course.teacher_id) !== Number(userId)) {
            throw new Error('Not authorized');
        }
        return this.courseModel.delete(courseId);
    }
}