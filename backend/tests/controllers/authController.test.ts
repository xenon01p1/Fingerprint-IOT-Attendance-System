import AuthController from "../../src/controllers/authController.js";

describe("AuthController", () => {

    const mockService = {
        adminLoginService: jest.fn(),
        adminRefreshTokenService: jest.fn(),
    };

    const authController = new AuthController( mockService as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe("adminLoginController", () => {

        it("should login successfully", async () => {

            // fake service result
            const fakeLoginResult = {
                id: "1",
                username: "admin",
                email: "admin@test.com",
                accessToken: "access-token",
                refreshToken: "refresh-token",
            };


            mockService.adminLoginService
                .mockResolvedValue(fakeLoginResult);


            const req: any = {
                body: {
                    username: "admin",
                    password: "password123",
                },
            };


            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };


            const next = jest.fn();


            await authController.adminLoginController(
                req,
                res,
                next
            );


            expect(mockService.adminLoginService)
                .toHaveBeenCalledWith(
                    "admin",
                    "password123"
                );


            expect(res.status)
                .toHaveBeenCalledWith(200);


            expect(res.json)
                .toHaveBeenCalledWith({
                    status: true,
                    message: "Admin logged in successfully",
                    data: fakeLoginResult,
                });


            expect(next)
                .not.toHaveBeenCalled();

        });


        it("should call next when service throws error", async () => {

            const error = new Error(
                "Invalid password"
            );


            mockService.adminLoginService
                .mockRejectedValue(error);


            const req: any = {
                body: {
                    username: "admin",
                    password: "wrong-password",
                },
            };


            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };


            const next = jest.fn();


            await authController.adminLoginController(
                req,
                res,
                next
            );


            expect(next)
                .toHaveBeenCalledWith(error);

        });

    });



    describe("refreshTokenController", () => {


        it("should refresh token successfully", async () => {

            const fakeTokenResult = {
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
            };


            mockService.adminRefreshTokenService
                .mockResolvedValue(fakeTokenResult);


            // res, req, and next mimics the used object key values (or declared by express) in the controller function
            const req: any = {
                body: {
                    refreshToken: "old-refresh-token",
                },
            };


            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };


            const next = jest.fn();



            await authController.refreshTokenController(
                req,
                res,
                next
            );


            expect(mockService.adminRefreshTokenService)
                .toHaveBeenCalledWith(
                    "old-refresh-token"
                );


            expect(res.status)
                .toHaveBeenCalledWith(200);


            expect(res.json)
                .toHaveBeenCalledWith({
                    status: true,
                    message: "Renew token successfully",
                    data: fakeTokenResult,
                });


            expect(next)
                .not.toHaveBeenCalled();

        });



        it("should throw error when refresh token is missing", async () => {


            const req: any = {
                body: {},
            };


            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };


            const next = jest.fn();



            await authController.refreshTokenController(
                req,
                res,
                next
            );


            expect(next)
                .toHaveBeenCalled();

        });



        it("should call next when service throws error", async () => {


            const error = new Error(
                "Invalid refresh token"
            );


            mockService.adminRefreshTokenService
                .mockRejectedValue(error);



            const req: any = {
                body: {
                    refreshToken: "bad-token",
                },
            };


            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };


            const next = jest.fn();



            await authController.refreshTokenController(
                req,
                res,
                next
            );



            expect(next)
                .toHaveBeenCalledWith(error);

        });

    });

});