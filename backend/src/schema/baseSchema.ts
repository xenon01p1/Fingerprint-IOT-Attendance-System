import { z } from "zod";

export const BaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
 return z.object({
    status: z.boolean(),
    message: z.string(),
    data: dataSchema.nullish()
 });
};