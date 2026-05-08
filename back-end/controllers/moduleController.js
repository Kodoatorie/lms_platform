export class ModuleController {
    constructor(moduleService) {
        this.moduleService = moduleService;
    }
    create = async (req, res, next) => {
        try {
            const { title } = req.body;
            const { courseId } = req.params;
            const module = await this.moduleService.createModule(courseId, title, req.user.id, req.user.role);
            res.status(201).json(module);
        } catch (err) { next(err); }
    };
    getByCourse = async (req, res, next) => {
        try {
            const modules = await this.moduleService.getModulesByCourse(req.params.courseId);
            res.json(modules);
        } catch (err) { next(err); }
    };
    update = async (req, res, next) => {
        try {
            const module = await this.moduleService.updateModule(req.params.moduleId, req.body.title, req.body.orderIndex, req.user.id, req.user.role);
            res.json(module);
        } catch (err) { next(err); }
    };
    delete = async (req, res, next) => {
        try {
            await this.moduleService.deleteModule(req.params.moduleId, req.user.id, req.user.role);
            res.status(204).send();
        } catch (err) { next(err); }
    };
}