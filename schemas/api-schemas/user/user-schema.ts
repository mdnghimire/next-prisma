import { z } from "zod";

export const userschema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});
