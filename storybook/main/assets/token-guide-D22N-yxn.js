import{i as e}from"./preload-helper-xPQekRTU.js";import{T as t,a as n,o as r,u as i}from"./iframe-FXYrvzZP.js";import{t as a}from"./mdx-react-shim-DrZX9kmu.js";function o(e){let t={a:`a`,br:`br`,code:`code`,div:`div`,em:`em`,h2:`h2`,h3:`h3`,h4:`h4`,h5:`h5`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...i(),...e.components},{Table:r}=t;return r||c(`Table`,!0),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n,{title:`Design Tokens/Getting Started`}),`
`,(0,l.jsxs)(`div`,{className:`welcome-section`,children:[(0,l.jsx)(`h1`,{children:`Design Tokens`}),(0,l.jsx)(`p`,{className:`welcome-description`,children:(0,l.jsx)(t.p,{children:`Our design system is powered by design tokens: name-value pairs that define the visual language
of Infomaniak products. Tokens ensure consistency across platforms while remaining flexible
enough for different contexts.`})})]}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#token-architecture`,children:`Token Architecture`})}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.a,{href:`#consuming-tokens`,children:`Consuming Tokens`}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.a,{href:`#web`,children:`Web`}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#install-from-npm`,children:`Install from NPM`})}),`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#css-files`,children:`CSS Files`})}),`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#loading-themes-root-files`,children:`Loading Themes (.root files)`})}),`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#using-modifiers-attr-files`,children:`Using Modifiers (.attr files)`})}),`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#tailwind-css`,children:`Tailwind CSS`})}),`
`]}),`
`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.a,{href:`#ios`,children:`iOS`}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#installation`,children:`Installation`})}),`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#usage`,children:`Usage`})}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.a,{href:`#how-it-works`,children:`How It Works`}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#token-resolution-chain`,children:`Token Resolution Chain`})}),`
`,(0,l.jsx)(t.li,{children:(0,l.jsx)(t.a,{href:`#modifiers-override-by-path-matching`,children:`Modifiers Override by Path Matching`})}),`
`]}),`
`]}),`
`]}),`
`,(0,l.jsx)(t.h2,{id:`token-architecture`,children:`Token Architecture`}),`
`,(0,l.jsx)(t.p,{children:`Our token system follows the Design Tokens Community Group (DTCG) standard with a three-tier architecture:`}),`
`,(0,l.jsxs)(t.ul,{children:[`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(`a`,{href:`./?path=/docs/design-tokens-t1--docs`,children:`T1 Primitive tokens`}),` for foundational tokens
values`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(`a`,{href:`./?path=/docs/design-tokens-t2--docs`,children:`T2 Semantic tokens`}),` for semantic abstraction
tokens`]}),`
`,(0,l.jsxs)(t.li,{children:[(0,l.jsx)(`a`,{href:`./?path=/docs/design-tokens-t3--docs`,children:`T3 Component tokens`}),` for component-specific
tokens`]}),`
`]}),`
`,(0,l.jsx)(t.h2,{id:`consuming-tokens`,children:`Consuming Tokens`}),`
`,(0,l.jsx)(t.h3,{id:`web`,children:`Web`}),`
`,(0,l.jsx)(t.h4,{id:`install-from-npm`,children:`Install from NPM`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-bash`,children:`npm install @infomaniak-design-system/tokens
`})}),`
`,(0,l.jsx)(t.h4,{id:`css-files`,children:`CSS Files`}),`
`,(0,l.jsx)(t.p,{children:`We offer two CSS file formats:`}),`
`,(0,l.jsx)(r,{headers:[`File format`,`CSS Selector`,`Usage`],rows:[[(0,l.jsx)(t.code,{children:`*.root.css`}),(0,l.jsx)(t.code,{children:`:root, :host`}),(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.code,{children:`*.root.css`}),` files apply globally via `,(0,l.jsx)(t.code,{children:`:root`}),` immediately.`,(0,l.jsx)(t.br,{}),`Use `,(0,l.jsx)(t.code,{children:`media`}),` queries with theme files to prevent conflicts (e.g., loading both light and dark simultaneously).`]})],[(0,l.jsx)(t.code,{children:`*.attr.css`}),(0,l.jsx)(t.code,{children:`[data-esds-<modifier>="<context>"]`}),(0,l.jsxs)(t.div,{children:[(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.code,{children:`.attr.css`}),` files only affect elements inside a container with the matching data attribute.`]}),(0,l.jsxs)(t.ul,{children:[(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.code,{children:`<modifier>`}),`: "theme" | "product"`]}),(0,l.jsxs)(t.li,{children:[(0,l.jsx)(t.code,{children:`<context>`}),`: "infomaniak" | "mail" | "euria" | ...`]})]})]})]]}),`
`,(0,l.jsxs)(t.h4,{id:`using-rootcss-files`,children:[`Using `,(0,l.jsx)(t.code,{children:`*.root.css`}),` files`]}),`
`,(0,l.jsx)(t.p,{children:`Root CSS files could be loaded using query, for example:`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-html`,children:`<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/tokens.root.css"
/>
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/modifiers/product/mail.root.css"
/>

<!-- Auto-switch based on system preference -->
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/modifiers/theme/light.root.css"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="stylesheet"
  href="@infomaniak-design-system/tokens/css/modifiers/theme/dark.root.css"
  media="(prefers-color-scheme: dark)"
/>
`})}),`
`,(0,l.jsxs)(t.h4,{id:`using-attrcss-files`,children:[`Using `,(0,l.jsx)(t.code,{children:`*.attr.css`}),` files`]}),`
`,(0,l.jsx)(t.p,{children:`Attr CSS file could be imported via CSS and activated using data attributes:`}),`
`,(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.strong,{children:`NOTE`}),`: `,(0,l.jsx)(t.code,{children:`*.attr.css`}),` CSS files are `,(0,l.jsx)(t.strong,{children:`optional`}),` and should be imported only if necessary.`]}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-css`,children:`@import '@infomaniak-design-system/tokens/css/tokens.attr.css';
@import '@infomaniak-design-system/tokens/css/modifiers/product/mail.attr.css';
@import '@infomaniak-design-system/tokens/css/modifiers/theme/dark.attr.css';
`})}),`
`,(0,l.jsx)(t.p,{children:`Modifiers can also be set on container elements:`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-html`,children:`<body
  data-esds-theme="dark"
  data-esds-product="mail"
>
  <!-- Dark theme and product mail applies to children -->
</body>
`})}),`
`,(0,l.jsx)(t.h4,{id:`tailwind-css`,children:`Tailwind CSS`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-css`,children:`@import 'tailwindcss';
@import '@infomaniak-design-system/tokens/css/tokens.root.css';
@import '@infomaniak-design-system/tokens/tailwind.css';
`})}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-html`,children:`<button class="bg-brand-default">Click me!</button>
`})}),`
`,(0,l.jsx)(t.h3,{id:`ios`,children:`iOS`}),`
`,(0,l.jsx)(t.h4,{id:`installation`,children:`Installation`}),`
`,(0,l.jsx)(t.p,{children:`Swift Package Manager — via Xcode or Package.swift:`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-swift`,children:`swift.package(url: "https://github.com/Infomaniak/ios-design-system", branch: "main")
swift.target(
    name: "MyTarget",
    dependencies: [
        .product(name: "DesignSystem", package: "ios-design-system")
    ]
)
`})}),`
`,(0,l.jsx)(t.p,{children:(0,l.jsx)(t.em,{children:`Supported platforms: iOS 16+, macOS 13+, visionOS 1+`})}),`
`,(0,l.jsx)(t.h5,{id:`package-structure`,children:`Package structure`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{children:`CatalogApp/               ← Demo app
Sources/DesignSystem/     ← Tokens, SwiftUI components
Tests/DesignSystemTests/  ← Unit tests
`})}),`
`,(0,l.jsx)(t.h4,{id:`usage`,children:`Usage`}),`
`,(0,l.jsx)(t.h5,{id:`configure-environment`,children:`Configure environment`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-swift`,children:`import DesignSystem

// Get theme via environment variable
@Environment(\\.esdsTheme) var theme
`})}),`
`,(0,l.jsxs)(t.h5,{id:`access-tokens-in-swiftui`,children:[`Access tokens in `,(0,l.jsx)(t.strong,{children:`SwiftUI`})]}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-swift`,children:`struct ContentView: View {
    @Environment(\\.esdsTheme) var theme
    
    var body: some View {
        VStack {
            Text("Hello")
                .foregroundColor(theme.color.text.default)
                .padding(theme.spacing.medium)
        }
        .background(theme.color.background.default)
    }
}
`})}),`
`,(0,l.jsx)(t.h5,{id:`set-theme`,children:`Set theme`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-swift`,children:`// In your app
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\\.esdsTheme, EsdsTheme.kdrive)
        }
    }
}
`})}),`
`,(0,l.jsx)(t.h2,{id:`how-it-works`,children:`How It Works`}),`
`,(0,l.jsx)(t.h3,{id:`token-resolution-chain`,children:`Token Resolution Chain`}),`
`,(0,l.jsx)(t.p,{children:`Token values reference each other in a hierarchy, ensuring consistency across the system:`}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{children:`T3-Component  →  button.background.error
                    ↓
T2-Semantic   →  color.background.error.default
                    ↓
T1-Primitive  →  color.red.600 (#E21C40)
`})}),`
`,(0,l.jsx)(t.p,{children:`When a primitive value changes, every token referencing it updates automatically.`}),`
`,(0,l.jsx)(t.h3,{id:`modifiers-override-by-path-matching`,children:`Modifiers Override by Path Matching`}),`
`,(0,l.jsx)(t.p,{children:`Modifiers let you swap the values of existing tokens without changing their names. They work by matching the path of a T2 (semantic) or T3 (component) token and replacing its value for specific contexts.`}),`
`,(0,l.jsx)(t.p,{children:(0,l.jsx)(t.strong,{children:`How it works:`})}),`
`,(0,l.jsxs)(t.ol,{children:[`
`,(0,l.jsx)(t.li,{children:`A modifier file contains the same token path as the base token`}),`
`,(0,l.jsx)(t.li,{children:`When applied, it replaces that path's value in the CSS cascade`}),`
`,(0,l.jsx)(t.li,{children:`Resolution continues with the new value`}),`
`]}),`
`,(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.strong,{children:`Example`}),`: The `,(0,l.jsx)(t.code,{children:`euria`}),` product modifier`]}),`
`,(0,l.jsxs)(t.p,{children:[`The `,(0,l.jsx)(t.code,{children:`euria.tokens.json`}),` modifier overrides `,(0,l.jsx)(t.code,{children:`color.background.brand.default`}),` by including the same path with a different value:`]}),`
`,(0,l.jsxs)(t.p,{children:[`Base `,(0,l.jsx)(t.code,{children:`t2-semantic/color.tokens.json`}),`:`]}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-json`,children:`{
  "color": {
    "background": {
      "brand": {
        "default": { "$value": "{color.sky.700}" }
      }
    }
  }
}
`})}),`
`,(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.code,{children:`modifiers/product/euria.tokens.json`}),`:`]}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-json`,children:`{
  "color": {
    "background": {
      "brand": {
        "default": { "$value": "{color.ocean.700}" }
      }
    }
  }
}
`})}),`
`,(0,l.jsx)(t.p,{children:(0,l.jsx)(t.strong,{children:`Resolution with modifiers:`})}),`
`,(0,l.jsxs)(t.p,{children:[`Multiple modifiers can be applied simultaneously. In the example below, the `,(0,l.jsx)(t.code,{children:`euria`}),` modifier changes the base brand color, then `,(0,l.jsx)(t.code,{children:`dark`}),` further adjusts it for the dark theme:`]}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{children:`With data-esds-product="euria" data-esds-theme="dark":

              T3: button.background.brand.default
                      ↓
              T2: color.background.brand.default
                      ↓
  Euria modifier: color.background.brand.default (color.ocean.700)
                      ↓
   Dark modifier: color.background.brand.default (color.ocean.400)
                      ↓
              T1: color.ocean.400
`})}),`
`,(0,l.jsx)(t.p,{children:(0,l.jsx)(t.strong,{children:`Apply modifiers using data attributes:`})}),`
`,(0,l.jsx)(t.pre,{children:(0,l.jsx)(t.code,{className:`language-html`,children:`<body
  data-esds-product="euria"
  data-esds-theme="dark"
>
  <!-- All children resolve with both modifiers applied -->
  <button style="background: var(--esds-color-background-brand-default)">
    Gets a color.ocean.400 background
  </button>
</body>
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,l.jsx)(t,{...e,children:(0,l.jsx)(o,{...e})}):o(e)}function c(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}var l;e((()=>{l=t(),a(),r()}))();export{s as default};