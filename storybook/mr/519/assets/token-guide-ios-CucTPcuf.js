import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{l as t,s as n}from"./blocks-Cr2ZIGG9.js";import{a as r}from"./chunk-W22LQPXL-CVCnKrju.js";import{i,r as a}from"./react-DITjJg24.js";function o(e){let t={code:`code`,em:`em`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,strong:`strong`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Design Tokens/Getting Started/iOS`}),`
`,(0,c.jsxs)(`div`,{className:`welcome-section`,children:[(0,c.jsx)(`h1`,{children:`Design Tokens - iOS`}),(0,c.jsx)(`p`,{className:`welcome-description`,children:(0,c.jsx)(t.p,{children:`A comprehensive guide on how to install and consume the Design System tokens on iOS.`})})]}),`
`,(0,c.jsx)(t.h2,{id:`installation`,children:`Installation`}),`
`,(0,c.jsx)(t.p,{children:`Swift Package Manager — via Xcode or Package.swift:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-swift`,children:`swift.package(url: "https://github.com/Infomaniak/ios-design-system", branch: "main")
swift.target(
    name: "MyTarget",
    dependencies: [
        .product(name: "DesignSystem", package: "ios-design-system")
    ]
)
`})}),`
`,(0,c.jsx)(t.p,{children:(0,c.jsx)(t.em,{children:`Supported platforms: iOS 16+, macOS 13+, visionOS 1+`})}),`
`,(0,c.jsx)(t.h3,{id:`package-structure`,children:`Package structure`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`CatalogApp/               ← Demo app
Sources/DesignSystem/     ← Tokens, SwiftUI components
Tests/DesignSystemTests/  ← Unit tests
`})}),`
`,(0,c.jsx)(t.h2,{id:`usage`,children:`Usage`}),`
`,(0,c.jsx)(t.h3,{id:`configure-environment`,children:`Configure environment`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-swift`,children:`import DesignSystem

// Get theme via environment variable
@Environment(\\.esdsTheme) var theme
`})}),`
`,(0,c.jsxs)(t.h3,{id:`access-tokens-in-swiftui`,children:[`Access tokens in `,(0,c.jsx)(t.strong,{children:`SwiftUI`})]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-swift`,children:`struct ContentView: View {
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
`,(0,c.jsx)(t.h3,{id:`set-theme`,children:`Set theme`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-swift`,children:`// In your app
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\\.esdsTheme, EsdsTheme.kdrive)
        }
    }
}
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};