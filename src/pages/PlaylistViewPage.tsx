import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import SidebarNavigationLink from '@/components/SidebarNavigationLink';
import MusicPlayerControls from '@/components/layout/MusicPlayerControls';
import SongRowItem, { Song } from '@/components/SongRowItem';
import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Renamed to avoid conflict
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // If description is editable
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Home, Search as SearchIcon, Library, Settings, Play, Shuffle, MoreHorizontal, Clock, Edit3, Trash2, Share2, GripVertical } from 'lucide-react';

const mockUser = { name: "Dora Emon", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" };

const mockPlaylistsData: { [key: string]: { name: string, description: string, creator: string, coverArt: string, songs: Song[] } } = {
  'dora-favorites': {
    name: 'Dora-Favorites',
    description: 'The ultimate collection of Doraemon theme songs and memorable tracks. Perfect for any fan!',
    creator: 'Dora Emon',
    coverArt: 'https://picsum.photos/seed/doraFavsCover/400/400',
    songs: [
      { id: 'df_s1', title: 'Yume o Kanaete Doraemon', artist: 'MAO', album: 'Doraemon Movie Hits', duration: '4:05', artworkUrl: 'https://picsum.photos/seed/doraSong4/50/50', isLiked: true },
      { id: 'df_s2', title: 'Doraemon no Uta (Movie Ver.)', artist: 'Satoko Yamano', album: 'Doraemon Movie Hits', duration: '3:20', artworkUrl: 'https://picsum.photos/seed/doraSong5/50/50', isLiked: false },
      { id: 'df_s3', title: 'Tomodachi no Uta', artist: 'BUMP OF CHICKEN', album: 'Doraemon Movie Hits', duration: '5:12', artworkUrl: 'https://picsum.photos/seed/doraSong6/50/50', isLiked: true },
      { id: 'df_s4', title: 'Mirai no Museum', artist: 'Perfume', album: 'Doraemon Movie Hits', duration: '3:55', artworkUrl: 'https://picsum.photos/seed/doraSong7/50/50', isLiked: false },
    ]
  },
  // Add more mock playlists if needed
};

const PlaylistViewPage: React.FC = () => {
  const { id: playlistId } = useParams<{ id: string }>();
  console.log(`PlaylistViewPage loaded for ID: ${playlistId}`);
  
  const playlist = playlistId ? mockPlaylistsData[playlistId] : undefined;
  
  const [songs, setSongs] = useState<Song[]>(playlist ? playlist.songs : []);
  const [playlistDescription, setPlaylistDescription] = useState(playlist?.description || '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [currentSong, setCurrentSong] = useState<Song | undefined>(playlist?.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!playlist) {
    // Handle playlist not found, perhaps redirect or show a message
    return <div className="flex h-screen bg-neutral-950 text-neutral-100 items-center justify-center">Playlist not found.</div>;
  }
  
  const totalDurationSeconds = songs.reduce((acc, song) => {
    const parts = song.duration.split(':');
    return acc + parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }, 0);
  const totalDurationFormatted = `${Math.floor(totalDurationSeconds / 3600)}h ${Math.floor((totalDurationSeconds % 3600) / 60)}m`;


  const handlePlayPause = (songId?: string) => {
     if (songId) {
        const songToPlay = songs.find(s => s.id === songId);
        if (songToPlay) {
            setCurrentSong(songToPlay);
            setIsPlaying(currentSong?.id !== songId ? true : !isPlaying);
            if (currentSong?.id !== songId) setProgress(0);
            return;
        }
    }
    // If no songId, toggle play for current playlist (play all from start or resume)
    if (!currentSong && songs.length > 0) setCurrentSong(songs[0]);
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newProgress: number) => setProgress(newProgress);

  const handleLikeToggle = (songId: string) => {
    setSongs(prevSongs => prevSongs.map(s => s.id === songId ? { ...s, isLiked: !s.isLiked } : s));
    if (currentSong?.id === songId) {
      setCurrentSong(prev => prev ? {...prev, isLiked: !prev.isLiked} : undefined);
    }
  };

  const handleSaveDescription = () => {
    console.log("Saving description:", playlistDescription);
    // mockPlaylistsData[playlistId!].description = playlistDescription; // Update mock data (not ideal for React state)
    setIsEditingDescription(false);
  };


  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      <Sidebar appName="MusicVerse" user={mockUser}>
        <SidebarNavigationLink to="/" icon={Home} label="Home" />
        <SidebarNavigationLink to="/search" icon={SearchIcon} label="Search" />
        <SidebarNavigationLink to="/library" icon={Library} label="Your Library" />
        <SidebarNavigationLink to="/settings" icon={Settings} label="Settings" />
      </Sidebar>

      <div className="flex-1 flex flex-col ml-64">
        <ScrollArea className="flex-1 pb-[120px]"> {/* No p-6 here, header is part of scroll */}
          {/* Playlist Header */}
          <header className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b from-blue-700/30 to-neutral-950">
            <ShadAvatar className="h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 rounded-md shadow-2xl">
              <AvatarImage src={playlist.coverArt} alt={playlist.name} />
              <AvatarFallback className="text-5xl bg-blue-500">{playlist.name.substring(0,1)}</AvatarFallback>
            </ShadAvatar>
            <div className="flex flex-col gap-2 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Playlist</span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white">{playlist.name}</h1>
              {isEditingDescription ? (
                <div className="mt-1">
                    <Textarea 
                        value={playlistDescription} 
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        className="bg-neutral-800/70 border-neutral-700 text-sm text-neutral-300 min-h-[80px]"
                        onBlur={handleSaveDescription}
                        autoFocus
                    />
                    <Button size="sm" onClick={handleSaveDescription} className="mt-2 bg-blue-500 hover:bg-blue-600">Save</Button>
                 </div>
              ) : (
                <p className="text-sm text-neutral-300 mt-1" onClick={() => setIsEditingDescription(true)}>{playlistDescription || "Click to add description."}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                <ShadAvatar className="h-5 w-5">
                    <AvatarImage src={mockUser.imageUrl} alt={mockUser.name}/>
                    <AvatarFallback>{mockUser.name.substring(0,1)}</AvatarFallback>
                </ShadAvatar>
                <span>{playlist.creator}</span>
                <span>•</span>
                <span>{songs.length} songs</span>
                <span>•</span>
                <Clock className="h-3 w-3 inline-block mr-1" />
                <span>{totalDurationFormatted}</span>
              </div>
            </div>
          </header>

          {/* Action Bar & Song List */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 rounded-full p-4 h-14 w-14" onClick={() => handlePlayPause()}>
                <Play className="h-7 w-7 text-black" fill="currentColor" />
              </Button>
              <Button variant="outline" size="icon" className="border-neutral-600 hover:border-white hover:text-white">
                <Shuffle className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-neutral-600 hover:border-white hover:text-white">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-neutral-100">
                  <DropdownMenuItem onClick={() => setIsEditingDescription(true)}><Edit3 className="mr-2 h-4 w-4" /> Edit Details</DropdownMenuItem>
                  <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" /> Share</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-neutral-700"/>
                  <DropdownMenuItem className="text-red-400 hover:!bg-red-500/20 hover:!text-red-300"><Trash2 className="mr-2 h-4 w-4" /> Delete Playlist</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Song List Header (optional) */}
            <div className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_1fr_auto_auto] gap-3 items-center text-xs text-neutral-400 p-2 border-b border-neutral-800 mb-2">
                <span className="text-center w-8">#</span>
                <span>Title</span>
                <span className="hidden md:block">Album</span>
                <span><Heart className="h-4 w-4 inline-block"/></span>
                <span><Clock className="h-4 w-4 inline-block"/></span>
            </div>

            {songs.map((song, index) => (
              <SongRowItem
                key={song.id}
                song={{...song, title: `${index + 1}. ${song.title}`}} // Prepend index for display
                isPlaying={isPlaying && currentSong?.id === song.id}
                isCurrentTrack={currentSong?.id === song.id}
                onPlayPause={() => handlePlayPause(song.id)}
                onLikeToggle={handleLikeToggle}
                onOptions={(id, e) => console.log('Song options for', id, e.currentTarget)}
                showAlbumArt={false} // Playlist context, song numbers often replace art in compact lists
              />
            ))}
            {songs.length === 0 && <p className="text-neutral-500 mt-4">This playlist is empty. Add some songs!</p>}
          </div>
        </ScrollArea>
        
        <MusicPlayerControls
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          onPlayPause={() => handlePlayPause()}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
};

export default PlaylistViewPage;