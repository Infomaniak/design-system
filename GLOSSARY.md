# Infomaniak Design System

Design tokens (DTCG), web components and documentation for Infomaniak's design
system. This glossary records the project-specific language; general programming
concepts are out of scope.

## Language

### Playground

**Playground**:
The standalone editor page where anyone can write and run design-system snippets
in the browser and share them as URLs.
_Avoid_: sandbox page, CodePen, REPL

**Snippet**:
A playground project: the set of user-editable files (HTML markup, setup, script)
that a shared link encodes.
_Avoid_: demo, sample, project

**Preview**:
The live iframe output of a snippet, rendered from the editor's current files.
_Avoid_: canvas, result, output

**Sandbox**:
The separate-origin virtual URL space (service worker on unpkg.com) where preview
code executes, isolating untrusted shared snippets from the docs site.
_Avoid_: preview (the preview _runs in_ the sandbox), iframe

**Setup**:
The visible playground tab that registers the design system in the preview:
component definitions and icon injection. Intentionally not hidden.
_Avoid_: bootstrap, hidden bootstrap, glue
