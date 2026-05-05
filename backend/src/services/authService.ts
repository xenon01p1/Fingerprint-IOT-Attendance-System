import bcrypt from "bcrypt";
import AuthRepository from "../repositories/authRepo.js";
import { 
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
} from "../utils/jwtUtils.js";


class AuthService {
    constructor(private authRepo: AuthRepository) {}

    async adminLoginService(username: string, password: string) {
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
        const newAccessToken = createAccessToken(admin.id, "admin");
        const newRefreshToken = createRefreshToken(admin.id, "admin");
        const updateAdmin = await this.authRepo.updateAdminRefreshToken(admin.id, newRefreshToken);

        if (!updateAdmin) {
            throw new Error("Unable to update refresh token");
        }  

        return {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            phoneNumber: admin.phoneNumber,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        };
    }

    async adminRefreshTokenService(refreshToken: string) {
        if (!verifyRefreshToken(refreshToken)) {
            throw new Error("Invalid refresh token");
        }

        const admin = await this.authRepo.findAdminByRefreshToken(refreshToken);
        if (!admin) {
            throw new Error("Admin not found");
        }

        const newAccessToken = createAccessToken(admin.id, "admin");
        const newRefreshToken = createRefreshToken(admin.id, "admin");

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
}

export default AuthService;