import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayCircle } from 'lucide-react'; // Example icon
import { cn } from '@/lib/utils';

interface ContentCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  type: 'album' | 'artist' | 'playlist' | 'song' | 'generic';
  onClick?: () => void;
  className?: string;
  imageClassName?: string;
  showPlayButtonOnHover?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  imageUrl,
  title,
  subtitle,
  type,
  onClick,
  className,
  imageClassName,
  showPlayButtonOnHover = true,
}) => {
  console.log(`Rendering ContentCard: ${title} (Type: ${type})`);

  const isArtist = type === 'artist';

  return (
    <Card
      className={cn(
        "w-full bg-neutral-800 hover:bg-neutral-700/80 transition-all duration-200 group rounded-lg overflow-hidden border-none text-white",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="p-0 relative">
        <div className={cn("aspect-square w-full relative", imageClassName)}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className={cn(
              "object-cover w-full h-full",
              isArtist ? "rounded-full p-2" : "rounded-t-lg" // Artists get circular images with padding
            )}
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
          {showPlayButtonOnHover && onClick && (
             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-blue-400" strokeWidth={1.5}/>
             </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <CardTitle className="text-base font-semibold truncate" title={title}>{title}</CardTitle>
        {subtitle && <p className="text-xs text-neutral-400 truncate" title={subtitle}>{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
export default ContentCard;