import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import SidebarNavigationLink from '@/components/SidebarNavigationLink';
import MusicPlayerControls from '@/components/layout/MusicPlayerControls';
import SongRowItem, { Song } from '@/components/SongRowItem';
import ContentCard from '@/components/ContentCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search as SearchIcon, Library, ListMusic, Disc, UserCircle, Settings } from 'lucide-react';

const mockUser = { name: "Dora Emon", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" };

const allSongs: Song[] = [
  { id: 's1', title: 'Doraemon no Uta', artist: 'Kumiko Osugi', album: 'Doraemon OST', duration: '3:15', artworkUrl: 'https://picsum.photos/seed/doraSong1/50/50', isLiked: true },
  { id: 's2', title: 'Boku Doraemon', artist: 'Nobuyo Ōyama', album: 'Doraemon Hits', duration: '2:50', artworkUrl: 'https://picsum.photos/seed/doraSong2/50/50', isLiked: false },
  { id: 's3', title: 'Himawari no Yakusoku', artist: 'Motohiro Hata', album: 'Stand By Me Doraemon OST', duration: '4:30', artworkUrl: 'https://picsum.photos/seed/doraSong3/50/50', isLiked: true },
];

const allArtists = Array.from({ length: 5 }, (_, i) => ({
  id: `art${i + 1}`, title: `Artist ${i + 1}`, subtitle: 'Pop', imageUrl: `https://picsum.photos/seed/artist${i + 1}/300/300`, type: 'artist' as const
}));
const allAlbums = Array.from({ length: 5 }, (_, i) => ({
  id: `alb${i + 1}`, title: `Album ${i + 1}`, subtitle: `Artist ${i % 2 + 1}`, imageUrl: `https://picsum.photos/seed/album${i + 1}/300/300`, type: 'album' as const
}));
const allPlaylists = Array.from({ length: 5 }, (_, i) => ({
  id: `pl${i + 1}`, title: `Playlist ${i + 1}`, subtitle: 'Curated Mix', imageUrl: `https://picsum.photos/seed/playlist${i + 1}/300/300`, type: 'playlist' as const
}));


const SearchPage: React.FC = () => {
  console.log('SearchPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ songs: Song[], artists: any[], albums: any[], playlists: any[] }>({ songs: [], artists: [], albums: [], playlists: [] });

  const [currentSong, setCurrentSong] = useState<Song | undefined>(allSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      return;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    setSearchResults({
      songs: allSongs.filter(s => s.title.toLowerCase().includes(lowerSearchTerm) || s.artist.toLowerCase().includes(lowerSearchTerm)),
      artists: allArtists.filter(a => a.title.toLowerCase().includes(lowerSearchTerm)),
      albums: allAlbums.filter(alb => alb.title.toLowerCase().includes(lowerSearchTerm) || alb.subtitle.toLowerCase().includes(lowerSearchTerm)),
      playlists: allPlaylists.filter(p => p.title.toLowerCase().includes(lowerSearchTerm)),
    });
  }, [searchTerm]);

  const handlePlayPause = (songId?: string) => {
    if (songId && currentSong?.id !== songId) {
        const songToPlay = allSongs.find(s => s.id === songId);
        setCurrentSong(songToPlay);
        setIsPlaying(true);
        setProgress(0);
    } else {
        setIsPlaying(!isPlaying);
    }
  };
  const handleSeek = (newProgress: number) => setProgress(newProgress);
  const handleLikeToggle = (songId: string) => {
    // Mock like toggle
    const updatedSongs = searchResults.songs.map(s => s.id === songId ? {...s, isLiked: !s.isLiked} : s);
    const updatedAllSongs = allSongs.map(s => s.id === songId ? {...s, isLiked: !s.isLiked} : s);
    // This local update won't persist or reflect in player if song is current
    setSearchResults(prev => ({...prev, songs: updatedSongs}));
    // Update global mock if needed for consistency across potential re-renders
    // allSongs = updatedAllSongs; // Not ideal, but for mock purposes
    console.log(`Toggled like for song ${songId}`);
  };


  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      <Sidebar appName="MusicVerse" user={mockUser} onSearchSubmit={(term) => setSearchTerm(term)}>
        <SidebarNavigationLink to="/" icon={Home} label="Home" />
        <SidebarNavigationLink to="/search" icon={SearchIcon} label="Search" />
        <SidebarNavigationLink to="/library" icon={Library} label="Your Library" />
        <SidebarNavigationLink to="/settings" icon={Settings} label="Settings" />
      </Sidebar>

      <div className="flex-1 flex flex-col ml-64">
        <header className="p-4 sticky top-0 bg-neutral-950/80 backdrop-blur-sm z-10 border-b border-neutral-800">
          <Input
            type="search"
            placeholder="What do you want to listen to?"
            className="w-full max-w-lg mx-auto bg-neutral-800 border-neutral-700 placeholder-neutral-500 text-neutral-200 rounded-full h-12 text-base pl-5 pr-12 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Main search field"
          />
        </header>

        <ScrollArea className="flex-1 p-6 pb-[120px]">
          {searchTerm.trim() === '' ? (
            <div className="text-center text-neutral-500 mt-10">
                <SearchIcon className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
                <p className="text-xl">Search for your favorite music.</p>
                <p>Find songs, artists, albums, or playlists.</p>
            </div>
          ) : (
            <Tabs defaultValue="songs" className="w-full">
              <TabsList className="mb-4 bg-neutral-800">
                <TabsTrigger value="songs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Songs ({searchResults.songs.length})</TabsTrigger>
                <TabsTrigger value="artists" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Artists ({searchResults.artists.length})</TabsTrigger>
                <TabsTrigger value="albums" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Albums ({searchResults.albums.length})</TabsTrigger>
                <TabsTrigger value="playlists" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Playlists ({searchResults.playlists.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="songs">
                {searchResults.songs.length > 0 ? (
                  searchResults.songs.map(song => (
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
                ) : <p className="text-neutral-500">No songs found for "{searchTerm}".</p>}
              </TabsContent>
              <TabsContent value="artists">
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {searchResults.artists.length > 0 ? (
                        searchResults.artists.map(artist => <ContentCard key={artist.id} {...artist} onClick={() => console.log('View artist', artist.title)} />)
                    ) : <p className="text-neutral-500 col-span-full">No artists found for "{searchTerm}".</p>}
                 </div>
              </TabsContent>
              <TabsContent value="albums">
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {searchResults.albums.length > 0 ? (
                        searchResults.albums.map(album => <ContentCard key={album.id} {...album} onClick={() => console.log('View album', album.title)} />)
                    ) : <p className="text-neutral-500 col-span-full">No albums found for "{searchTerm}".</p>}
                 </div>
              </TabsContent>
              <TabsContent value="playlists">
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {searchResults.playlists.length > 0 ? (
                        searchResults.playlists.map(playlist => <ContentCard key={playlist.id} {...playlist} onClick={() => console.log('View playlist', playlist.title)} />)
                    ) : <p className="text-neutral-500 col-span-full">No playlists found for "{searchTerm}".</p>}
                 </div>
              </TabsContent>
            </Tabs>
          )}
        </ScrollArea>

        <MusicPlayerControls
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          onPlayPause={() => handlePlayPause()}
          onSeek={handleSeek}
          onNext={() => console.log('Next song')}
          onPrevious={() => console.log('Previous song')}
        />
      </div>
    </div>
  );
};

export default SearchPage;