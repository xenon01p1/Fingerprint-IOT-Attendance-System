import { Param } from '@prisma/client/runtime/library';
import DeviceController from '../../src/controllers/deviceController.js';

describe("deviceController", () => {
    const mockService = {
        getAllDevicesService: jest.fn(),
        createDeviceService: jest.fn(),
        updateDeviceService: jest.fn(),
        deleteDeviceService: jest.fn()
    }

    const deviceController = new DeviceController(mockService as any);
    const fakeDeviceData = {
        id: 1,
        name: "Piece of shit",
        address: "address1",
        location: "location1",
        createdAt: "address1",
        updatedAt: new Date(),
        companyId: 1,
        isDeleted: false
    }

    beforeEach(() => jest.clearAllMocks());

    const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        data: jest.fn()
    };
    const next = jest.fn();

    describe("getAllDevicesController", () => {
        const fakeFetchData = {
            items: fakeDeviceData,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalItems: 1,
                totalPages: 10
            }
        }

        it("Should return all data pagination successfully", async() => {
            // assert
            const req: any = {
                query: {
                    page: 1,
                    pageSize: 10
                }
            };

            // act
            mockService.getAllDevicesService.mockResolvedValue(fakeFetchData);
            const result = await deviceController.getAllDevicesController(req, res, next);

            // arrange
            expect(mockService.getAllDevicesService).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Devices retrieved successfully",
                data: fakeFetchData
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return successful with empty data", async() => {
            // assert
            const fakeFetchEmptyData = {
                items: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    totalItems: 1,
                    totalPages: 10
                }
            };

            const req: any = {
                query: {
                    page: 1,
                    pageSize: 10
                }
            };

            // act
            mockService.getAllDevicesService.mockResolvedValue(fakeFetchEmptyData);
            const result = await deviceController.getAllDevicesController(req, res, next);

            // arrange
            expect(mockService.getAllDevicesService).toHaveBeenCalledWith(1, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Devices retrieved successfully",
                data: fakeFetchEmptyData
            });
            expect(next).not.toHaveBeenCalled()
        });
    })


    describe("createDeviceController", () => {
        it("Should ccreate device data successfully", async() => {
            // assert
            const fakeCreateDevice = {
                name: "device 1",
                address: "address1",
                location: "location1",
                companyId: 1
            };

            const req: any = {
                body: fakeCreateDevice
            }

            // act
            mockService.createDeviceService.mockResolvedValue(fakeCreateDevice);
            const result = await deviceController.createDeviceController(req, res, next);

            // arrange
            expect(mockService.createDeviceService).toHaveBeenCalledWith(fakeCreateDevice);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                message: "Device created successfully",
                data: { id: fakeCreateDevice }
                // this one
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return error when service fails", async() => {
            // assert
            const req: any = { body: {}};
            const fakeError = new Error("Database Error");

            // act
            mockService.createDeviceService.mockRejectedValue(fakeError);
            await deviceController.createDeviceController(req, res, next);

            // arrange
            expect(next).toHaveBeenCalledWith(fakeError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        })
    })


    describe("updateDeviceController", () => {
        it("Should update device successfully", async () => {
            // Arrange
            const fakeUpdateData = {
                name: "Updated device",
                address: "address1",
                location: "location1",
                companyId: 1
            };

            const req: any = {
                params: {
                    deviceId: "1"
                },
                body: fakeUpdateData
            };

            mockService.updateDeviceService.mockResolvedValue(1);

            // Act
            await deviceController.updateDeviceController(req, res, next);

            // Assert
            expect(mockService.updateDeviceService)
                .toHaveBeenCalledWith("1", fakeUpdateData);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    status: true,
                    message: "Device updated successfully",
                    data: {
                        id: 1
                    }
                });

            expect(next)
                .not.toHaveBeenCalled();
        });

        it("Should call next(error) when service fails", async() => {
            const req: any = {
                body: {},
                params: {}
            };

            const fakeError = new Error("Database Error");

            mockService.updateDeviceService.mockRejectedValue(fakeError);
            await deviceController.updateDeviceController(req, res, next);

            expect(next).toHaveBeenCalledWith(fakeError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();

        });
    });

    describe("deleteDeviceController", () => {
        it("Should delete device successfully", async () => {
            // Arrange
            const req: any = {
                params: {
                    deviceId: "1"
                }
            };

            mockService.deleteDeviceService.mockResolvedValue(1);

            // Act
            await deviceController.deleteDeviceController(req, res, next);

            // Assert
            expect(mockService.deleteDeviceService)
                .toHaveBeenCalledWith("1");

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({
                    status: true,
                    message: "Device deleted successfully",
                    data: {
                        id: 1
                    }
                });

            expect(next)
                .not.toHaveBeenCalled();
        });
    });


});