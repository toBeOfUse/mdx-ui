import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Children, type ReactNode } from "react";
import { scanForTag } from "../utils";

/**
 * This component takes some HTML elements, like the ones that the Markdown in
 * MDX files is turned into, and turns them into an accordion. The content
 * before the first hr (`---` in markdown) becomes the external label of the
 * accordion. The rest of the children become the content within.
 */
export function MdxAccordion({ children }: { children: ReactNode }) {
  const childArray = Children.toArray(children);
  const hrLocation = childArray.findIndex(scanForTag("hr"));
  if (hrLocation === -1) {
    // TODO: just use the first element as the header in this case
    console.error("MdxAccordion requires an <hr> (---) to separate header from content");
    return <p>ERROR</p>;
  }
  const header = childArray.slice(0, hrLocation);
  const normalChildren = childArray.slice(hrLocation + 1);
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border border-gray-200 px-4 rounded-lg my-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-sm">{header}</AccordionTrigger>
        <AccordionContent className="prose">{normalChildren}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
