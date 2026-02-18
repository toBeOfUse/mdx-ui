import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Children, type ReactNode } from 'react';
import { scanForTag } from '../utils';

/**
 * This component takes some HTML elements, like the ones that the Markdown in
 * MDX files is turned into, and turns them into a card.
 *
 * Cards have a header and some content. This component applies the following
 * rules to its child elements:
 *
 * 1. If there is a horizontal rule (<hr /> produced by a Markdown `---`), then
 *    everything before the horizontal rule is treated as the header, and
 *    everything after is treated as content.
 * 2. Otherwise, the first child element is treated as the header, and
 *    everything after is treated as content.
 */
export function MdxCard({ children }: { children: ReactNode }) {
  const childArray = Children.toArray(children);
  let hrLocation = childArray.findIndex(scanForTag('hr'));
  const hrFound = hrLocation !== -1;
  if (!hrFound) {
    hrLocation = 1;
  }
  const headerChildren = childArray.slice(0, hrLocation);
  const contentChildren = childArray.slice(hrLocation + (hrFound ? 1 : 0));

  return (
    <Card className="my-4">
      {headerChildren.length > 0 && (
        <CardHeader>
          <CardTitle className="*:m-0 prose dark:prose-invert">{headerChildren[0]}</CardTitle>
          <CardDescription className="prose dark:prose-invert *:m-0">
            {...headerChildren.slice(1)}
          </CardDescription>
        </CardHeader>
      )}
      {contentChildren.length > 0 && (
        <CardContent className="prose dark:prose-invert">{contentChildren}</CardContent>
      )}
    </Card>
  );
}

/**
 * This component takes some HTML elements and renders a series of MdxCards
 * horizontally in an x-scrolling container.
 *
 * Cards are separated by horizontal rules (<hr /> produced by `---` in
 * Markdown) or <h1> elements. The first child of each section becomes the card
 * header, and the remaining children become the card content.
 */
export function MdxCardSet({ children }: { children: ReactNode }) {
  const childArray = Children.toArray(children);
  const isHr = scanForTag('hr');
  const isH1 = scanForTag('h1');

  const sections: ReactNode[][] = [[]];
  for (const child of childArray) {
    if (isHr(child)) {
      sections.push([]);
    } else if (isH1(child)) {
      sections.push([{ ...(child as React.ReactElement), type: 'span' }]);
    } else {
      sections[sections.length - 1].push(child);
    }
  }

  const cards = sections
    .filter((s) => s.length > 0)
    .map((s) => ({ header: s[0], content: s.slice(1) }));

  return (
    <div
      className="flex flex-row gap-4 overflow-x-auto py-2 my-4"
      style={{ scrollbarWidth: 'thin' }}
    >
      {cards.map(({ header, content }, i) => (
        <Card key={i} className="min-w-64 max-w-[80%] shrink-0 gap-2">
          <CardHeader className="pb-0">
            <CardTitle className="*:m-0 prose dark:prose-invert">{header}</CardTitle>
          </CardHeader>
          {content.length > 0 && (
            <CardContent className="prose dark:prose-invert">{content}</CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
