import { BaseResponseSchema } from "./baseSchema.js";
import { AdminSchema, PublicAdminSchema } from "./adminSchema.js";
// ========================== Request Schema ==========================
export const LoginAdminSchema = AdminSchema.pick({
    username: true,
    password: true
});
export const refreshTokenSchema = AdminSchema.pick({
    refreshToken: true
});
// ========================== Response Schema ==========================
export const LoginAdminResponseSchema = BaseResponseSchema(PublicAdminSchema);
export const refreshTokenResponseSchema = BaseResponseSchema(AdminSchema.pick({
    accessToken: true,
    refreshToken: true
}));
