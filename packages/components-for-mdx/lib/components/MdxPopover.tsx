import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Children, type ReactNode } from 'react';
import { scanForTag } from '../utils';

/**
 * This component takes some HTML elements, like the ones that the Markdown in
 * MDX files is turned into, and turns them into a popover.
 *
 * Popovers have a label and some content. This component applies the
 * following rules to its child elements:
 *
 * 1. If there is an horizontal rule (<hr /> produced by a Markdown `---`), then
 *    everything before the horizontal rule is treated as the label, and
 *    everything after is treated as content. (This allows the label to contain
 *    multiple elements.)
 * 2. Otherwise, the first child element is treated as the label, and everything
 *    after is treated as content.
 */
export function MdxPopover({
  children,
  defaultOpen,
}: {
  children: ReactNode;
  defaultOpen: boolean;
}) {
  const childArray = Children.toArray(children);
  let hrLocation = childArray.findIndex(scanForTag('hr'));
  const hrFound = hrLocation !== -1;
  if (!hrFound) {
    hrLocation = 1;
  }
  const trigger = childArray.slice(0, hrLocation);
  const normalChildren = childArray.slice(hrLocation + (hrFound ? 1 : 0));

  return (
    <div className="py-6 flex justify-center">
      <Popover defaultOpen={defaultOpen}>
        <PopoverTrigger asChild>
          <Button
            className="cursor-pointer outline-none border-solid border-border bg-transparent hover:bg-muted"
            variant="secondary"
          >
            {trigger}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 prose dark:prose-invert">{normalChildren}</PopoverContent>
      </Popover>
    </div>
  );
}
