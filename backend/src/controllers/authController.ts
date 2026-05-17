import AuthService from "../services/authService.js";
import type { Request, Response, NextFunction } from "express";
import { 
    LoginAdminInput, 
    LoginAdminResponse,
    refreshTokenInput,
    refreshTokenResponse
} from "../schema/authSchema.js";

// Request<Params, ResBody, ReqBody, Query>

class AuthController {
    constructor(private authService: AuthService) {}

    adminLoginController = async (
        req: Request<{}, LoginAdminResponse, LoginAdminInput>,
        res: Response<LoginAdminResponse>,
        next: NextFunction
    ) => {
        try {
            const { username, password } = req.body;
            const login = await this.authService.adminLoginService(username, password);
            
            res.status(200).json({
                status: true,
                message: "Admin logged in successfully",
                data: login
            });
        } catch (error) {
            next(error);
        }
    }

    refreshTokenController = async (
        req: Request<{}, refreshTokenResponse, refreshTokenInput>,
        res: Response<refreshTokenResponse>,
        next: NextFunction
    ) => {
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
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;