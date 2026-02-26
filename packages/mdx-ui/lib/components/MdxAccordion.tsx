import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Children, type ReactNode } from 'react';
import { cn, scanForTag } from '../utils';

/**
 * This component takes some HTML elements, like the ones that the Markdown in
 * MDX files is turned into, and turns them into an accordion.
 *
 * Accordions have some content that is always displayed (the label) and some
 * content that is hidden until the label is clicked. This component applies the
 * following rules to its children:
 *
 * 1. If there is an horizontal rule (<hr /> produced by a Markdown `---`), then
 *    everything before the horizontal rule is treated as a label, and
 *    everything after is treated as content. (This allows the label to contain
 *    multiple elements.)
 * 2. Otherwise, the first child element is treated as the label, and everything
 *    after is treated as content.
 */
export function MdxAccordion({
  children,
  defaultOpen,
}: {
  children: ReactNode;
  defaultOpen: boolean;
}) {
  const childArray = Children.toArray(children);
  let hrLocation = childArray.findIndex(scanForTag('hr'));
  let hrFound = hrLocation !== -1;
  if (!hrFound) {
    // if there is no hr, just use the first child as the header
    hrLocation = 1;
  }
  const header = childArray.slice(0, hrLocation);
  const normalChildren = childArray.slice(hrLocation + (hrFound ? 1 : 0));
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? 'item-1' : undefined}
      className="mdxui:w-full mdxui:border mdxui:border-border mdxui:px-4 mdxui:rounded-lg mdxui:my-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger
          className={cn(
            'mdxui:text-sm mdxui:p-0 mdxui:bg-transparent mdxui:border-none mdxui:outline-none',
            'mdxui:*:m-0 mdxui:*:inline mdxui:[&>svg]:my-auto',
          )}
        >
          {header}
        </AccordionTrigger>
        <AccordionContent className="mdxui:prose mdxui:dark:prose-invert">
          {normalChildren}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
