import { defineCollection } from 'astro:content';
import schema from 'starbook/schema';

export const collections = {
  docs: defineCollection({ schema }),
};
