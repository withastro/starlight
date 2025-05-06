declare module 'astro-icon/components' {
    import type { HTMLAttributes } from 'astro/types';
    
    interface IconProps extends HTMLAttributes<'svg'> {
      name: string;
      title?: string;
      desc?: string;
      size?: number | string;
      width?: number | string;
      height?: number | string;
    }
    
    const Icon: (props: IconProps) => any;
    export { Icon };
  }