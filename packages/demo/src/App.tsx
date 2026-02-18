import { useEffect, useRef, useState } from 'react';
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

const sandboxInitialValue = `<MdxTabs>

${tabsMdx}

</MdxTabs>

`;

function App() {
  const stepsRef = useRef<HTMLElement | null>(null);
  const [stepsInView, setStepsInView] = useState(false);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStepsInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.app}>
      <ThemeToggle />
      <div className={styles.aboveTheFold}>
        <div className={styles.appHeader}>
          <h1>MDX UI</h1>
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
        <p>
          Try it out - click the buttons to add example components, and edit them however you want.
        </p>
        <Playground initialValue={sandboxInitialValue} />
      </div>

      <section
        ref={stepsRef}
        className={`${styles.stepsSection} ${stepsInView ? styles.inView : ''}`}
      >
        <h2 className={styles.stepsHeading}>And now, the details</h2>
        <ol className={styles.stepsList}>
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Why?</h3>
              <p>
                The fact that MDX lets you drop React components into something you’re writing is
                really cool, but writing or generating the JSX can be a chore. This library cuts out
                the boilerplate.
              </p>
            </div>
          </li>
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>How?</h3>
              <p>
                These components are pure React, with no special build step or config required. They
                are based on shadcn and ship with a stylesheet produced by Tailwind. For more
                technical details, see the <a href="https://github.com/toBeOfUse/mdx-ui">Readme</a>.
              </p>
            </div>
          </li>
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Let's Go</h3>
              <p>In your terminal:</p>
              <pre className={styles.stepCode}>npm i mdx-ui</pre>
              <p>In an MDX file:</p>
              <pre className={styles.stepCode}>{`import { MdxWhatever } from 'mdx-ui'`}</pre>
              <p>Elsewhere in the MDX file:</p>
              <pre className={styles.stepCode}>
                {`<MdxWhatever>\n  Your Content Here\n</MdxWhatever>`}
              </pre>
            </div>
          </li>
        </ol>
        <hr style={{ width: '100%' }} />
        <small style={{ margin: '8px 0', textAlign: 'right' }}>
          Made with 😶 by <a href="https://mitch.website">Mitch</a>.
        </small>
      </section>
    </div>
  );
}

export default App;
