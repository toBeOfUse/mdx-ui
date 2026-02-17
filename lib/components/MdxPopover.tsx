import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Children, type ReactNode } from "react";
import { scanForTag } from "../utils";

export function MdxPopover({ children }: { children: ReactNode }) {
  const childArray = Children.toArray(children);
  const header = childArray.find(scanForTag("h5"));
  if (!header) {
    console.error("MdxPopover requires an <h5> (##### in markdown) as the button label");
    // TODO: just use the first child as the button label in this case, i guess
    return <p>ERROR</p>;
  }
  const normalChildren = childArray.filter((c) => c !== header);

  return (
    <div className="py-6 flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="cursor-pointer" variant="secondary">
            {header}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 prose dark:prose-invert">{normalChildren}</PopoverContent>
      </Popover>
    </div>
  );
}
