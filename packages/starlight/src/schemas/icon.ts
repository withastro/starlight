import { z } from 'astro/zod';
import { Icons, type StarlightIcon } from '../components/Icons';

/** String that matches the name of one of Starlight’s built-in icons. */
export type IconUserConfig = StarlightIcon;

const iconNames = Object.keys(Icons) as [StarlightIcon, ...StarlightIcon[]];

export const IconSchema = () => z.enum(iconNames);
