import AuthRepository from "../../src/repositories/authRepo.js";

describe("AuthRepository", () => {

    const mockPrisma = {
        admin: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    };


    const authRepo = new AuthRepository(
        mockPrisma as any
    );


    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe("findAdminByUsername", () => {

        it("should find admin by username", async () => {

            const fakeAdmin = {
                id: "1",
                username: "admin",
                password: "hashed-password",
            };


            mockPrisma.admin.findUnique
                .mockResolvedValue(fakeAdmin);


            const result = await authRepo.findAdminByUsername(
                "admin"
            );


            expect(mockPrisma.admin.findUnique)
                .toHaveBeenCalledWith({
                    where: {
                        username: "admin",
                    },
                });


            expect(result)
                .toEqual(fakeAdmin);

        });

    });



    describe("findAdminByRefreshToken", () => {

        it("should find admin by refresh token", async () => {

            const fakeAdmin = {
                id: "1",
                username: "admin",
                refreshToken: "refresh-token",
            };


            mockPrisma.admin.findFirst
                .mockResolvedValue(fakeAdmin);


            const result = await authRepo.findAdminByRefreshToken(
                "refresh-token"
            );


            expect(mockPrisma.admin.findFirst)
                .toHaveBeenCalledWith({
                    where: {
                        refreshToken: "refresh-token",
                    },
                });


            expect(result)
                .toEqual(fakeAdmin);

        });

    });



    describe("updateAdminRefreshToken", () => {

        it("should update admin refresh token", async () => {

            const fakeAdmin = {
                id: "1",
                username: "admin",
                refreshToken: "new-refresh-token",
            };


            mockPrisma.admin.update
                .mockResolvedValue(fakeAdmin);


            const result = await authRepo.updateAdminRefreshToken(
                "1",
                "new-refresh-token"
            );


            expect(mockPrisma.admin.update)
                .toHaveBeenCalledWith({
                    where: {
                        id: "1",
                    },
                    data: {
                        refreshToken: "new-refresh-token",
                    },
                });


            expect(result)
                .toEqual(fakeAdmin);

        });

    });

});