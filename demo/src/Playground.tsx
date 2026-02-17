import { useEffect, useState, useCallback, Component, type ReactNode } from 'react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import Editor from '@monaco-editor/react'
import { MdxAccordion, MdxCarousel, MdxPopover } from '../../'
import { useTheme } from './useTheme'

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

</MdxCarousel>`

const components = { MdxAccordion, MdxCarousel, MdxPopover }


class ErrorBoundary extends Component<
  { resetKey: string; children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <pre style={{ color: '#ef4444', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
          {this.state.error.message}
        </pre>
      )
    }
    return this.props.children
  }
}

export function Playground() {
  const { isDark } = useTheme()
  const [value, setValue] = useState(defaultValue)
  const [result, setResult] = useState<ReactNode>(null)
  const [error, setError] = useState<string | null>(null)

  const compileAndRun = useCallback(async (source: string) => {
    try {
      const { default: Content } = await evaluate(source, {
        ...runtime,
        baseUrl: window.location.href,
        useMDXComponents: () => components,
      })
      setResult(<Content />)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setResult(null)
    }
  }, [])

  useEffect(() => {compileAndRun(value)}, [value]);

  return (
    <div style={{ display: 'flex', gap: '1rem', minHeight: 400 }}>
      <div
        style={{
          flex: 1,
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          overflow: 'hidden',
        }}
      >
        <Editor
          defaultValue={defaultValue}
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
          <ErrorBoundary resetKey={value}>
            {result}
          </ErrorBoundary>
        )}
      </div>
    </div>
  )
}
