export class GradeController {
    constructor(gradeService) {
        this.gradeService = gradeService;
    }

    grade = async (req, res, next) => {
        try {
            const { submissionId } = req.params;
            const { score, feedback } = req.body;
            const grade = await this.gradeService.gradeSubmission(submissionId, score, feedback, req.user.id, req.user.role);
            res.json(grade);
        } catch (err) {
            next(err);
        }
    };

    getGrade = async (req, res, next) => {
        try {
            const { submissionId } = req.params;
            const grade = await this.gradeService.getGrade(submissionId);
            res.json(grade);
        } catch (err) {
            next(err);
        }
    };
}