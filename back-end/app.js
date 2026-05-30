// app.js
import express from 'express';
import pg from 'pg';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import config from './config/index.js';
import { initRedis } from './lib/redis.js';
import { setupWorkers } from './lib/queues.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { limiter } from './middlewares/rateLimiter.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { roleMiddleware } from './middlewares/roleMiddleware.js';
import { cacheMiddleware } from './middlewares/cacheMiddleware.js';

// Models
import { UserModel } from './models/userModel.js';
import { RefreshTokenModel } from './models/refreshTokenModel.js';
import { StudentProfileModel } from './models/studentProfileModel.js';
import { TeacherProfileModel } from './models/teacherProfileModel.js';
import { CourseModel } from './models/courseModel.js';
import { ModuleModel } from './models/moduleModel.js';
import { LessonModel } from './models/lessonModel.js';
import { EnrollmentModel } from './models/enrollmentModel.js';
import { LessonProgressModel } from './models/lessonProgressModel.js';
import { AssignmentModel } from './models/assignmentModel.js';
import { SubmissionModel } from './models/submissionModel.js';
import { GradeModel } from './models/gradeModel.js';
import { CertificateModel } from './models/certificateModel.js';
import { StatsModel } from './models/statsModel.js';
import { ProctoringModel } from './models/proctoringModel.js';
import { ReviewModel } from './models/reviewModel.js';

// Services
import { AuthService } from './services/authService.js';
import { CourseService } from './services/courseService.js';
import { ModuleService } from './services/moduleService.js';
import { LessonService } from './services/lessonService.js';
import { EnrollmentService } from './services/enrollmentService.js';
import { AssignmentService } from './services/assignmentService.js';
import { SubmissionService } from './services/submissionService.js';
import { GradeService } from './services/gradeService.js';
import { CertificateService } from './services/certificateService.js';
import { AnalyticsService } from './services/analyticsService.js';
import { UserService } from './services/userService.js';
import { ProctoringService } from './services/proctoringService.js';
import { ReviewService } from './services/reviewService.js';

// Controllers
import { AuthController } from './controllers/authController.js';
import { CourseController } from './controllers/courseController.js';
import { ModuleController } from './controllers/moduleController.js';
import { LessonController } from './controllers/lessonController.js';
import { EnrollmentController } from './controllers/enrollmentController.js';
import { AssignmentController } from './controllers/assignmentController.js';
import { SubmissionController } from './controllers/submissionController.js';
import { GradeController } from './controllers/gradeController.js';
import { CertificateController } from './controllers/certificateController.js';
import { AnalyticsController } from './controllers/analyticsController.js';
import { UserController } from './controllers/userController.js';
import { ProctoringController } from './controllers/proctoringController.js';
import { ReviewController } from './controllers/reviewController.js';
import { StudentController } from './controllers/studentController.js';

// Routes
import { createAuthRouter } from './routes/authRoutes.js';
import { createCourseRouter } from './routes/courseRoutes.js';
import { createModuleRouter } from './routes/moduleRoutes.js';
import { createLessonRouter } from './routes/lessonRoutes.js';
import { createEnrollmentRouter } from './routes/enrollmentRoutes.js';
import { createAssignmentRouter } from './routes/assignmentRoutes.js';
import { createSubmissionRouter } from './routes/submissionRoutes.js';
import { createGradeRouter } from './routes/gradeRoutes.js';
import { createCertificateRouter } from './routes/certificateRoutes.js';
import { createAnalyticsRouter } from './routes/analyticsRoutes.js';
import { createUserRouter } from './routes/userRoutes.js';
import { createProctoringRouter } from './routes/proctoringRoutes.js';
import { createReviewRouter } from './routes/reviewRoutes.js';
import { createStudentRouter } from './routes/studentRoutes.js';


dotenv.config();

const app = express();

// Security and parsing middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Serve static files
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection pool
const pool = new pg.Pool({ connectionString: config.postgresUri });
let redisClient;

async function startServer() {
    try {
        // Connect PostgreSQL
        await pool.connect();
        console.log('✅ PostgreSQL connected');

        // Connect Redis and attach to app
        redisClient = await initRedis(app);
        console.log('✅ Redis ready');

        // Initialize all models
        const userModel = new UserModel(pool);
        const refreshTokenModel = new RefreshTokenModel(pool);
        const studentProfileModel = new StudentProfileModel(pool);
        const teacherProfileModel = new TeacherProfileModel(pool);
        const courseModel = new CourseModel(pool);
        const moduleModel = new ModuleModel(pool);
        const lessonModel = new LessonModel(pool);
        const enrollmentModel = new EnrollmentModel(pool);
        const lessonProgressModel = new LessonProgressModel(pool);
        const assignmentModel = new AssignmentModel(pool);
        const submissionModel = new SubmissionModel(pool);
        const gradeModel = new GradeModel(pool);
        const certificateModel = new CertificateModel(pool);
        const statsModel = new StatsModel(pool);
        const proctoringModel = new ProctoringModel(pool);

        // Services
        const authService = new AuthService(userModel, refreshTokenModel, studentProfileModel, teacherProfileModel, redisClient);
        const courseService = new CourseService(courseModel);
        const moduleService = new ModuleService(moduleModel, courseModel);
        const lessonService = new LessonService(lessonModel, moduleModel, courseModel);
        // EnrollmentService needs access to lessonProgressModel, courseModel, userModel, statsModel, and also lessonModel/moduleModel for progress calculation.
        // Pass pool to EnrollmentService for custom queries if needed, or refactor. Let's provide necessary dependencies.
        // We'll pass lessonModel and moduleModel as well.
        const enrollmentService = new EnrollmentService(
            enrollmentModel, lessonProgressModel, courseModel, userModel, statsModel,
            lessonModel, moduleModel, pool  // pool for complex queries (total lessons)
        );
        const assignmentService = new AssignmentService(assignmentModel, lessonModel, moduleModel, courseModel);
        const submissionService = new SubmissionService(submissionModel, assignmentModel, lessonModel, moduleModel, courseModel);
        const gradeService = new GradeService(
            gradeModel, submissionModel, assignmentModel,
            lessonModel, moduleModel, statsModel   // <-- added lessonModel, moduleModel
        );

        const certificateService = new CertificateService(certificateModel, enrollmentModel, courseModel, userModel, studentProfileModel);
        const analyticsService = new AnalyticsService(statsModel, enrollmentModel, gradeModel, assignmentModel, courseModel);
        const userService = new UserService(studentProfileModel, teacherProfileModel);
        const proctoringService = new ProctoringService(proctoringModel);

        // Controllers
        const authController = new AuthController(authService);
        const courseController = new CourseController(courseService);
        const moduleController = new ModuleController(moduleService);
        const lessonController = new LessonController(lessonService);
        const enrollmentController = new EnrollmentController(enrollmentService);
        const assignmentController = new AssignmentController(assignmentService);
        const submissionController = new SubmissionController(submissionService);
        const gradeController = new GradeController(gradeService);
        const certificateController = new CertificateController(certificateService);
        const analyticsController = new AnalyticsController(analyticsService);
        const userController = new UserController(userService);
        const proctoringController = new ProctoringController(proctoringService);

        // Reviews
        const reviewModel = new ReviewModel(pool);
        const reviewService = new ReviewService(reviewModel, enrollmentModel);
        const reviewController = new ReviewController(reviewService);
        const studentController = new StudentController(studentProfileModel, courseModel);


        // Routes
app.use('/api/auth', createAuthRouter(authController));
app.use('/api/courses', createCourseRouter(courseController));
app.use('/api', createModuleRouter(moduleController));
app.use('/api', createLessonRouter(lessonController));
app.use('/api', createEnrollmentRouter(enrollmentController));
app.use('/api', createAssignmentRouter(assignmentController));
app.use('/api', createSubmissionRouter(submissionController));
app.use('/api', createReviewRouter(reviewController));
app.use('/api', createStudentRouter(studentController));
app.use('/api', createGradeRouter(gradeController));
app.use('/api', createCertificateRouter(certificateController));
app.use('/api', createAnalyticsRouter(analyticsController));
app.use('/api', createUserRouter(userController));
app.use('/api', createProctoringRouter(proctoringController));

        // Health check
        app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

        // Global error handler (must be last)
        app.use(errorHandler);

        // Start workers (BullMQ)
        setupWorkers(pool);
        console.log('🚀 BullMQ workers started');

        // Start server
        const server = app.listen(config.port, () => {
            console.log(`🚀 Server listening on port ${config.port}`);
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`${signal} received, closing server...`);
            server.close(async () => {
                console.log('HTTP server closed');
                await pool.end();
                console.log('PostgreSQL pool closed');
                if (redisClient) await redisClient.quit();
                console.log('Redis disconnected');
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();

export default app;