import { mock } from "node:test";
import AdminService from "../../src/services/adminService.js";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("AdminService", () => {

    const mockRepo = {
        getAllAdmin: jest.fn(),
        getAdminCount: jest.fn(),
        getAdminById: jest.fn(),
        getAdmin: jest.fn(),
        createAdmin: jest.fn(),
        updateAdmin: jest.fn(),
        deleteAdmin: jest.fn()
    }

    const adminService = new AdminService(mockRepo as any);

    const fakeAdmin = {
        id: "1",
        username: "admin",
        email: "admin@gmail.com",
        phoneNumber: "08123456789",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
    }

    describe("getAllAdminService", () => {
        it("Should get all admins successfully", async () => {
            // arrange
            mockRepo.getAllAdmin.mockResolvedValue([
                fakeAdmin
            ]);

            mockRepo.getAdminCount.mockResolvedValue(1);

            // act
            const result = await adminService.getAllAdminService(1, 10);

            // assert
            expect(result).toEqual({
                items: [
                    {
                        id: "1",
                        username: "admin",
                        email: "admin@gmail.com",
                        phoneNumber: "08123456789",
                        createdAt: "2024-01-01T00:00:00.000Z",
                        updatedAt: "2024-01-01T00:00:00.000Z"
                    }
                ],
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    totalItems: 1,
                    totalPages: 1
                }
            });

            expect(mockRepo.getAllAdmin).toHaveBeenCalledWith(0, 10);
            expect(mockRepo.getAdminCount).toHaveBeenCalled();
        });


        it("Should throw error if admin data is invalid", async () => {
            // arrange
            mockRepo.getAllAdmin.mockResolvedValue(null);
            mockRepo.getAdminCount.mockResolvedValue(0);

            // act + assert
            await expect(
                adminService.getAllAdminService()
            ).rejects.toThrow("Failed to retrieve admin data");
        });
    });

    describe("getAdminService", () => {

        it("Should get admin successfully", async () => {
            // arrange
            mockRepo.getAdmin.mockResolvedValue(fakeAdmin);

            // act
            const result = await adminService.getAdminService(fakeAdmin.id);

            // assert
            expect(result).toEqual(fakeAdmin);

            expect(mockRepo.getAdmin).toHaveBeenCalledWith(
                fakeAdmin.id
            );
        });


        it("Should throw error if admin not found", async () => {
            // arrange
            mockRepo.getAdmin.mockResolvedValue(null);

            // act + assert
            await expect(
                adminService.getAdminService(fakeAdmin.id)
            ).rejects.toThrow("Admin data not found");
        });

    });

    describe("createAdminService", () => {

        it("Should create admin successfully", async () => {
            // arrange
            (bcrypt.hash as jest.Mock).mockResolvedValue(
                "hashedPassword"
            );

            mockRepo.createAdmin.mockResolvedValue({
                id: "1"
            });

            // act
            const result = await adminService.createAdminService(
                "admin",
                "123123",
                "admin@gmail.com",
                "08123456789"
            );

            // assert
            expect(result).toEqual({
                id: "1"
            });

            expect(bcrypt.hash).toHaveBeenCalledWith(
                "123123",
                10
            );

            expect(mockRepo.createAdmin).toHaveBeenCalledWith(
                "admin",
                "hashedPassword",
                "admin@gmail.com",
                "08123456789"
            );
        });


        it("Should throw error if create is unsuccessful", async () => {
            // arrange
            (bcrypt.hash as jest.Mock).mockResolvedValue(
                "hashedPassword"
            );

            mockRepo.createAdmin.mockResolvedValue(null);

            // act + assert
            await expect(
                adminService.createAdminService(
                    "admin",
                    "123123",
                    "admin@gmail.com",
                    "08123456789"
                )
            ).rejects.toThrow("Admin data not found");
        });

    });

    describe("updateAdminService", () => {
        
        const fakeAdminUpdate = {
            username: "admin",
            password: "123123",
            email: "admin@gmail.com",
            phoneNumber: "08123456789",
        }

        it("Should update admin successfully", async () => {
            // arrange
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

            mockRepo.updateAdmin.mockResolvedValue({
                id: "1"
            });

            // act
            const result = await adminService.updateAdminService(
                "1",
                fakeAdminUpdate
            );

            // assert
            expect(result).toEqual({
                id: "1"
            });

            expect(mockRepo.updateAdmin).toHaveBeenCalledWith(
                "1",
                {
                    username: "admin",
                    password: "hashedPassword",
                    email: "admin@gmail.com",
                    phoneNumber: "08123456789",
                }
            );
        });

        it("Should throw error if update is unsuccessful", async () => {
            // arrage
            mockRepo.updateAdmin.mockResolvedValue(null);

            // act + assert
            await expect(
                adminService.updateAdminService("1", fakeAdminUpdate)
            ).rejects.toThrow("Admin data not found");
        });
    });

    describe("deleteAdminService", () => {
        it("Should delete admin successfully", async () => {
            // arrange
            mockRepo.deleteAdmin.mockResolvedValue({
                id: fakeAdmin.id
            });

            // act
            const result = await adminService.deleteAdminService(
                fakeAdmin.id
            );

            // assert
            expect(result).toEqual({
                id: fakeAdmin.id
            });

            expect(mockRepo.deleteAdmin).toHaveBeenCalledWith(fakeAdmin.id);
        });

        it("Should throw error if delete is unsuccessful", async () => {
            // arrange
            mockRepo.deleteAdmin.mockResolvedValue(null);

            // act + assert
            await expect(
                adminService.deleteAdminService(fakeAdmin.id)
            ).rejects.toThrow("delete unsuccessful");
        });
    });
});