import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, TriangleAlert } from 'lucide-react';
import { Children, type ReactNode } from 'react';
import { scanForTag } from '../utils';

const icons = {
  info: <Info />,
  warning: <TriangleAlert />,
  destructive: null,
};

function MdxAlertBase({
  children,
  variant,
}: {
  children: ReactNode;
  variant: 'info' | 'warning' | 'destructive';
}) {
  const childArray = Children.toArray(children);
  let hrLocation = childArray.findIndex(scanForTag('hr'));
  const hrFound = hrLocation !== -1;
  if (!hrFound) {
    hrLocation = 1;
  }
  const titleChildren = childArray.slice(0, hrLocation);
  const descriptionChildren = childArray.slice(hrLocation + (hrFound ? 1 : 0));

  return (
    <Alert variant={variant} className="my-4">
      {icons[variant]}
      {titleChildren.length > 0 && <AlertTitle className="*:m-0">{titleChildren}</AlertTitle>}
      {descriptionChildren.length > 0 && (
        <AlertDescription className="prose dark:prose-invert">
          {descriptionChildren}
        </AlertDescription>
      )}
    </Alert>
  );
}

/**
 * This component takes some HTML elements, like the ones that the Markdown in
 * MDX files is turned into, and turns them into an info box.
 *
 * Info boxes have a label and some content. This component applies the
 * following rules to its child elements:
 *
 * 1. If there is an horizontal rule (<hr /> produced by a Markdown `---`), then
 *    everything before the horizontal rule is treated as the label, and
 *    everything after is treated as content. (This allows the label to contain
 *    multiple elements.)
 * 2. Otherwise, the first child element is treated as the label, and everything
 *    after is treated as content.
 */
export function MdxInfo({ children }: { children: ReactNode }) {
  return <MdxAlertBase variant="info">{children}</MdxAlertBase>;
}

/**
 * This component takes some HTML elements, like the ones that the Markdown in
 * MDX files is turned into, and turns them into a warning box.
 *
 * Info boxes have a label and some content. This component applies the
 * following rules to its child elements:
 *
 * 1. If there is an horizontal rule (<hr /> produced by a Markdown `---`), then
 *    everything before the horizontal rule is treated as the label, and
 *    everything after is treated as content. (This allows the label to contain
 *    multiple elements.)
 * 2. Otherwise, the first child element is treated as the label, and everything
 *    after is treated as content.
 */
export function MdxWarning({ children }: { children: ReactNode }) {
  return <MdxAlertBase variant="warning">{children}</MdxAlertBase>;
}
