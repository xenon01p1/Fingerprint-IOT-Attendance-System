import { z } from "zod";
import { BaseResponseSchema } from "./baseSchema.js";

export const AdminSchema = z.object({
    id: z.string(),
    username: z.string().min(3).max(100),
    password: z.string().min(6),
    email: z.email(),
    phoneNumber: z.string().min(5).max(20),
    accessToken: z.string().nullable(),
    refreshToken: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const PublicAdminSchema = AdminSchema.pick({
    id: true,
    username: true,
    email: true,
    phoneNumber: true,
    accessToken: true,
    refreshToken: true,
    createdAt: true,
    updatedAt: true
});

// ========================== Login Admin request ==========================
export const LoginAdminSchema = AdminSchema.pick({
    username: true,
    password: true
});


/* 
   Behind the scenes, TypeScript now sees LoginAdminInput as:
   {
     username: string;
     password: string;
   }
*/
export type LoginAdminInput = z.infer<typeof LoginAdminSchema>;


// ========================== Login Admin response ==========================
export const LoginAdminResponseSchema = BaseResponseSchema(PublicAdminSchema);
export type LoginAdminResponse = z.infer<typeof LoginAdminResponseSchema>;

