# Designers Guide/Web/Shadcn Token Mapping

> Mapping between the shadcn/ui semantic tokens (CSS variables on the dev side) and the design system tokens used in th...

Mapping between the shadcn/ui semantic tokens (CSS variables on the dev side) and the design system tokens used in the [Shadcn kit](./?path=/docs/designers-guide-web-shadcn-kit--docs).

## Base

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [
      <code>background</code>,
      <code>--background</code>,
      <code>color.background.elevation.surface</code>,
    ],
    [<code>foreground</code>, <code>--foreground</code>, <code>color.content.primary</code>],
  ]}
/>

## Primary

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [<code>primary</code>, <code>--primary</code>, <code>color.background.brand</code>],
    [
      <code>primary-foreground</code>,
      <code>--primary-foreground</code>,
      <code>color.content.on.brand</code>,
    ],
    [
      <code>primary-muted</code>,
      <code>--primary-muted</code>,
      <code>color.background.disabled</code>,
    ],
  ]}
/>

## Secondary

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [
      <code>secondary</code>,
      <code>--secondary</code>,
      <code>color.background.elevation.overlay</code>,
    ],
    [
      <code>secondary-foreground</code>,
      <code>--secondary-foreground</code>,
      <code>color.content.primary</code>,
    ],
  ]}
/>

## Accent

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [<code>accent</code>, <code>--accent</code>, <code>color.background.elevation.overlay</code>],
    [
      <code>accent-foreground</code>,
      <code>--accent-foreground</code>,
      <code>color.content.primary</code>,
    ],
  ]}
/>

## Muted

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [<code>muted</code>, <code>--muted</code>, <code>color.background.disabled</code>],
    [
      <code>muted-foreground</code>,
      <code>--muted-foreground</code>,
      <code>color.content.secondary</code>,
    ],
  ]}
/>

## Card

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [<code>card</code>, <code>--card</code>, <code>color.background.elevation.surface</code>],
    [
      <code>card-foreground</code>,
      <code>--card-foreground</code>,
      <code>color.content.primary</code>,
    ],
  ]}
/>

## Popover

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [<code>popover</code>, <code>--popover</code>, <code>color.background.elevation.surface</code>],
    [
      <code>popover-foreground</code>,
      <code>--popover-foreground</code>,
      <code>color.content.primary</code>,
    ],
  ]}
/>

## Destructive

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [
      <code>destructive</code>,
      <code>--destructive</code>,
      <code>color.background.feedback.error.dim1</code>,
    ],
    [
      <code>destructive-foreground</code>,
      <code>--destructive-foreground</code>,
      <code>color.content.on.feedback.error.dim1</code>,
    ],
  ]}
/>

## Border, Input & Ring

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [<code>border</code>, <code>--border</code>, <code>color.border.dim3</code>],
    [<code>input</code>, <code>--input</code>, <code>color.border.dim3</code>],
    [<code>ring</code>, <code>--ring</code>, <code>color.border.dim1</code>],
    [
      <code>ring-offset</code>,
      <code>--ring-offset</code>,
      <code>color.background.elevation.surface</code>,
    ],
  ]}
/>

## Sidebar

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [<code>sidebar</code>, <code>--sidebar</code>, <code>color.background.elevation.sunken</code>],
    [
      <code>sidebar-foreground</code>,
      <code>--sidebar-foreground</code>,
      <code>color.content.primary</code>,
    ],
    [
      <code>sidebar-primary</code>,
      <code>--sidebar-primary</code>,
      <code>color.background.brand</code>,
    ],
    [
      <code>sidebar-primary-foreground</code>,
      <code>--sidebar-primary-foreground</code>,
      <code>color.content.on.brand</code>,
    ],
    [
      <code>sidebar-accent</code>,
      <code>--sidebar-accent</code>,
      <code>color.state.selected.soft</code>,
    ],
    [
      <code>sidebar-accent-foreground</code>,
      <code>--sidebar-accent-foreground</code>,
      <code>color.content.brand</code>,
    ],
    [<code>sidebar-border</code>, <code>--sidebar-border</code>, <code>color.border.dim3</code>],
    [<code>sidebar-ring</code>, <code>--sidebar-ring</code>, <code>color.border.dim1</code>],
  ]}
/>

## Charts

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [<code>chart-1</code>, <code>--chart-1</code>, <code>color.pink.500</code>],
    [<code>chart-2</code>, <code>--chart-2</code>, <code>color.emerald.400</code>],
    [<code>chart-3</code>, <code>--chart-3</code>, <code>color.yellow.400</code>],
    [<code>chart-4</code>, <code>--chart-4</code>, <code>color.blue.400</code>],
    [<code>chart-5</code>, <code>--chart-5</code>, <code>color.orange.400</code>],
  ]}
/>

> ℹ️ The `chart-*` tokens point directly to primitive tokens (palette), unlike the others, which use semantic tokens.

## Custom

### Feedback

<Table
  headers={['shadcn token', 'CSS variable', 'Design System token']}
  rows={[
    [
      <code>information</code>,
      <code>--information</code>,
      <code>color.content.feedback.information</code>,
    ],
    [
      <code>information-background</code>,
      <code>--information-background</code>,
      <code>color.background.feedback.information.dim3</code>,
    ],
    [
      <code>information-foreground</code>,
      <code>--information-foreground</code>,
      <code>color.content.on.feedback.information.dim3</code>,
    ],
    [
      <code>information-border</code>,
      <code>--information-border</code>,
      <code>color.border.on.feedback.information.dim3</code>,
    ],
    [<code>success</code>, <code>--success</code>, <code>color.content.feedback.success</code>],
    [
      <code>success-background</code>,
      <code>--success-background</code>,
      <code>color.background.feedback.success.dim3</code>,
    ],
    [
      <code>success-foreground</code>,
      <code>--success-foreground</code>,
      <code>color.content.on.feedback.success.dim3</code>,
    ],
    [
      <code>success-border</code>,
      <code>--success-border</code>,
      <code>color.border.on.feedback.success.dim3</code>,
    ],
    [<code>warning</code>, <code>--warning</code>, <code>color.content.feedback.warning</code>],
    [
      <code>warning-background</code>,
      <code>--warning-background</code>,
      <code>color.background.feedback.warning.dim3</code>,
    ],
    [
      <code>warning-foreground</code>,
      <code>--warning-foreground</code>,
      <code>color.content.on.feedback.warning.dim3</code>,
    ],
    [
      <code>warning-border</code>,
      <code>--warning-border</code>,
      <code>color.border.on.feedback.warning.dim3</code>,
    ],
    [<code>error</code>, <code>--error</code>, <code>color.content.feedback.error</code>],
    [
      <code>error-background</code>,
      <code>--error-background</code>,
      <code>color.background.feedback.error.dim3</code>,
    ],
    [
      <code>error-foreground</code>,
      <code>--error-foreground</code>,
      <code>color.content.on.feedback.error.dim3</code>,
    ],
    [
      <code>error-border</code>,
      <code>--error-border</code>,
      <code>color.border.on.feedback.error.dim3</code>,
    ],
  ]}
/>

### Dataviz

> ℹ️ Duplicates the `dataviz` modifier defined in Token Core (tier 2).
