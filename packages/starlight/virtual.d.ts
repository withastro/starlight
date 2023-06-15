declare module 'virtual:starlight/user-config' {
  const Config: import('./types').StarlightConfig;
  export default Config;
}
declare module 'virtual:starlight/project-context' {
  const Config: import('astro').AstroConfig;
  export default Config;
}

declare module 'virtual:starlight/user-css' {}

declare module 'virtual:starlight/user-images' {
  type ImageMetadata = import('astro').ImageMetadata;
  export const logos: {
    dark?: ImageMetadata;
    light?: ImageMetadata;
  };
}
