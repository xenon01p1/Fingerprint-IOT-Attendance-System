import AuthService from "../services/authService.js";
import type { Request, Response, NextFunction } from "express";
import {  LoginAdminInput, LoginAdminResponse } from "../schema/authSchema.js";

// Request<Params, ResBody, ReqBody, Query>

class AuthController {
    constructor(private authService: AuthService) {}

    // Change this to an arrow function!
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
}

export default AuthController;