import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from "@/components/ui/card"; // Using shadcn Card for slide items
import { cn } from '@/lib/utils';

export interface CarouselItem {
  id: string | number;
  content?: React.ReactNode; // If you want full custom content per slide
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  options?: Parameters<typeof useEmblaCarousel>[0];
  autoplayOptions?: Parameters<typeof Autoplay>[0];
  slideClassName?: string;
  aspectRatio?: string; // e.g., "aspect-video", "aspect-square"
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  options = { loop: true },
  autoplayOptions = { delay: 4000, stopOnInteraction: false },
  slideClassName,
  aspectRatio = "aspect-video", // Default to a video-like aspect ratio
}) => {
  const [emblaRef] = useEmblaCarousel(options, [Autoplay(autoplayOptions)]);
  console.log("Rendering Carousel with items:", items.length);

  if (!items || items.length === 0) {
    return <div className="text-center p-4">No items to display in carousel.</div>;
  }

  return (
    <div className="embla overflow-hidden rounded-lg" ref={emblaRef}>
      <div className="embla__container flex">
        {items.map((item) => (
          <div className={cn("embla__slide flex-[0_0_100%] min-w-0 p-1", slideClassName)} key={item.id}>
            {item.content ? item.content : (
              <Card className="h-full bg-neutral-800 border-neutral-700 text-white">
                <CardContent className={cn("flex flex-col items-center justify-center p-0 h-full", aspectRatio)}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title || 'Carousel image'} className="object-cover w-full h-full rounded-t-md" />
                  )}
                  {(item.title || item.subtitle) && (
                     <div className="p-4 absolute bottom-0 left-0 right-0 bg-black/50">
                        {item.title && <p className="font-semibold text-lg">{item.title}</p>}
                        {item.subtitle && <p className="text-sm text-neutral-300">{item.subtitle}</p>}
                     </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
      {/* Consider adding Prev/Next buttons and Dots if needed */}
    </div>
  );
}
export default Carousel;