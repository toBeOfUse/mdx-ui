---
name: using-mdx-ui
description: >
  Add interactive UI components to MDX documentation files using only Markdown
  syntax. Covers MdxTabs, MdxAccordion, MdxInfo, MdxWarning, MdxCard,
  MdxCardSet, MdxPopover — all driven by child element structure (hr dividers,
  h1 headings, blank lines) rather than JSX props. Includes Astro
  experimentalReactChildren setup, dark mode via .dark ancestor class, and
  CSS import behavior.
type: core
library: '@tobeofuse/mdx-ui'
library_version: '0.6.2'
sources:
  - 'toBeOfUse/mdx-ui:Readme.md'
  - 'toBeOfUse/mdx-ui:packages/mdx-ui/lib/main.ts'
  - 'toBeOfUse/mdx-ui:packages/mdx-ui/lib/components/MdxTabs.tsx'
  - 'toBeOfUse/mdx-ui:packages/mdx-ui/lib/components/MdxAccordion.tsx'
  - 'toBeOfUse/mdx-ui:packages/mdx-ui/lib/components/MdxAlert.tsx'
  - 'toBeOfUse/mdx-ui:packages/mdx-ui/lib/components/MdxCard.tsx'
  - 'toBeOfUse/mdx-ui:packages/mdx-ui/lib/components/MdxPopover.tsx'
---

# MDX UI

`@tobeofuse/mdx-ui` wraps Shadcn UI primitives so they can be used from MDX
documentation files using only Markdown syntax. Components inspect
`React.Children` to slot MDX-generated HTML elements into the right positions —
no JSX content props required.

## Setup

```bash
npm i @tobeofuse/mdx-ui
```

Import components in your MDX file. The CSS is bundled and loads automatically
on first import.

```mdx
import { MdxTabs, MdxAccordion, MdxInfo, MdxWarning, MdxCard, MdxCardSet, MdxPopover } from '@tobeofuse/mdx-ui'
```

**Astro projects** require `experimentalReactChildren: true` or all components
render empty:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
  ],
});
```

**Dark mode** activates when an ancestor element carries the `dark` class:

```html
<html class="dark">
  <!-- components use dark variants automatically -->
</html>
```

## Core Patterns

### Dividing sections with `---` (horizontal rule)

All components treat `---` (rendered as `<hr>`) as a section boundary. Use
`---` to separate a label/header from content, or to separate multiple sections.
The first child before the `---` becomes the label; everything after becomes the
content.

```mdx
<MdxAccordion>

What does this accordion expand to show?

---

This text is hidden until the label above is clicked.

</MdxAccordion>
```

### Dividing sections with `#` headings (MdxTabs and MdxCardSet only)

`MdxTabs` and `MdxCardSet` also treat `# Heading` (`<h1>`) as the start of a
new section, using the heading text as the tab label or card title.

```mdx
<MdxTabs>

# Installation

Run `npm install` to get started.

# Configuration

Create a config file in your project root.

# Usage

Import and use the components in your MDX files.

</MdxTabs>
```

```mdx
<MdxCardSet>

# Feature One

Description of the first feature.

# Feature Two

Description of the second feature.

# Feature Three

Description of the third feature.

</MdxCardSet>
```

### Components with a single content section

`MdxInfo`, `MdxWarning`, `MdxCard`, `MdxAccordion`, and `MdxPopover` all
follow the same rule: the first child is the label/header, everything after
is the body. Use `---` when the label needs to span multiple elements.

```mdx
<MdxInfo>

Heads up

---

This is the description of the info box. It can contain **bold text**,
`inline code`, and other Markdown formatting.

</MdxInfo>

<MdxWarning>

Destructive operation ahead

---

Running this command will permanently delete your data.

</MdxWarning>

<MdxCard>

Card Title

---

Card body content goes here.

</MdxCard>

<MdxPopover>

Click me

---

Popover body content goes here.

</MdxPopover>
```

### Opening components by default with `defaultOpen`

`MdxAccordion` and `MdxPopover` accept a `defaultOpen` boolean prop to control
their initial open state.

```mdx
<MdxAccordion defaultOpen>

Already expanded

---

This accordion is open when the page first loads.

</MdxAccordion>

<MdxPopover defaultOpen>

See details

---

This popover is visible when the page first loads.

</MdxPopover>
```

## Common Mistakes

### CRITICAL Adding JSX content props that are silently ignored

Wrong:

```mdx
<MdxAccordion label="What is MDX?" content="MDX lets you write JSX in Markdown.">
</MdxAccordion>
```

Correct:

```mdx
<MdxAccordion>

What is MDX?

---

MDX lets you write JSX in Markdown.

</MdxAccordion>
```

All component content is driven by child element structure, not props. Props
like `label`, `title`, `content`, and `header` do not exist and are silently
ignored, producing components with no visible content.

Source: maintainer interview; `packages/mdx-ui/lib/components/MdxAccordion.tsx`

---

### CRITICAL Omitting blank lines between child elements

Wrong:

```mdx
<MdxInfo>
Important note
---
This is the description.
</MdxInfo>
```

Correct:

```mdx
<MdxInfo>

Important note

---

This is the description.

</MdxInfo>
```

MDX only generates separate React elements when content blocks are separated by
blank lines. Without them, adjacent text collapses into a single element, so
`React.Children` finds only one child instead of distinct label and content
nodes — the `---` divider is never reached.

Source: maintainer interview

---

### CRITICAL Missing `experimentalReactChildren` flag in Astro

Wrong:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

Correct:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
  ],
});
```

Astro does not pass children to React components as React elements by default.
The `React.Children` slot pattern requires real React elements — without this
flag, all components receive opaque children and render empty or broken output.

Source: maintainer interview

---

### HIGH Using `---` as first divider after MDX frontmatter

Wrong:

```mdx
---
title: My Doc
---

<MdxTabs>
---
Tab A content
---
Tab B content
</MdxTabs>
```

Correct:

```mdx
---
title: My Doc
---

<MdxTabs>

# Tab A

Tab A content

# Tab B

Tab B content

</MdxTabs>
```

The first `---` inside `<MdxTabs>` above is not the problem — but if `---`
appears at the very start of an MDX file before any content, it is parsed as
YAML frontmatter, not an `<hr>`. Additionally, the missing blank lines in the
wrong example will cause the content to collapse (see above). Prefer `#`
headings for tab and card-set sections to avoid ambiguity.

Source: MDX/Markdown spec

---

### MEDIUM Using multiple `MdxCard` instances instead of `MdxCardSet`

Wrong:

```mdx
<MdxCard>

Card One

---

Content for card one.

</MdxCard>

<MdxCard>

Card Two

---

Content for card two.

</MdxCard>
```

Correct:

```mdx
<MdxCardSet>

# Card One

Content for card one.

# Card Two

Content for card two.

</MdxCardSet>
```

Individual `MdxCard` components stack vertically and have no shared scroll
container. `MdxCardSet` renders multiple cards in a horizontally scrollable
row with consistent sizing.

Source: `packages/mdx-ui/lib/components/MdxCard.tsx`

---

### MEDIUM Dark mode not activating

Wrong:

```html
<!-- No .dark ancestor — components always render in light mode -->
<div>
  <article><!-- MDX content here --></article>
</div>
```

Correct:

```html
<!-- Add .dark to a layout root or <html> element -->
<html class="dark">
  <div>
    <article><!-- MDX content here --></article>
  </div>
</html>
```

Dark mode is opt-in and requires an ancestor element with the `dark` class.
Components do not respond to `prefers-color-scheme` or any application-level
theme state automatically.

Source: `Readme.md`
