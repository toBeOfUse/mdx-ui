# @tobeofuse/mdx-ui — Skill Spec

`@tobeofuse/mdx-ui` is a React component library that wraps Shadcn UI primitives (built on Radix UI) so they can be used from MDX documentation files using only Markdown syntax. It inspects `React.Children` to slot MDX-generated HTML elements (paragraphs, headings, horizontal rules) into the correct positions within each UI component, requiring no explicit JSX props for content.

## Domains

| Domain | Description | Skills |
| --- | --- | --- |
| using-mdx-ui | Authoring MDX documentation with interactive components — understanding how Markdown content maps to component slots, which components are available, and how to configure them. | using-mdx-ui |

## Skill Inventory

| Skill | Type | Domain | What it covers | Failure modes |
| --- | --- | --- | --- | --- |
| Using MDX UI | core | using-mdx-ui | MdxTabs, MdxAccordion, MdxInfo, MdxWarning, MdxCard, MdxCardSet, MdxPopover, child slot pattern, divider syntax, blank lines, defaultOpen, CSS/dark mode, Astro integration | 6 |

## Failure Mode Inventory

### Using MDX UI (6 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | --- | --- | --- | --- |
| 1 | Adding JSX props to configure component content | CRITICAL | maintainer interview | — |
| 2 | Omitting blank lines between child elements in MDX | CRITICAL | maintainer interview | — |
| 3 | Missing experimentalReactChildren flag in Astro | CRITICAL | maintainer interview | — |
| 4 | Using --- as a divider at the very start of an MDX file | HIGH | MDX/Markdown spec | — |
| 5 | Using multiple MdxCard instances instead of MdxCardSet | MEDIUM | source: MdxCard.tsx | — |
| 6 | Not adding a .dark ancestor for dark mode | MEDIUM | Readme.md | — |

## Tensions

None. This is a single-skill library with no cross-skill tradeoffs.

## Cross-References

None.

## Subsystems & Reference Candidates

| Skill | Subsystems | Reference candidates |
| --- | --- | --- |
| using-mdx-ui | — | — |

## Remaining Gaps

None. All gaps resolved during maintainer interview.

## Recommended Skill File Structure

- **Core skills:** `using-mdx-ui` — covers all components and MDX authoring patterns (framework-agnostic, with Astro callout)
- **Framework skills:** None needed — Astro gotcha is covered inline in the core skill
- **Lifecycle skills:** None — library is too small to warrant a getting-started vs. reference split
- **Composition skills:** None — Shadcn/Radix are bundled, not peer dependencies
- **Reference files:** None — fewer than 10 components total

## Composition Opportunities

| Library | Integration points | Composition skill needed? |
| --- | --- | --- |
| Astro (`@astrojs/react`) | experimentalReactChildren flag required for React.Children pattern | No — covered as a failure mode in the core skill |
| MDX (mdxjs.com) | MDX project setup is a prerequisite; blank-line parsing rules affect all components | No — covered inline |
