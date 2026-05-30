import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import config from './config/index.js';
import { UserModel } from './models/userModel.js';
import { CourseModel } from './models/courseModel.js';
import { ModuleModel } from './models/moduleModel.js';
import { LessonModel } from './models/lessonModel.js';

dotenv.config();

const pool = new pg.Pool({ connectionString: config.postgresUri });

async function seed() {
    try {
        console.log('🌱 Starting database seed...');
        await pool.connect();

        const userModel = new UserModel(pool);
        const courseModel = new CourseModel(pool);
        const moduleModel = new ModuleModel(pool);
        const lessonModel = new LessonModel(pool);

        // Find or create a teacher
        let teacher = await userModel.findByEmail('teacher@example.com');
        if (!teacher) {
            const passwordHash = await bcrypt.hash('password123', 10);
            teacher = await userModel.create({
                email: 'teacher@example.com',
                passwordHash,
                fullName: 'John Doe (Teacher)',
                role: 'teacher'
            });
            console.log('✅ Created example teacher: teacher@example.com / password123');
        } else {
            console.log('✅ Found existing teacher:', teacher.email);
        }

        // Create Course 1
        const course1 = await courseModel.create({
            title: 'Fullstack Web Development Bootcamp',
            description: 'Learn to build fullstack web applications using React, Node.js, and PostgreSQL.',
            teacherId: teacher.id
        });
        console.log(`✅ Created Course: ${course1.title}`);

        // Course 1 - Module 1
        const c1m1 = await moduleModel.create({ courseId: course1.id, title: 'Frontend Basics', orderIndex: 1 });
        await lessonModel.create({
            moduleId: c1m1.id,
            title: 'HTML & CSS Fundamentals',
            contentType: 'video',
            content: 'In this video lesson, we will cover the basics of HTML5 and CSS3 styling techniques.',
            orderIndex: 1
        });
        await lessonModel.create({
            moduleId: c1m1.id,
            title: 'Responsive Design with Tailwind',
            contentType: 'text',
            content: 'Tailwind CSS allows you to rapidly build custom user interfaces. Read this guide to understand utility classes.',
            orderIndex: 2
        });

        // Course 1 - Module 2
        const c1m2 = await moduleModel.create({ courseId: course1.id, title: 'React JS', orderIndex: 2 });
        await lessonModel.create({
            moduleId: c1m2.id,
            title: 'React Components and Props',
            contentType: 'video',
            content: 'Understanding the building blocks of a React application.',
            orderIndex: 1
        });
        await lessonModel.create({
            moduleId: c1m2.id,
            title: 'State Management with Hooks',
            contentType: 'practice',
            content: 'Create a simple counter application using the useState hook.',
            orderIndex: 2
        });

        // Create Course 2
        const course2 = await courseModel.create({
            title: 'Introduction to Data Science',
            description: 'A beginner-friendly guide to data analysis and visualization using Python.',
            teacherId: teacher.id
        });
        console.log(`✅ Created Course: ${course2.title}`);

        // Course 2 - Module 1
        const c2m1 = await moduleModel.create({ courseId: course2.id, title: 'Python Basics', orderIndex: 1 });
        await lessonModel.create({
            moduleId: c2m1.id,
            title: 'Variables and Data Types',
            contentType: 'text',
            content: 'Learn about integers, floats, strings, and booleans in Python.',
            orderIndex: 1
        });

        console.log('🎉 Seed completed successfully!');
    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

seed();
