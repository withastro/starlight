import { z } from 'astro/zod';

export default z.object({
  title: z.string(),
  description: z.string().optional(),
});
