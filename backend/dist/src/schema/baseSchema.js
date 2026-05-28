import { z } from "zod";
export const BaseResponseSchema = (dataSchema) => {
    return z.object({
        status: z.boolean(),
        message: z.string(),
        data: dataSchema.nullish()
    });
};
