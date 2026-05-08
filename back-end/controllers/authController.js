export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res, next) => {
        try {
            const { email, password, role, fullName } = req.body;
            const result = await this.authService.register(email, password, role, fullName);
            res.status(201).json(result);
        } catch (err) {
            next(err);  // Здесь err передаётся в errorHandler
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (err) {
            next(err);
        }
    };
    logout = async (req, res, next) => {
        try {
            const refreshToken = req.body.refreshToken;
            const accessToken = req.headers.authorization?.split(' ')[1];
            await this.authService.logout(refreshToken, accessToken);
            res.json({ message: 'Logged out' });
        } catch (err) {
            next(err);
        }
    };
    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refresh(refreshToken);
            res.json(tokens);
        } catch (err) {
            next(err);
        }
    };
    me = async (req, res) => {
        res.json(req.user);
    };
}