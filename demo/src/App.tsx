import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { MdxExample } from './MdxExample';
import { Playground } from './Playground';
import './App.css';

const accordionMdx = `**Click to expand**

Hi! Here is some content.`;

const alertMdx = `###### Heads up!

This component renders a styled
alert from plain Markdown.`;

const tabsMdx = `#### Tab A
This tab has content. Content about,
perhaps, weasels.

#### Tab B
Ferrets are different from weasels.`;

const snippets: Record<string, string> = {
  Accordion: `<MdxAccordion>

**Click to expand**

---

Here is some hidden content revealed by the accordion.

</MdxAccordion>`,
  Info: `<MdxInfo>

###### Heads up!

This is an informational alert rendered from Markdown.

</MdxInfo>`,
  Warning: `<MdxWarning>

###### Watch out!

This is a warning alert rendered from Markdown.

</MdxWarning>`,
  Tabs: `<MdxTabs>

#### Tab A
Content for the first tab.

#### Tab B
Content for the second tab.

</MdxTabs>`,
  Carousel: `<MdxCarousel>

### Slide One
Welcome to the carousel.

### Slide Two
Navigate with the arrow buttons.

</MdxCarousel>`,
  Popover: `<MdxPopover>

##### Click me

This content appears inside a popover.

</MdxPopover>`,
};

function App() {
  const [mdx, setMdx] = useState(`<MdxInfo>

###### Hi!

Add some content in the editor to see what it looks like when rendered.

</MdxInfo>`);

  const appendSnippet = (name: string) => {
    setMdx((prev) => (prev ? prev + '\n\n' : '') + snippets[name]);
  };

  return (
    <div className="app">
      <ThemeToggle />
      <div className="above-the-fold">
        <div className="app-header">
          <h1>MDX Components</h1>
          <p>Drop-in components that turn simple Markdown into interactive UI.</p>
        </div>
        <div className="examples-grid">
          <div>
            <MdxExample component="MdxAccordion" mdx={accordionMdx} attrs="defaultOpen" />
          </div>
          <div>
            <MdxExample component="MdxInfo" mdx={alertMdx} />
          </div>
          <div>
            <MdxExample component="MdxTabs" mdx={tabsMdx} />
          </div>
        </div>
      </div>

      <div className="sandbox-section">
        <h2>Sandbox</h2>
        <p>Try it out - click a component to add it, then edit freely.</p>
        <div className="snippet-buttons">
          {Object.keys(snippets).map((name) => (
            <button key={name} className="snippet-btn" onClick={() => appendSnippet(name)}>
              + {name}
            </button>
          ))}
        </div>
        <Playground value={mdx} onChange={setMdx} />
      </div>
    </div>
  );
}

export default App;
