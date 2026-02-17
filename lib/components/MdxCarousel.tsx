import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Children, type ReactNode } from "react";
import { reactChildIsTag } from "../utils";

/**
 * This component takes some HTML elements, like the ones that the Markdown in
 * MDX files is turned into, and turns them into a carousel. Each <h3> becomes
 * the heading of a new card within the carousel. Content after the header is
 * inserted into that card until the next <h3> is found, creating a new card.
 */
export function MdxCarousel({ children }: { children: ReactNode }) {
  const childArray = Children.toArray(children);
  if (!reactChildIsTag(childArray[0], "h3")) {
    console.error("first child within the MdxCarousel must be an h3");
    return <p>ERROR</p>;
  }

  const cards: { header: ReactNode; content: ReactNode[] }[] = [];

  for (const child of childArray) {
    if (reactChildIsTag(child, "h3")) {
      cards.push({ header: child, content: [] });
    } else {
      cards.at(-1)!.content.push(child);
    }
  }

  return (
    <Carousel className="w-full max-w-sm mx-auto">
      <CarouselContent className="h-full">
        {cards.map(({ header, content }, index) => (
          <CarouselItem key={index} className="h-auto">
            <Card className="h-full">
              <CardContent className="prose dark:prose-invert flex flex-col items-center justify-center p-6">
                {header}
                {content}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
