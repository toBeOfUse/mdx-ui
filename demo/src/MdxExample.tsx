import { useEffect, useState, useCallback, Component, type ReactNode } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { MdxAccordion, MdxInfo, MdxWarning, MdxCarousel, MdxPopover, MdxTabs } from '../../';

const mono = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';
const components = { MdxAccordion, MdxInfo, MdxWarning, MdxCarousel, MdxPopover, MdxTabs };

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
        <pre style={{ color: '#ef4444', whiteSpace: 'pre-wrap', fontSize: '0.8125rem', margin: 0 }}>
          {this.state.error.message}
        </pre>
      );
    }
    return this.props.children;
  }
}

export function MdxExample({
  component,
  mdx,
  attrs,
}: {
  component: string;
  mdx: string;
  attrs?: string;
}) {
  const [result, setResult] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const fullSource = `<${component}${attrs ? ' ' + attrs : ''}>\n${mdx}\n</${component}>`;

  const compile = useCallback(async (src: string) => {
    try {
      const { default: Content } = await evaluate(src, {
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
    compile(fullSource);
  }, [fullSource, compile]);

  return (
    <div
      className="mdx-example"
      style={{
        border: '1px solid var(--border)',
        borderRadius: '0.5rem',
        padding: 12,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* Source */}
      <pre
        style={{
          margin: 0,
          padding: '0.875rem 1rem',
          fontSize: '0.8125rem',
          lineHeight: 1.55,
          fontFamily: mono,
          color: 'var(--foreground)',
          whiteSpace: 'pre',
          tabSize: 2,
          background: 'var(--muted)',
          overflow: 'auto',
          alignSelf: 'center',
        }}
      >
        {mdx.trim()}
      </pre>

      {/* Arrow */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>

      {/* Rendered output */}
      <div
        style={{
          overflow: 'auto',
          alignSelf: 'stretch',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {error ? (
          <pre
            style={{ color: '#ef4444', whiteSpace: 'pre-wrap', fontSize: '0.8125rem', margin: 0 }}
          >
            {error}
          </pre>
        ) : (
          <ErrorBoundary resetKey={fullSource}>{result}</ErrorBoundary>
        )}
      </div>
    </div>
  );
}
