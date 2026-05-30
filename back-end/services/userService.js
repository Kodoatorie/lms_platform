export class UserService {
    constructor(studentProfileModel, teacherProfileModel) {
        this.studentProfileModel = studentProfileModel;
        this.teacherProfileModel = teacherProfileModel;
    }

    async getProfile(userId) {
        // We try to fetch from student profiles first, then teacher
        let profile = await this.studentProfileModel.findByUserId(userId);
        if (profile) return { ...profile, role: 'student' };

        profile = await this.teacherProfileModel.findByUserId(userId);
        if (profile) return { ...profile, role: 'teacher' };

        throw new Error('Profile not found');
    }

    async updateProfile(userId, updates) {
        let profile = await this.studentProfileModel.findByUserId(userId);
        if (profile) {
            return await this.studentProfileModel.update(profile.id, updates);
        }

        profile = await this.teacherProfileModel.findByUserId(userId);
        if (profile) {
            return await this.teacherProfileModel.update(profile.id, updates);
        }

        throw new Error('Profile not found');
    }
}
