declare module 'mixwith' {
  function mix(o): MixinBuilder;

  interface MixinBuilder {
    with(...args: any[]);
  }
}
