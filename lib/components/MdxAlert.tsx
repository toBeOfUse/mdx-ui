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
  const titleChild = childArray.find(scanForTag('h6'));
  const descriptionChildren = childArray.filter((c) => c !== titleChild);

  return (
    <Alert variant={variant} className="my-4">
      {icons[variant]}
      {titleChild && (
        <AlertTitle>
          {(titleChild as React.ReactElement<{ children: ReactNode }>).props.children}
        </AlertTitle>
      )}
      {descriptionChildren.length > 0 && (
        <AlertDescription className="prose dark:prose-invert">
          {descriptionChildren}
        </AlertDescription>
      )}
    </Alert>
  );
}

/**
 * This component takes HTML elements (from MDX) and turns them into an info alert.
 * The first `<h6>` (`######` in Markdown) becomes the alert title.
 * All remaining children become the alert description.
 */
export function MdxInfo({ children }: { children: ReactNode }) {
  return <MdxAlertBase variant="info">{children}</MdxAlertBase>;
}

/**
 * This component takes HTML elements (from MDX) and turns them into a warning alert.
 * The first `<h6>` (`######` in Markdown) becomes the alert title.
 * All remaining children become the alert description.
 */
export function MdxWarning({ children }: { children: ReactNode }) {
  return <MdxAlertBase variant="warning">{children}</MdxAlertBase>;
}
