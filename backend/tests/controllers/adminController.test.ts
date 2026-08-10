import AdminController from '../../src/controllers/adminController.js';

describe("AdminController", () => {
    const mockService = {
        getAllAdminService: jest.fn(),
        getAdminService: jest.fn(),
        createAdminService: jest.fn(),
        updateAdminService: jest.fn(),
        deleteAdminService: jest.fn(),
    };

    const adminController = new AdminController(mockService as any);
    const fakeAdminData = {
        id: "1",
        username: "admin",
        email: "admin@gmail.com",
        phoneNumber: "1234567890",
        createdAt: new Date(),
        updatedAt: new Date()
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        data: jest.fn()
    }

    const next = jest.fn();

    describe("getAllAdminController", () => {

        const fakeGetAllAdminRes = {
            items: [
                fakeAdminData
            ],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalItems: 1,
                totalPages: 1
            }
        };

        it("Should return all admins data successfully", async() => {
            // assert
            const req: any = {
                query: {
                    page: "2",
                    pageSize: "20"
                }
            };

            // act
            mockService.getAllAdminService.mockResolvedValue(fakeGetAllAdminRes);
            const result = await adminController.getAllAdminController(req, res, next);

            // arrange
            expect(mockService.getAllAdminService).toHaveBeenCalledWith(2, 20);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Admins retrieved successfully",
                data: fakeGetAllAdminRes
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return all admins data with default pagination when no query params provided", async() => {
            // assert
            const req: any = {
                query: {}
            };

            // act
            mockService.getAllAdminService.mockResolvedValue(fakeGetAllAdminRes);
            const result = await adminController.getAllAdminController(req, res, next);

            // arrange
            expect(mockService.getAllAdminService).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Admins retrieved successfully",
                data: fakeGetAllAdminRes
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return successful even if no admin data found",async () => {
            // assert
            const fakeGetAllEmptyAdminRes = {
                items: [
                ],
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    totalItems: 1,
                    totalPages: 1
                }
            };

            const req: any = {
                query: {}
            };

            // act
            mockService.getAllAdminService.mockResolvedValue(fakeGetAllEmptyAdminRes);
            const result = await adminController.getAllAdminController(req, res, next);

            // arrange
            expect(mockService.getAllAdminService).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Admins retrieved successfully",
                data: fakeGetAllEmptyAdminRes
            });
            expect(next).not.toHaveBeenCalled();
        });
        
    });

    describe("getAdminController", () => {
        it("Should return single admin data successfully", async () => {
            // assert
            const req: any = {
                params: {
                    adminId: "1"
                }
            };

            // act
            mockService.getAdminService.mockResolvedValue(fakeAdminData);
            const result = await adminController.getAdminController(req, res, next);

            // arrange
            expect(mockService.getAdminService).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Admin retrieved successfully",
                data: fakeAdminData
            });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe("createAdminController", () => {
        it("Should create an admin successfully", async () => {
            const createInput = {
                username: "admin",
                password: "password123",
                email: "admin@gmail.com",
                phoneNumber: "1234567890"
            };

            const req: any = {
                body: createInput
            };

            mockService.createAdminService.mockResolvedValue(fakeAdminData);

            await adminController.createAdminController(req, res, next);

            expect(mockService.createAdminService).toHaveBeenCalledWith(
                createInput.username,
                createInput.password,
                createInput.email,
                createInput.phoneNumber
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Admin created successfully",
                data: fakeAdminData
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should call next(error) when service throws an error", async () => {
            const req: any = { body: {} };
            const error = new Error("Database error");

            mockService.createAdminService.mockRejectedValue(error);

            await adminController.createAdminController(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe("updateAdminController", () => {
        it("Should update an admin successfully", async () => {
            const updateInput = {
                username: "updatedAdmin",
                email: "updated@gmail.com"
            };

            const req: any = {
                params: { adminId: "1" },
                body: updateInput
            };

            const updatedAdminData = { ...fakeAdminData, ...updateInput };
            mockService.updateAdminService.mockResolvedValue(updatedAdminData);

            await adminController.updateAdminController(req, res, next);

            expect(mockService.updateAdminService).toHaveBeenCalledWith("1", updateInput);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Admin updated successfully",
                data: updatedAdminData
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should call next(error) when service throws an error", async () => {
            const req: any = {
                params: { adminId: "1" },
                body: {}
            };
            const error = new Error("Admin not found");

            mockService.updateAdminService.mockRejectedValue(error);

            await adminController.updateAdminController(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe("deleteAdminController", () => {
        it("Should delete an admin successfully", async () => {
            const req: any = {
                params: { adminId: "1" }
            };

            mockService.deleteAdminService.mockResolvedValue(fakeAdminData);

            await adminController.deleteAdminController(req, res, next);

            expect(mockService.deleteAdminService).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Admin deleted successfully",
                data: fakeAdminData
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should call next(error) when service throws an error", async () => {
            const req: any = {
                params: { adminId: "999" }
            };
            const error = new Error("Admin not found");

            mockService.deleteAdminService.mockRejectedValue(error);

            await adminController.deleteAdminController(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

});