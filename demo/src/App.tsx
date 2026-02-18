import { ThemeToggle } from './ThemeToggle';
import { MdxExample } from './MdxExample';
import { Playground } from './Playground';
import './global.css';
import styles from './App.module.css';

const accordionMdx = `**Click to expand**

Hi! Here is some content.`;

const alertMdx = `Heads up!

This component renders a styled
alert from plain Markdown.`;

const tabsMdx = `# Tab A

This tab has content.

# Tab B

This tab has different content.`;

const initialMdx = `<MdxInfo>

Hi!

Add some content in the editor to see what it looks like when rendered.

</MdxInfo>`;

function App() {
  return (
    <div className={styles.app}>
      <ThemeToggle />
      <div className={styles.aboveTheFold}>
        <div className={styles.appHeader}>
          <h1>MDX Components</h1>
          <p>Drop-in components that turn simple Markdown into interactive UI.</p>
        </div>
        <div className={styles.examplesGrid}>
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

      <div className={styles.sandboxSection}>
        <h2>Sandbox</h2>
        <p>Try it out - click a component to add it, then edit freely.</p>
        <Playground initialValue={initialMdx} />
      </div>
    </div>
  );
}

export default App;
