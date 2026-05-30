export class ModuleService {
    constructor(moduleModel, courseModel) {
        this.moduleModel = moduleModel;
        this.courseModel = courseModel;
    }

    async createModule(courseId, title, currentUserId, userRole) {
        const course = await this.courseModel.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        const maxOrder = await this.moduleModel.getMaxOrderIndex(courseId);
        return this.moduleModel.create({ courseId, title, orderIndex: maxOrder + 1 });
    }

    async getModulesByCourse(courseId) {
        return this.moduleModel.findByCourse(courseId);
    }

    async updateModule(moduleId, title, orderIndex, currentUserId, userRole) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) throw new Error('Module not found');
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        return this.moduleModel.update(moduleId, { title, orderIndex });
    }

    async deleteModule(moduleId, currentUserId, userRole) {
        const module = await this.moduleModel.findById(moduleId);
        if (!module) throw new Error('Module not found');
        const course = await this.courseModel.findById(module.course_id);
        if (userRole !== 'admin' && Number(course.teacher_id) !== Number(currentUserId)) {
            throw new Error('Not authorized');
        }
        return this.moduleModel.delete(moduleId);
    }
}