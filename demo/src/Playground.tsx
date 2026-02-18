import { useEffect, useState, useCallback, Component, type ReactNode } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import Editor from '@monaco-editor/react';
import { MdxAccordion, MdxInfo, MdxWarning, MdxCarousel, MdxPopover, MdxTabs } from '../../';
import { useTheme } from './theme';

const defaultValue = `<MdxAccordion>

**What is this library?**

---

This library provides MDX components that convert standard
Markdown elements into interactive UI widgets.

- Built with **shadcn/ui** and **Radix UI**
- Fully accessible
- Easy to drop into any MDX file

</MdxAccordion>

<MdxPopover>

##### More info

The **MdxPopover** finds an \`<h5>\` among its children and uses
it as the button label. Everything else becomes the popover body.

</MdxPopover>

<MdxCarousel>

### Slide One

Welcome to the **MdxCarousel**. Each \`###\` heading starts a new slide.

### Slide Two

You can include **bold text**, *italics*, lists, and other Markdown.

### Slide Three

Use the arrow buttons to navigate between slides.

</MdxCarousel>`;

const components = { MdxAccordion, MdxInfo, MdxWarning, MdxCarousel, MdxPopover, MdxTabs };

const importLine = `import { MdxAccordion, MdxInfo, MdxWarning, MdxCarousel, MdxPopover, MdxTabs } from 'components-for-mdx';`;

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

export function Playground({
  value: controlledValue,
  onChange,
}: { value?: string; onChange?: (v: string) => void } = {}) {
  const { isDark } = useTheme();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;
  const setValue = useCallback(
    (v: string) => {
      if (isControlled) {
        onChange?.(v);
      } else {
        setInternalValue(v);
      }
    },
    [isControlled, onChange],
  );
  const [result, setResult] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);

  const compileAndRun = useCallback(async (source: string) => {
    const stripped = source.replace(/^import\s+.*?['"](components-for-mdx)['"]\s*\n?/gm, '');
    try {
      const { default: Content } = await evaluate(stripped, {
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
    <div style={{ display: 'flex', gap: '1rem', height: '100%', minHeight: 400 }}>
      <div
        style={{
          flex: 1,
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <pre
          style={{
            fontSize: '0.8125rem',
            padding: '0.5rem 0.75rem',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            color: 'var(--muted-foreground)',
            userSelect: 'none',
            background: isDark ? '#1e1e1e' : '#ffffff',
            flexShrink: 0,
            overflowX: 'auto',
            scrollbarWidth: 'thin',
          }}
        >
          {importLine}
        </pre>
        <Editor
          height="100%"
          value={value}
          defaultLanguage="markdown"
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
      <div
        style={{
          flex: 1,
          padding: '1rem',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          overflow: 'auto',
          textAlign: 'left',
        }}
      >
        {error ? (
          <pre style={{ color: '#ef4444', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
            {error}
          </pre>
        ) : (
          <ErrorBoundary resetKey={value}>{result}</ErrorBoundary>
        )}
      </div>
    </div>
  );
}
