// Request<Params, ResBody, ReqBody, Query>
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    adminLoginController = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const login = await this.authService.adminLoginService(username, password);
            res.status(200).json({
                status: true,
                message: "Admin logged in successfully",
                data: login
            });
        }
        catch (error) {
            next(error);
        }
    };
    refreshTokenController = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new Error("Refresh token is required");
            }
            const renewRefreshToken = await this.authService.adminRefreshTokenService(refreshToken);
            res.status(200).json({
                status: true,
                message: "Renew token successfully",
                data: renewRefreshToken
            });
        }
        catch (error) {
            next(error);
        }
    };
}
export default AuthController;
