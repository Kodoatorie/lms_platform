import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    postgresUri: process.env.POSTGRES_URI,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

    minio: {
        endPoint:  process.env.MINIO_ENDPOINT  || 'localhost',
        port:      parseInt(process.env.MINIO_PORT || '9000', 10),
        useSSL:    process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
        region:    process.env.MINIO_REGION     || 'us-east-1',
    },

    upload: {
        maxCoverSize:      5   * 1024 * 1024,   //   5 MB
        maxSubmissionSize: 50  * 1024 * 1024,   //  50 MB
        maxMaterialSize:   200 * 1024 * 1024,   // 200 MB

        allowedCoverTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        allowedMaterialTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/zip',
            'application/x-zip-compressed',
            'text/plain',
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/webm', 'video/ogg',
            'audio/mpeg', 'audio/ogg', 'audio/wav',
        ],
    },
};
