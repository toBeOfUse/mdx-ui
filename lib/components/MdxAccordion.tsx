import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Children, type ReactNode } from 'react';
import { scanForTag } from '../utils';

/**
 * This component takes some HTML elements, like the ones that the Markdown in
 * MDX files is turned into, and turns them into an accordion. The content
 * before the first hr (`---` in markdown) becomes the external label of the
 * accordion. The rest of the children become the content within.
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
      className="w-full border border-border px-4 rounded-lg my-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-sm p-0 bg-transparent border-none outline-none *:m-0 *:inline">
          {header}
        </AccordionTrigger>
        <AccordionContent className="prose dark:prose-invert">{normalChildren}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
