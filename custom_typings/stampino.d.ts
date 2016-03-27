declare module 'stampino' {
  module stampino {
    interface RenderOptions {
      renderers?;
      handlers?;
      attributeHandler?;
      extends?;
    }

    function render(template: HTMLTemplateElement, container: Node,
        model: any, opts: RenderOptions);

    function getValue(value: string, scope);
  }
  export = stampino;
}
