export class GradeService {
    constructor(gradeModel, submissionModel, assignmentModel, statsModel) {
        this.gradeModel = gradeModel;
        this.submissionModel = submissionModel;
        this.assignmentModel = assignmentModel;
        this.statsModel = statsModel;
    }

    async gradeSubmission(submissionId, score, feedback, gradedById, userRole) {
        const submission = await this.submissionModel.findById(submissionId);
        if (!submission) throw new Error('Submission not found');
        const assignment = await this.assignmentModel.findById(submission.assignment_id);
        if (score > assignment.max_score) throw new Error('Score exceeds max score');
        const grade = await this.gradeModel.createOrUpdate({ submissionId, score, feedback, gradedById });
        // Обновить статистику для студента и курса
        await this.statsModel.updateUserStats(submission.user_id);
        // Получим course_id для обновления статистики курса
        const lesson = await this.lessonModel?.findById(assignment.lesson_id);
        if (lesson && this.moduleModel) {
            const module = await this.moduleModel.findById(lesson.module_id);
            if (module) {
                await this.statsModel.updateCourseStats(module.course_id);
            }
        }
        return grade;
    }

    async getGrade(submissionId) {
        return this.gradeModel.findBySubmission(submissionId);
    }
}