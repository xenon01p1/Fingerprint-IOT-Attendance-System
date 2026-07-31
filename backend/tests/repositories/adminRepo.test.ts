import AdminRepository from "../../src/repositories/adminRepo.js";

describe("AdminRepository", () => {

    const mockPrisma = {
        admin: {
            findMany: jest.fn(),
            count: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        }
    };

    const adminRepo = new AdminRepository(mockPrisma as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllAdmin", () => {
        it("should return admins with pagination when skip and take are provided", async () => {
            // arrange
            const skip = 0;
            const take = 10;
            const fakeAdmins = [
                { id: "1", username: "admin1", isDeleted: false },
                { id: "2", username: "admin2", isDeleted: false }
            ];

            mockPrisma.admin.findMany.mockResolvedValue(fakeAdmins as any);

            // act
            const result = await adminRepo.getAllAdmin(skip, take);

            // assert
            expect(mockPrisma.admin.findMany).toHaveBeenCalledWith({
                where: { isDeleted: false },
                skip: 0,
                take: 10
            });
            expect(result).toBe(fakeAdmins);
        });

        it("should return all admins without pagination when skip or take is omitted", async () => {
            // arrange
            const fakeAdmins = [
                { id: "1", username: "admin1", isDeleted: false }
            ];

            mockPrisma.admin.findMany.mockResolvedValue(fakeAdmins as any);

            // act
            const result = await adminRepo.getAllAdmin();

            // assert
            expect(mockPrisma.admin.findMany).toHaveBeenCalledWith({
                where: { isDeleted: false }
            });
            expect(result).toBe(fakeAdmins);
        });
    });

    describe("getAdminCount", () => {
        it("should return count of admin data", async () => {

            // arrange
            const fakeAdmin = {
                isDeleted: false
            };

            // act
            mockPrisma.admin.count.mockResolvedValue(fakeAdmin as any);
            const result = await adminRepo.getAdminCount();

            // assert
            expect(mockPrisma.admin.count).toHaveBeenCalledWith({
                where: fakeAdmin
            });
            expect(result).toBe(fakeAdmin);
        });
    });

    describe("getAdmin", () => {
        it("Should return one admin data", async() => {
            // arrange
            const fakeAdmin = {
                id: "1",
                isDeleted: false
            };

            // act
            mockPrisma.admin.findFirst.mockResolvedValue(fakeAdmin as any);
            const result = await adminRepo.getAdmin("1");

            // assert
            expect(mockPrisma.admin.findFirst).toHaveBeenCalledWith({
                where: fakeAdmin
            });
            expect(result).toBe(fakeAdmin);
        
        });
    });

    describe("createAdmin", () => {
        it("Should return one admin data", async() => {
            // arrange
            const fakeAdmin = {
                username: "admin",
                password: "password",
                email: "admin@example.com",
                phoneNumber: "1234567890"
            };

            // act
            mockPrisma.admin.create.mockResolvedValue(fakeAdmin as any);
            const result = await adminRepo.createAdmin(
                fakeAdmin.username,
                fakeAdmin.password,
                fakeAdmin.email,
                fakeAdmin.phoneNumber
            );

            // assert
            expect(mockPrisma.admin.create).toHaveBeenCalledWith({
                data: fakeAdmin
            });
            expect(result).toBe(fakeAdmin);
        
        });
    });

    describe("updateAdmin", () => {
        it("should update and return the updated admin data", async () => {
            // arrange
            const adminId = "1";
            const updateData = {
                username: "updatedAdmin",
                email: "updated@example.com"
            };
            const fakeUpdatedAdmin = {
                id: adminId,
                username: "updatedAdmin",
                email: "updated@example.com",
                phoneNumber: "1234567890",
                isDeleted: false
            };

            mockPrisma.admin.update.mockResolvedValue(fakeUpdatedAdmin as any);

            // act
            const result = await adminRepo.updateAdmin(adminId, updateData);

            // assert
            expect(mockPrisma.admin.update).toHaveBeenCalledWith({
                where: { id: adminId },
                data: updateData
            });
            expect(result).toBe(fakeUpdatedAdmin);
        });
    });

    describe("deleteAdmin", () => {
        it("should soft delete the admin by setting isDeleted to true", async () => {
            // arrange
            const adminId = "1";
            const fakeDeletedAdmin = {
                id: adminId,
                username: "admin",
                isDeleted: true
            };

            mockPrisma.admin.update.mockResolvedValue(fakeDeletedAdmin as any);

            // act
            const result = await adminRepo.deleteAdmin(adminId);

            // assert
            expect(mockPrisma.admin.update).toHaveBeenCalledWith({
                where: { id: adminId },
                data: { isDeleted: true }
            });
            expect(result).toBe(fakeDeletedAdmin);
        });
    });

});