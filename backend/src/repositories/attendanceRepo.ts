import { PrismaClient, Attendance } from "@prisma/client";

class AttendanceRepository {
    constructor(private prisma: PrismaClient) {}

    async getAllAttendance(skip?: number, take?: number): Promise<(Attendance & { employee: any; device: any })[] | null> {
        if (skip !== undefined && take !== undefined) {
            return this.prisma.attendance.findMany({
                skip,
                take,
                include: {
                    employee: {
                        select: {
                            id: true,
                            employeeNumber: true,
                            fullname: true,
                            username: true,
                            email: true
                        }
                    },
                    device: {
                        select: {
                            id: true,
                            name: true,
                            location: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        return this.prisma.attendance.findMany({
            include: {
                employee: {
                    select: {
                        id: true,
                        employeeNumber: true,
                        fullname: true,
                        username: true,
                        email: true
                    }
                },
                device: {
                    select: {
                        id: true,
                        name: true,
                        location: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getAttendanceCount(): Promise<number> {
        return this.prisma.attendance.count();
    }

    async getAttendance(attendanceId: string): Promise<(Attendance & { employee: any; device: any }) | null> {
        return this.prisma.attendance.findFirst({
            where: { id: attendanceId },
            include: {
                employee: {
                    select: {
                        id: true,
                        employeeNumber: true,
                        fullname: true,
                        username: true,
                        email: true
                    }
                },
                device: {
                    select: {
                        id: true,
                        name: true,
                        location: true
                    }
                }
            }
        });
    }

    async createAttendance(data: {
        type: "checkIn" | "checkOut";
        employeeId: string;
        deviceId?: string;
    }): Promise<(Attendance & { employee: any; device: any }) | null> {
        return this.prisma.attendance.create({
            data: data,
            include: {
                employee: {
                    select: {
                        id: true,
                        employeeNumber: true,
                        fullname: true,
                        username: true,
                        email: true
                    }
                },
                device: {
                    select: {
                        id: true,
                        name: true,
                        location: true
                    }
                }
            }
        });
    }
}

export default AttendanceRepository;
