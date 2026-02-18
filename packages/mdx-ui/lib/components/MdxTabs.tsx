import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Children, type ReactNode } from 'react';
import { scanForTag } from '../utils';

/**
 * This component takes HTML elements (from MDX) and turns them into tabs.
 *
 * Tabs are separated by horizontal rules (<hr />s, produced by `---` in
 * Markdown). The first child of each section becomes the tab label, and the
 * remaining children become the tab content.
 *
 * Additionally, any <h1> (produced by `# Text` in Markdown) will be treated as
 * the label of a new tab, with the following elements (until the next <h1> or
 * <hr>) becoming the content of the tab.
 */
export function MdxTabs({ children }: { children: ReactNode }) {
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

  const tabs = sections
    .filter((s) => s.length > 0)
    .map((s) => ({ label: s[0], content: s.slice(1) }));

  if (tabs.length === 0) {
    console.error('MdxTabs requires at least one child to create tabs');
    return <p className="text-destructive">MdxTabs requires at least one child to create tabs.</p>;
  }

  return (
    <Tabs defaultValue="tab-0" className="w-full my-4 rounded-lg border px-4 py-3">
      <TabsList>
        {tabs.map((tab, i) => (
          <TabsTrigger key={i} value={`tab-${i}`} className="bg-transparent">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={i} value={`tab-${i}`} className="prose dark:prose-invert">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
