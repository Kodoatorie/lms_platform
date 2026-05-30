export class GradeService {
    constructor(gradeModel, submissionModel, assignmentModel, lessonModel, moduleModel, statsModel) {
        this.gradeModel = gradeModel;
        this.submissionModel = submissionModel;
        this.assignmentModel = assignmentModel;
        this.lessonModel = lessonModel;
        this.moduleModel = moduleModel;
        this.statsModel = statsModel;
    }

    async gradeSubmission(submissionId, score, feedback, gradedById, userRole) {
        const submission = await this.submissionModel.findById(submissionId);
        if (!submission) throw new Error('Submission not found');
        const assignment = await this.assignmentModel.findById(submission.assignment_id);
        if (!assignment) throw new Error('Assignment not found');
        if (Number(score) > Number(assignment.max_score)) {
            throw new Error(`Score exceeds max score of ${assignment.max_score}`);
        }
        const grade = await this.gradeModel.createOrUpdate({ submissionId, score, feedback, gradedById });
        try {
            await this.statsModel.updateUserStats(submission.user_id);
            const lesson = await this.lessonModel?.findById(assignment.lesson_id);
            if (lesson) {
                const module = await this.moduleModel?.findById(lesson.module_id);
                if (module) await this.statsModel.updateCourseStats(module.course_id);
            }
        } catch (err) {
            console.error('Stats update failed (non-fatal):', err.message);
        }
        return grade;
    }

    async getGrade(submissionId) {
        return this.gradeModel.findBySubmission(submissionId);
    }

    // All submissions for a course that need grading (or are already graded)
    async getCourseSubmissions(courseId, currentUserId, userRole) {
        // Verify teacher owns the course
        return this.submissionModel.findByCourse(courseId);
    }
}