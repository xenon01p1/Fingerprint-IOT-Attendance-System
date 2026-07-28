import AuthService from "../../src/services/authService.js";
import bcrypt from "bcrypt";
import * as jwtUtils from "../../src/utils/jwtUtils.js";

jest.mock("bcrypt");
jest.mock("../../src/utils/jwtUtils.js", () => ({
    createAccessToken: jest.fn(),
    createRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
}));

describe("AuthService", () => {
    const mockRepo = {
        findAdminByUsername: jest.fn(),
        updateAdminRefreshToken: jest.fn(),
        findAdminByRefreshToken: jest.fn(),
    };
    // mockRepo: You created the object, so you can fill it with jest.fn() yourself.
    // bcrypt: You didn't create the object; Jest has to replace the imported module first.
    const authService = new AuthService(mockRepo as any);

    const fakeAdmin = {
        id: "1",
        username: "admin",
        password: "hashed-password",
        email: "admin@test.com",
        phoneNumber: "08123456789",
        refreshToken: "old-refresh-token",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("adminLoginService", () => {

        it("should login successfully", async () => {
            mockRepo.findAdminByUsername.mockResolvedValue(fakeAdmin);
            mockRepo.updateAdminRefreshToken.mockResolvedValue(fakeAdmin);

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            (jwtUtils.createAccessToken as jest.Mock)
                .mockReturnValue("access-token");

            (jwtUtils.createRefreshToken as jest.Mock)
                .mockReturnValue("refresh-token");

            const result = await authService.adminLoginService(
                "admin",
                "password123"
            );

            expect(result.username).toBe("admin");
            expect(result.accessToken).toBe("access-token");
            expect(result.refreshToken).toBe("refresh-token");

            expect(mockRepo.findAdminByUsername)
                .toHaveBeenCalledWith("admin");

            expect(mockRepo.updateAdminRefreshToken)
                .toHaveBeenCalledWith("1", "refresh-token");
        });

        it("should throw if admin does not exist", async () => {
            mockRepo.findAdminByUsername.mockResolvedValue(null);

            await expect(
                authService.adminLoginService("admin", "password123")
            ).rejects.toThrow("Admin not found");
        });

        it("should throw if password is invalid", async () => {
            mockRepo.findAdminByUsername.mockResolvedValue(fakeAdmin);

            (bcrypt.compare as jest.Mock)
                .mockResolvedValue(false);

            await expect(
                authService.adminLoginService("admin", "wrong-password")
            ).rejects.toThrow("Invalid password");
        });

        it("should throw if refresh token cannot be updated", async () => {
            mockRepo.findAdminByUsername.mockResolvedValue(fakeAdmin);

            (bcrypt.compare as jest.Mock)
                .mockResolvedValue(true);

            (jwtUtils.createAccessToken as jest.Mock)
                .mockReturnValue("access-token");

            (jwtUtils.createRefreshToken as jest.Mock)
                .mockReturnValue("refresh-token");

            mockRepo.updateAdminRefreshToken
                .mockResolvedValue(null);

            await expect(
                authService.adminLoginService("admin", "password123")
            ).rejects.toThrow("Unable to update refresh token");
        });

    });

    describe("adminRefreshTokenService", () => {

        it("should refresh token successfully", async () => {
            (jwtUtils.verifyRefreshToken as jest.Mock)
                .mockReturnValue(true);

            (jwtUtils.createAccessToken as jest.Mock)
                .mockReturnValue("new-access-token");

            (jwtUtils.createRefreshToken as jest.Mock)
                .mockReturnValue("new-refresh-token");

            mockRepo.findAdminByRefreshToken
                .mockResolvedValue(fakeAdmin);

            const result = await authService.adminRefreshTokenService(
                "valid-refresh-token"
            );

            expect(result.accessToken).toBe("new-access-token");
            expect(result.refreshToken).toBe("new-refresh-token");

            expect(mockRepo.findAdminByRefreshToken)
                .toHaveBeenCalledWith("valid-refresh-token");
        });

        it("should throw if refresh token is invalid", async () => {
            (jwtUtils.verifyRefreshToken as jest.Mock)
                .mockReturnValue(false);

            await expect(
                authService.adminRefreshTokenService("invalid-token")
            ).rejects.toThrow("Invalid refresh token");
        });

        it("should throw if admin is not found", async () => {
            (jwtUtils.verifyRefreshToken as jest.Mock)
                .mockReturnValue(true);

            mockRepo.findAdminByRefreshToken
                .mockResolvedValue(null);

            await expect(
                authService.adminRefreshTokenService("valid-token")
            ).rejects.toThrow("Admin not found");
        });

    });
});