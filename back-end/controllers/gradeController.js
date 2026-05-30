export class GradeController {
    constructor(gradeService) {
        this.gradeService = gradeService;
    }

    grade = async (req, res, next) => {
        try {
            const { submissionId } = req.params;
            const { score, feedback } = req.body;
            const grade = await this.gradeService.gradeSubmission(
                submissionId, score, feedback, req.user.id, req.user.role
            );
            res.json(grade);
        } catch (err) { next(err); }
    };

    getGrade = async (req, res, next) => {
        try {
            const grade = await this.gradeService.getGrade(req.params.submissionId);
            res.json(grade);
        } catch (err) { next(err); }
    };

    // GET /api/courses/:courseId/submissions — all submissions for grading
    getCourseSubmissions = async (req, res, next) => {
        try {
            const submissions = await this.gradeService.getCourseSubmissions(
                req.params.courseId, req.user.id, req.user.role
            );
            res.json(submissions);
        } catch (err) { next(err); }
    };
}