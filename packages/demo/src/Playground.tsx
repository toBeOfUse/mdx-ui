import { useEffect, useRef, useState, useCallback, Component, type ReactNode } from 'react';
import type * as Monaco from 'monaco-editor';
import appStyles from './App.module.css';
import styles from './Playground.module.css';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import Editor from '@monaco-editor/react';
import {
  MdxAccordion,
  MdxInfo,
  MdxWarning,
  MdxCard,
  MdxCardSet,
  MdxPopover,
  MdxTabs,
} from 'mdx-ui';
import { useTheme } from './theme';

const snippets: Record<string, string> = {
  Accordion: `<MdxAccordion>

**Click to expand**

Here is some hidden content revealed by the accordion.

</MdxAccordion>`,
  Info: `<MdxInfo>

Heads up!

This is an informational alert rendered from Markdown.

</MdxInfo>`,
  Warning: `<MdxWarning>

Watch out!

This is a warning alert rendered from Markdown.

</MdxWarning>`,
  Tabs: `<MdxTabs>

# Tab A

Content for the first tab.

# Tab B

Content for the second tab.

</MdxTabs>`,
  Card: `<MdxCard>

Card Heading

This is the card content.

</MdxCard>`,
  'Card Set': `<MdxCardSet>

# Card One

Content for the first card.

# Card Two

Content for the second card.

# Card Three

Content for the third card.

</MdxCardSet>`,
  Popover: `<MdxPopover>

Click me

This content appears inside a popover.

</MdxPopover>`,
};

const components = { MdxAccordion, MdxInfo, MdxWarning, MdxCard, MdxCardSet, MdxPopover, MdxTabs };

const importLine = `import { MdxAccordion, MdxInfo, MdxWarning, MdxCard, MdxCardSet, MdxPopover, MdxTabs } from 'mdx-ui';`;

class ErrorBoundary extends Component<
  { resetKey: string; children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <pre style={{ color: '#ef4444', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
          {this.state.error.message}
        </pre>
      );
    }
    return this.props.children;
  }
}

export function Playground({ initialValue = '' }: { initialValue?: string }) {
  const { isDark } = useTheme();
  const [value, setValue] = useState(initialValue);
  const [result, setResult] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollPreviewRef = useRef(false);

  const appendSnippet = useCallback((name: string) => {
    scrollPreviewRef.current = true;
    setValue((prev) => {
      const next = (prev ? prev + '\n\n' : '') + snippets[name];
      const editor = editorRef.current;
      if (editor) {
        setTimeout(() => {
          const lineCount = editor.getModel()?.getLineCount() ?? 1;
          editor.revealLine(lineCount);
        }, 0);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (scrollPreviewRef.current && previewRef.current) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight;
      scrollPreviewRef.current = false;
    }
  }, [result]);

  const compileAndRun = useCallback(async (source: string) => {
    try {
      const { default: Content } = await evaluate(source, {
        ...runtime,
        baseUrl: window.location.href,
        useMDXComponents: () => components,
      });
      setResult(<Content />);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResult(null);
    }
  }, []);

  useEffect(() => {
    compileAndRun(value);
  }, [value]);

  return (
    <div className={styles.playgroundWrapper}>
      <div className={appStyles.snippetButtons}>
        {Object.keys(snippets).map((name) => (
          <button key={name} className={appStyles.snippetBtn} onClick={() => appendSnippet(name)}>
            + {name}
          </button>
        ))}
      </div>
      <div className={styles.playground}>
        <div className={styles.editorPane}>
          <pre className={styles.importLine} style={{ background: isDark ? '#1e1e1e' : '#ffffff' }}>
            {importLine}
          </pre>
          <Editor
            height="100%"
            value={value}
            defaultLanguage="markdown"
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            theme={isDark ? 'vs-dark' : 'vs'}
            onChange={(v) => setValue(v ?? '')}
            options={{
              minimap: { enabled: false },
              lineNumbers: 'off',
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              renderLineHighlight: 'none',
              folding: false,
              glyphMargin: false,
            }}
          />
        </div>
        <div className={styles.previewPane} ref={previewRef}>
          {error ? (
            <pre className={styles.errorText}>{error}</pre>
          ) : (
            <ErrorBoundary resetKey={value}>{result}</ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}
