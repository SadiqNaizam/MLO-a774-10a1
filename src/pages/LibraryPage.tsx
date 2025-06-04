import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import SidebarNavigationLink from '@/components/SidebarNavigationLink';
import MusicPlayerControls from '@/components/layout/MusicPlayerControls';
import SongRowItem, { Song } from '@/components/SongRowItem';
import ContentCard from '@/components/ContentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search as SearchIcon, Library, PlusCircle, Settings, Heart, ListMusic } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // For toast notifications
import { Toaster } from "@/components/ui/sonner"; // Assuming sonner for notifications based on example

const mockUser = { name: "Dora Emon", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" };

const initialLikedSongs: Song[] = [
  { id: 'lib_s1', title: 'Pocket o Tatakeba', artist: 'Nobuyo Ōyama', album: 'Doraemon Classics', duration: '3:05', artworkUrl: 'https://picsum.photos/seed/doraLike1/50/50', isLiked: true },
  { id: 'lib_s2', title: 'Aoi Sora wa Pocket Sa', artist: 'Kumiko Ōsugi', album: 'More Doraemon', duration: '2:40', artworkUrl: 'https://picsum.photos/seed/doraLike2/50/50', isLiked: true },
];

const initialPlaylists = [
  { id: 'lib_pl1', title: 'Dora-Favorites', subtitle: 'My top Doraemon tunes', imageUrl: 'https://picsum.photos/seed/doraFavs/300/300', type: 'playlist' as const, songCount: 5 },
  { id: 'lib_pl2', title: 'Future Gadget Beats', subtitle: 'Instrumental wonders', imageUrl: 'https://picsum.photos/seed/doraGadget/300/300', type: 'playlist' as const, songCount: 12 },
];

const LibraryPage: React.FC = () => {
  console.log('LibraryPage loaded');
  const { toast } = useToast();
  const [likedSongs, setLikedSongs] = useState<Song[]>(initialLikedSongs);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const [currentSong, setCurrentSong] = useState<Song | undefined>(initialLikedSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = (songId?: string) => {
    if (songId) {
        const songToPlay = likedSongs.find(s => s.id === songId);
        if (songToPlay) {
            setCurrentSong(songToPlay);
            setIsPlaying(currentSong?.id !== songId ? true : !isPlaying);
            if (currentSong?.id !== songId) setProgress(0);
            return;
        }
    }
    setIsPlaying(!isPlaying);
  };
  const handleSeek = (newProgress: number) => setProgress(newProgress);
  
  const handleLikeToggle = (songId: string) => {
    setLikedSongs(prevSongs => prevSongs.map(s => s.id === songId ? { ...s, isLiked: !s.isLiked } : s).filter(s => s.isLiked));
    console.log(`Toggled like for song ${songId} in library`);
    // If the currently playing song is unliked from library, update its state too
    if (currentSong?.id === songId) {
        setCurrentSong(prev => prev ? {...prev, isLiked: !prev.isLiked} : undefined);
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() === '') {
      toast({ title: "Error", description: "Playlist name cannot be empty.", variant: "destructive" });
      return;
    }
    const newPlaylist = {
      id: `pl_${Date.now()}`,
      title: newPlaylistName,
      subtitle: `Created by ${mockUser.name}`,
      imageUrl: `https://picsum.photos/seed/${newPlaylistName.replace(/\s/g, '')}/300/300`,
      type: 'playlist' as const,
      songCount: 0,
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    setNewPlaylistName('');
    setIsCreatePlaylistDialogOpen(false);
    toast({ title: "Playlist Created!", description: `"${newPlaylist.title}" has been created.`});
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
        <header className="p-6 sticky top-0 bg-neutral-950/80 backdrop-blur-sm z-10 border-b border-neutral-800 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-400">Your Library</h1>
             <Dialog open={isCreatePlaylistDialogOpen} onOpenChange={setIsCreatePlaylistDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Playlist
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-neutral-800 border-neutral-700 text-neutral-100">
                    <DialogHeader>
                    <DialogTitle className="text-blue-400">Create New Playlist</DialogTitle>
                    <DialogDescription>
                        Give your new playlist a name. You can add songs later.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <Input
                        id="playlistName"
                        placeholder="E.g., Dora-Favorites"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="bg-neutral-700 border-neutral-600 placeholder-neutral-500"
                    />
                    </div>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatePlaylistDialogOpen(false)} className="text-neutral-300 border-neutral-600 hover:bg-neutral-700">Cancel</Button>
                    <Button type="submit" onClick={handleCreatePlaylist} className="bg-red-500 hover:bg-red-600 text-white">Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
        
        <ScrollArea className="flex-1 p-6 pb-[120px]">
          <Tabs defaultValue="playlists" className="w-full">
            <TabsList className="mb-4 bg-neutral-800">
              <TabsTrigger value="playlists" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"><ListMusic className="mr-2 h-4 w-4" /> Playlists ({playlists.length})</TabsTrigger>
              <TabsTrigger value="likedSongs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"><Heart className="mr-2 h-4 w-4" /> Liked Songs ({likedSongs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="playlists">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {playlists.map(playlist => (
                  <ContentCard 
                    key={playlist.id} 
                    {...playlist} 
                    subtitle={`${playlist.songCount} songs`}
                    onClick={() => console.log(`View playlist ${playlist.title}`)} 
                  />
                ))}
              </div>
              {playlists.length === 0 && <p className="text-neutral-500 mt-4">You haven't created or followed any playlists yet.</p>}
            </TabsContent>

            <TabsContent value="likedSongs">
              {likedSongs.length > 0 ? (
                likedSongs.map(song => (
                  <SongRowItem 
                    key={song.id} 
                    song={song} 
                    onPlayPause={() => handlePlayPause(song.id)}
                    onLikeToggle={handleLikeToggle}
                    isPlaying={isPlaying && currentSong?.id === song.id}
                    isCurrentTrack={currentSong?.id === song.id}
                    onOptions={(id, e) => console.log('Options for song', id, e.currentTarget)}
                  />
                ))
              ) : <p className="text-neutral-500 mt-4">Songs you like will appear here. Start exploring!</p>}
            </TabsContent>
          </Tabs>
        </ScrollArea>
        
        <MusicPlayerControls
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          onPlayPause={() => handlePlayPause()}
          onSeek={handleSeek}
        />
        <Toaster /> {/* For sonner notifications */}
      </div>
    </div>
  );
};

export default LibraryPage;