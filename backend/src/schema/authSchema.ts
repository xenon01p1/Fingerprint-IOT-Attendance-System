import { z } from "zod";
import { BaseResponseSchema } from "./baseSchema.js";
import { AdminSchema, PublicAdminSchema } from "./adminSchema.js";

// ========================== Request Schema ==========================
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

export const refreshTokenSchema = AdminSchema.pick({
    refreshToken: true
});
export type refreshTokenInput = z.infer<typeof refreshTokenSchema>;


// ========================== Response Schema ==========================
export const LoginAdminResponseSchema = BaseResponseSchema(PublicAdminSchema);
export type LoginAdminResponse = z.infer<typeof LoginAdminResponseSchema>;

export const refreshTokenResponseSchema = BaseResponseSchema(AdminSchema.pick({
    accessToken: true,
    refreshToken: true
}));
export type refreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

