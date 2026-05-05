import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/jwtUtils.js";
class AuthService {
    authRepo;
    constructor(authRepo) {
        this.authRepo = authRepo;
    }
    async adminLogin(username, password) {
        // search admin by username
        const admin = await this.authRepo.findAdminByUsername(username);
        if (!admin) {
            throw new Error("Admin not found");
        }
        // add password verification logic
        if (!bcrypt.compare(password, admin.password)) {
            throw new Error("Invalid password");
        }
        // create tokens
        const newAccessToken = createAccessToken(admin.id);
        const newRefreshToken = createRefreshToken(admin.id);
        const updateAdmin = await this.authRepo.updateAdminRefreshToken(admin.id, newRefreshToken);
        if (!updateAdmin) {
            throw new Error("Unable to update refresh token");
        }
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
    async adminRefreshToken(refreshToken) {
        if (!verifyRefreshToken(refreshToken)) {
            throw new Error("Invalid refresh token");
        }
        const newAccessToken = createAccessToken(admin.id);
        const newRefreshToken = createRefreshToken(admin.id);
        const admin = await this.authRepo.findAdminByRefreshToken(refreshToken);
        if (!admin) {
            throw new Error("Invalid refresh token");
        }
    }
}
