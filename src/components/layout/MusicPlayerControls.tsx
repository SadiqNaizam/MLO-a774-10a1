import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play, Pause, SkipForward, SkipBack, ListMusic, Volume2, Maximize2, MoreHorizontal, Repeat, Shuffle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicPlayerControlsProps {
  currentSong?: {
    id: string;
    title: string;
    artist: string;
    artworkUrl: string;
    duration: number; // in seconds
  };
  isPlaying: boolean;
  progress: number; // Current playback time in seconds
  volume?: number; // 0-100
  isRepeating?: boolean;
  isShuffled?: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek: (newProgressSeconds: number) => void;
  onVolumeChange?: (newVolume: number) => void;
  onToggleRepeat?: () => void;
  onToggleShuffle?: () => void;
  onOpenQueue?: () => void;
  onOpenLyrics?: () => void; // Assuming a lyrics feature
  onOpenOptions?: (songId: string) => void;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const MusicPlayerControls: React.FC<MusicPlayerControlsProps> = ({
  currentSong,
  isPlaying,
  progress,
  volume = 70,
  isRepeating,
  isShuffled,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleRepeat,
  onToggleShuffle,
  onOpenQueue,
  // onOpenLyrics,
  onOpenOptions,
}) => {
  console.log("Rendering MusicPlayerControls. Song:", currentSong?.title, "Playing:", isPlaying);

  const handleSeek = (value: number[]) => {
    onSeek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange?.(value[0]);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 text-neutral-200 p-3 z-50 flex items-center justify-between">
      {/* Left: Song Info */}
      <div className="flex items-center space-x-3 w-1/4">
        {currentSong ? (
          <>
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage src={currentSong.artworkUrl} alt={currentSong.title} />
              <AvatarFallback>{currentSong.title?.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold truncate" title={currentSong.title}>{currentSong.title}</p>
              <p className="text-xs text-neutral-400 truncate" title={currentSong.artist}>{currentSong.artist}</p>
            </div>
            {onOpenOptions && (
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white" onClick={() => onOpenOptions(currentSong.id)}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="text-sm text-neutral-500">No song playing</div>
        )}
      </div>

      {/* Center: Player Controls & Progress */}
      <div className="flex flex-col items-center space-y-1 w-1/2 max-w-xl">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onToggleShuffle} className={cn("text-neutral-400 hover:text-white", isShuffled && "text-blue-400")} disabled={!currentSong}>
            <Shuffle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onPrevious} className="text-neutral-400 hover:text-white" disabled={!currentSong}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            variant="primary"
            size="icon"
            onClick={onPlayPause}
            className={cn(
              "bg-blue-500 hover:bg-blue-600 rounded-full h-10 w-10 text-white",
              isPlaying && "bg-red-500 hover:bg-red-600" // Doraemon Red for pause
            )}
            disabled={!currentSong}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext} className="text-neutral-400 hover:text-white" disabled={!currentSong}>
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleRepeat} className={cn("text-neutral-400 hover:text-white", isRepeating && "text-blue-400")} disabled={!currentSong}>
            <Repeat className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-neutral-400 w-10 text-right">{formatTime(progress)}</span>
          <Slider
            value={[progress]}
            max={currentSong?.duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full data-[disabled]:opacity-50 [&>span:first-child]:h-1 [&>span:first-child>span]:bg-yellow-400" // Yellow progress bar
            disabled={!currentSong}
            aria-label="Song progress"
          />
          <span className="text-xs text-neutral-400 w-10 text-left">{formatTime(currentSong?.duration || 0)}</span>
        </div>
      </div>

      {/* Right: Volume & Other Controls */}
      <div className="flex items-center space-x-2 w-1/4 justify-end">
        {/* Example: Lyrics button, Queue button, Volume, Fullscreen */}
        {/* <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white" onClick={onOpenLyrics} disabled={!currentSong}>
            <Mic2 className="h-5 w-5" />
        </Button> */}
        {onOpenQueue && (
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white" onClick={onOpenQueue} disabled={!currentSong}>
                <ListMusic className="h-5 w-5" />
            </Button>
        )}
        <div className="flex items-center space-x-1 w-28">
            <Volume2 className="h-5 w-5 text-neutral-400" />
            <Slider
                defaultValue={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-full [&>span:first-child]:h-1 [&>span:first-child>span]:bg-white"
                aria-label="Volume control"
            />
        </div>
        {/* <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
            <Maximize2 className="h-5 w-5" />
        </Button> */}
      </div>
    </footer>
  );
}
export default MusicPlayerControls;