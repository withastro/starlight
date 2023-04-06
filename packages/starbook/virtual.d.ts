declare module 'virtual:starbook/user-config' {
  const Config: import('./types').StarbookConfig;
  export default Config;
}
declare module 'virtual:starbook/project-context' {
  export default { root: string };
}
