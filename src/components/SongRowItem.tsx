import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Play, Pause, MoreHorizontal, Heart, CheckCircle } from 'lucide-react'; // Added Heart, CheckCircle
import { cn } from '@/lib/utils';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string; // e.g., "3:45"
  artworkUrl?: string;
  isLiked?: boolean;
}

interface SongRowItemProps {
  song: Song;
  isPlaying?: boolean; // Is this specific song currently playing?
  isCurrentTrack?: boolean; // Is this the song loaded in the player (even if paused)?
  onPlayPause: (songId: string) => void; // Toggles play/pause for this song
  onOptions?: (songId: string, event: React.MouseEvent) => void;
  onLikeToggle?: (songId: string) => void;
  className?: string;
  showAlbumArt?: boolean;
  showArtist?: boolean;
  showAlbum?: boolean;
}

const SongRowItem: React.FC<SongRowItemProps> = ({
  song,
  isPlaying = false,
  isCurrentTrack = false,
  onPlayPause,
  onOptions,
  onLikeToggle,
  className,
  showAlbumArt = true,
  showArtist = true,
  showAlbum = true,
}) => {
  console.log(`Rendering SongRowItem: ${song.title}, Playing: ${isPlaying}, Current: ${isCurrentTrack}`);

  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click if play button is clicked
    onPlayPause(song.id);
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOptions?.(song.id, e);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle?.(song.id);
  };


  return (
    <div
      className={cn(
        "flex items-center p-2 pr-3 space-x-3 hover:bg-neutral-800/70 rounded-md cursor-default transition-colors group",
        isCurrentTrack ? "bg-neutral-700/50" : "",
        className
      )}
      onClick={() => { if (!isCurrentTrack) onPlayPause(song.id); }} // Play if not current track
      role="button"
      tabIndex={0}
      aria-label={`Play song ${song.title} by ${song.artist}`}
    >
      {showAlbumArt && (
        <div className="relative w-10 h-10 flex-shrink-0">
            <Avatar className="h-10 w-10 rounded">
                <AvatarImage src={song.artworkUrl} alt={song.title} />
                <AvatarFallback>{song.title?.substring(0,1)}</AvatarFallback>
            </Avatar>
            <button
                onClick={handlePlayPauseClick}
                className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black/50 rounded transition-opacity",
                    isCurrentTrack ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                aria-label={isPlaying && isCurrentTrack ? "Pause" : "Play"}
            >
                {isPlaying && isCurrentTrack ? (
                    <Pause className="h-5 w-5 text-white" />
                ) : (
                    <Play className="h-5 w-5 text-white" />
                )}
            </button>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", isCurrentTrack ? "text-blue-400" : "text-neutral-100")} title={song.title}>
          {song.title}
        </p>
        {showArtist && <p className="text-xs text-neutral-400 truncate" title={song.artist}>{song.artist}</p>}
      </div>

      {showAlbum && song.album && (
        <p className="text-xs text-neutral-400 truncate hidden md:block w-1/4" title={song.album}>{song.album}</p>
      )}

      {onLikeToggle && (
         <Button
            variant="ghost"
            size="icon"
            onClick={handleLikeClick}
            className={cn(
                "text-neutral-500 hover:text-white ml-auto opacity-0 group-hover:opacity-100 focus:opacity-100",
                song.isLiked && "opacity-100 text-blue-400" // Doraemon Blue for liked
            )}
            aria-label={song.isLiked ? "Unlike song" : "Like song"}
        >
            {song.isLiked ? <CheckCircle className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
        </Button>
      )}


      <p className="text-xs text-neutral-400 w-10 text-right">{song.duration}</p>

      {onOptions && (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleOptionsClick}
            className="text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="More options"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
export default SongRowItem;