export class LessonController {
    constructor(lessonService) {
        this.lessonService = lessonService;
    }

    create = async (req, res, next) => {
        try {
            const { moduleId } = req.params;
            const data = req.body;
            const lesson = await this.lessonService.createLesson(moduleId, data, req.user.id, req.user.role);
            res.status(201).json(lesson);
        } catch (err) {
            next(err);
        }
    };

    getByModule = async (req, res, next) => {
        try {
            const lessons = await this.lessonService.getLessonsByModule(req.params.moduleId);
            res.json(lessons);
        } catch (err) {
            next(err);
        }
    };

    update = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            const data = req.body;
            const lesson = await this.lessonService.updateLesson(lessonId, data, req.user.id, req.user.role);
            res.json(lesson);
        } catch (err) {
            next(err);
        }
    };

    delete = async (req, res, next) => {
        try {
            const { lessonId } = req.params;
            await this.lessonService.deleteLesson(lessonId, req.user.id, req.user.role);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    };
}