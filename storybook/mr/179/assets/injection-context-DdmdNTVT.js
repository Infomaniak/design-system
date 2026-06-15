import{i as e}from"./preload-helper-xPQekRTU.js";import{P as t,h as n,m as r,y as i}from"./iframe-Blohjb4L.js";import{t as a}from"./mdx-react-shim-DA-Pd3SM.js";function o(e){let t={blockquote:`blockquote`,code:`code`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,h4:`h4`,h5:`h5`,hr:`hr`,p:`p`,pre:`pre`,strong:`strong`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(r,{title:`Components/Helpers/InjectionContext`}),`
`,(0,c.jsx)(t.h1,{id:`injectioncontext`,children:`InjectionContext`}),`
`,(0,c.jsxs)(t.p,{children:[`An `,(0,c.jsx)(t.code,{children:`InjectionContext`}),` is a way to pass data to a component tree.`]}),`
`,(0,c.jsx)(t.h2,{id:`producer-perspective`,children:`Producer perspective`}),`
`,(0,c.jsxs)(t.p,{children:[`The producer is responsible for creating the `,(0,c.jsx)(t.code,{children:`InjectionContext`}),` and passing it to the children.`]}),`
`,(0,c.jsx)(t.h3,{id:`set-the-root-context`,children:`Set the root context`}),`
`,(0,c.jsxs)(t.p,{children:[`The `,(0,c.jsx)(t.strong,{children:`root`}),` `,(0,c.jsx)(t.code,{children:`InjectionContext`}),` is available globally. It is the terminal point when resolving a value.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`// example: setup the IconifyApi to point on the preprod environment
InjectionContext.root = new InjectionContext([
  ICONIFY_API.define(
    new IconifyApi({
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  ),
]);
`})}),`
`,(0,c.jsx)(t.p,{children:`It's optional, but you probably want to define it.`}),`
`,(0,c.jsx)(t.h3,{id:`set-a-context-starting-from-an-element`,children:`Set a context starting from an Element`}),`
`,(0,c.jsxs)(t.p,{children:[`An `,(0,c.jsx)(t.code,{children:`InjectionContext`}),` can be applied to any DOM element: the element itself, as well as every child (direct or indirect) of it, will inherit of this context.`]}),`
`,(0,c.jsxs)(t.p,{children:[`Multiple `,(0,c.jsx)(t.code,{children:`InjectionContext`}),` can be applied to different nodes in the DOM tree: a `,(0,c.jsx)(t.em,{children:`key`}),` (`,(0,c.jsx)(t.code,{children:`InjectionContext.get(node, key)`}),`) is resolved exploring the stating `,(0,c.jsx)(t.em,{children:`node`}),` itself, and each parent of it (or `,(0,c.jsx)(t.code,{children:`InjectionContext.root`}),` when `,(0,c.jsx)(t.code,{children:`document`}),` is reached), until a context with the matching key is found.`]}),`
`,(0,c.jsx)(t.h4,{id:`examples`,children:`Examples`}),`
`,(0,c.jsxs)(t.blockquote,{children:[`
`,(0,c.jsxs)(t.p,{children:[`NOTE: in the following examples, we'll assume that the DS exports a `,(0,c.jsx)(t.code,{children:`LOCALE`}),` of type `,(0,c.jsx)(t.code,{children:`InjectableValue`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h5,{id:`react`,children:`React`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`function MyComponent() {
  const ctx = useMemo(() => {
    return new InjectionContext([LOCALE.define('fr-FR')]);
  }, []);

  return (
    <div data-inject={ctx.id}>
      {/* every child will inherit the context of the parent */}
      <span>
        <esds-component />
      </span>
    </div>
  );
}
`})}),`
`,(0,c.jsx)(t.h5,{id:`angular`,children:`Angular`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`@Component({
  selector: 'my-component',
  // ...
})
export class ConsumerComponent {
  readonly ctx = new InjectionContext([LOCALE.define('fr-FR')]);
}
`})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<div [attr.data-inject]="ctx.id">
  <!-- every child will inherit the context of the parent -->
  <span>
    <esds-component />
  </span>
</div>
`})}),`
`,(0,c.jsx)(t.h5,{id:`lit`,children:`Lit`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`@customElement('my-component')
export class ConsumerComponent extends LitElement {
  readonly ctx = new InjectionContext([LOCALE.define('fr-FR')]);

  override render(): TemplateResult {
    return html\`
      <div data-inject="\${this.ctx.id}">
        <span>
          <esds-component />
        </span>
      </div>
    \`;
  }
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`consumer-perspective-ds-team`,children:`Consumer perspective (DS team)`}),`
`,(0,c.jsxs)(t.p,{children:[`The consumer is responsible for consuming the `,(0,c.jsx)(t.code,{children:`InjectionContext`}),`.`]}),`
`,(0,c.jsxs)(t.h3,{id:`create-an-injectablevalue`,children:[`Create an `,(0,c.jsx)(t.code,{children:`InjectableValue`})]}),`
`,(0,c.jsxs)(t.p,{children:[`The consummer starts by creating a `,(0,c.jsx)(t.code,{children:`InjectableValue`}),`: it is used by the `,(0,c.jsx)(t.strong,{children:`Producer`}),` to define injectable values, and by the `,(0,c.jsx)(t.strong,{children:`Consumer`}),` to read them.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`const LOCALE = new InjectableValue('locale');
`})}),`
`,(0,c.jsxs)(t.h3,{id:`readobserve-an-injectablevalue`,children:[`Read/Observe an `,(0,c.jsx)(t.code,{children:`InjectableValue`})]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`@customElement('esds-component')
export class ConsumerComponent extends LitElement {
  readonly #locale: Signal<string> = hostInject(this, LOCALE, (): string => navigator.language);

  override render(): TemplateResult {
    return html\`locale: \${this.#locale.get()}\`;
  }
}
`})}),`
`,(0,c.jsx)(t.hr,{}),`
`,(0,c.jsx)(t.h2,{id:`documentation`,children:`Documentation`}),`
`,(0,c.jsxs)(t.h3,{id:`class-injectablevalue`,children:[`class `,(0,c.jsx)(t.code,{children:`InjectableValue`})]}),`
`,(0,c.jsxs)(t.p,{children:[`This class is used to define injectable values with unique symbolic keys used by `,(0,c.jsx)(t.code,{children:`InjectionContext`}),`.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`class InjectableValue<GValue> {
  constructor(name: string);

  get key(): symbol;

  /**
   * Creates an \`InjectedEntry\` to use when constructing a new \`InjectionContext\`.
   */
  define(value: GValue): InjectedEntry<GValue>;
}
`})}),`
`,(0,c.jsxs)(t.h3,{id:`class-injectioncontext`,children:[`class `,(0,c.jsx)(t.code,{children:`InjectionContext`})]}),`
`,(0,c.jsx)(t.p,{children:`Represents a context for dependency injection. It allows for storing and retrieving values
associated with symbols, providing a mechanism for scoped dependency injection.`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`class InjectionContext {
  static root: InjectionContext | undefined;
  static readonly attributeName: 'data-inject';

  /**
   * Retrieves a value associated with the specified key from the nearest context within the provided node's hierarchy.
   */
  static get<GValue>(source: Node, key: InjectedKeyLike): GValue | undefined;

  constructor(entries?: InjectionContextEntries);

  get id(): string;

  /* MAP LIKE */
  get size(): number;
  has(key: InjectedKeyLike): boolean;
  get<GValue>(key: InjectedKeyLike): GValue | undefined;
  keys(): MapIterator<symbol>;
  values(): MapIterator<unknown>;
  entries(): MapIterator<InjectedEntry<unknown>>;
  [Symbol.iterator](): MapIterator<InjectedEntry<unknown>>;
}
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),n()}))();export{s as default};