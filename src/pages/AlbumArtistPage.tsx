import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import SidebarNavigationLink from '@/components/SidebarNavigationLink';
import MusicPlayerControls from '@/components/layout/MusicPlayerControls';
import SongRowItem, { Song } from '@/components/SongRowItem';
import ContentCard from '@/components/ContentCard';
import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search as SearchIcon, Library, Settings, Play, Heart, UserCircle, Disc, ListMusic, Dot } from 'lucide-react';

const mockUser = { name: "Dora Emon", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" };

interface AlbumArtistPageProps {
  viewType: 'album' | 'artist';
}

const mockArtistData: { [key: string]: { name: string, bio: string, imageUrl: string, topSongs: Song[], albums: any[], singles: any[] } } = {
    'doraemon-band': {
        name: "Doraemon & The Future Gadgets",
        bio: "A sensational band from the 22nd century, known for their catchy tunes and time-traveling anthems. Led by the charismatic Doraemon.",
        imageUrl: 'https://picsum.photos/seed/doraBand/400/400',
        topSongs: [
            { id: 'ts1', title: 'Time Machine Boogie', artist: 'Doraemon & The Future Gadgets', album: 'ChronoSonic', duration: '3:45', artworkUrl: 'https://picsum.photos/seed/ts1/50/50', isLiked: true},
            { id: 'ts2', title: 'Anywhere Door Pop', artist: 'Doraemon & The Future Gadgets', album: 'Pocket Dimensions', duration: '4:02', artworkUrl: 'https://picsum.photos/seed/ts2/50/50', isLiked: false},
        ],
        albums: [
            { id: 'alb_chrono', title: 'ChronoSonic', subtitle: '2023', imageUrl: 'https://picsum.photos/seed/chronoAlbum/300/300', type: 'album' as const},
            { id: 'alb_pocket', title: 'Pocket Dimensions', subtitle: '2021', imageUrl: 'https://picsum.photos/seed/pocketAlbum/300/300', type: 'album'as const },
        ],
        singles: [
             { id: 'sgl_take', title: 'Take-copter Twist', subtitle: 'Single', imageUrl: 'https://picsum.photos/seed/takeSingle/300/300', type: 'album' as const}, // Using album type for ContentCard
        ]
    }
};
const mockAlbumData: { [key: string]: { name: string, artist: string, releaseDate: string, coverArt: string, tracks: Song[] } } = {
    'chronosonic': {
        name: 'ChronoSonic',
        artist: 'Doraemon & The Future Gadgets',
        releaseDate: 'October 26, 2023',
        coverArt: 'https://picsum.photos/seed/chronoAlbum/400/400',
        tracks: [
            { id: 'cs_t1', title: 'Intro: The Bell Chimes', artist: 'Doraemon & The Future Gadgets', album: 'ChronoSonic', duration: '1:10', artworkUrl: 'https://picsum.photos/seed/chronoAlbum/50/50', isLiked: false },
            { id: 'ts1', title: 'Time Machine Boogie', artist: 'Doraemon & The Future Gadgets', album: 'ChronoSonic', duration: '3:45', artworkUrl: 'https://picsum.photos/seed/chronoAlbum/50/50', isLiked: true},
            { id: 'cs_t2', title: 'Gadget Groove', artist: 'Doraemon & The Future Gadgets', album: 'ChronoSonic', duration: '3:15', artworkUrl: 'https://picsum.photos/seed/chronoAlbum/50/50', isLiked: false},
        ]
    }
};


const AlbumArtistPage: React.FC<AlbumArtistPageProps> = ({ viewType }) => {
  const { id } = useParams<{ id: string }>();
  console.log(`${viewType === 'album' ? 'Album' : 'Artist'}Page loaded for ID: ${id}, ViewType: ${viewType}`);

  const [pageData, setPageData] = useState<any>(null); // Generic state for album or artist data
  const [songsToList, setSongsToList] = useState<Song[]>([]);

  const [currentSong, setCurrentSong] = useState<Song | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (id) {
      if (viewType === 'album') {
        const album = mockAlbumData[id];
        setPageData(album);
        setSongsToList(album?.tracks || []);
        if (album?.tracks?.length) setCurrentSong(album.tracks[0]);
      } else { // artist
        const artist = mockArtistData[id];
        setPageData(artist);
        setSongsToList(artist?.topSongs || []); // Default to showing top songs
         if (artist?.topSongs?.length) setCurrentSong(artist.topSongs[0]);
      }
    }
  }, [id, viewType]);

  if (!pageData) {
    return <div className="flex h-screen bg-neutral-950 text-neutral-100 items-center justify-center">Content not found.</div>;
  }

  const handlePlayPause = (songId?: string) => {
    let songToPlay: Song | undefined;
    if (songId) {
        songToPlay = songsToList.find(s => s.id === songId) || pageData.topSongs?.find((s:Song) => s.id === songId) || pageData.tracks?.find((s:Song) => s.id === songId);
    } else if (!currentSong && songsToList.length > 0) {
        songToPlay = songsToList[0];
    }

    if (songToPlay) {
        setCurrentSong(songToPlay);
        setIsPlaying(currentSong?.id !== songToPlay.id ? true : !isPlaying);
        if (currentSong?.id !== songToPlay.id) setProgress(0);
    } else {
         setIsPlaying(!isPlaying); // Toggle for current song if no new one
    }
  };
  const handleSeek = (newProgress: number) => setProgress(newProgress);

  const handleLikeToggle = (songId: string) => {
    const updateSongList = (list: Song[]) => list.map(s => s.id === songId ? { ...s, isLiked: !s.isLiked } : s);
    
    if (viewType === 'album') {
        setPageData((prev:any) => ({...prev, tracks: updateSongList(prev.tracks)}));
        setSongsToList(updateSongList(songsToList));
    } else { // artist
        setPageData((prev:any) => ({...prev, topSongs: updateSongList(prev.topSongs)}));
        setSongsToList(updateSongList(songsToList));
    }
    if (currentSong?.id === songId) {
      setCurrentSong(prev => prev ? {...prev, isLiked: !prev.isLiked} : undefined);
    }
  };

  const commonHeader = (
    <header className={`p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b ${viewType === 'artist' ? 'from-red-700/30' : 'from-purple-700/30'} to-neutral-950`}>
        <ShadAvatar className={`h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 shadow-2xl ${viewType === 'artist' ? 'rounded-full' : 'rounded-md'}`}>
        <AvatarImage src={pageData.imageUrl || pageData.coverArt} alt={pageData.name} />
        <AvatarFallback className="text-5xl bg-neutral-600">{pageData.name.substring(0,1)}</AvatarFallback>
        </ShadAvatar>
        <div className="flex flex-col gap-2 text-center md:text-left">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">{viewType}</span>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white">{pageData.name}</h1>
        {viewType === 'album' && <p className="text-sm text-neutral-300 mt-1">By {pageData.artist} • {pageData.releaseDate} • {pageData.tracks.length} songs</p>}
        {viewType === 'artist' && <p className="text-sm text-neutral-300 mt-1 line-clamp-2">{pageData.bio}</p>}
        </div>
    </header>
  );

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      <Sidebar appName="MusicVerse" user={mockUser}>
        <SidebarNavigationLink to="/" icon={Home} label="Home" />
        <SidebarNavigationLink to="/search" icon={SearchIcon} label="Search" />
        <SidebarNavigationLink to="/library" icon={Library} label="Your Library" />
        <SidebarNavigationLink to="/settings" icon={Settings} label="Settings" />
      </Sidebar>

      <div className="flex-1 flex flex-col ml-64">
        <ScrollArea className="flex-1 pb-[120px]">
          {commonHeader}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 rounded-full p-4 h-14 w-14" onClick={() => handlePlayPause()}>
                <Play className="h-7 w-7 text-black" fill="currentColor" />
              </Button>
              {viewType === 'artist' && <Button variant="outline" className="border-neutral-600 hover:border-white hover:text-white">Follow</Button>}
              {/* Add more actions like Shuffle for album, Options, etc. */}
            </div>

            {viewType === 'album' && (
              <>
                <h2 className="text-xl font-semibold mb-3">Tracklist</h2>
                {pageData.tracks.map((song: Song, index: number) => (
                  <SongRowItem key={song.id} song={{...song, title: `${index + 1}. ${song.title}`}} 
                    isPlaying={isPlaying && currentSong?.id === song.id}
                    isCurrentTrack={currentSong?.id === song.id}
                    onPlayPause={() => handlePlayPause(song.id)}
                    onLikeToggle={handleLikeToggle}
                    showAlbumArt={false} 
                  />
                ))}
              </>
            )}

            {viewType === 'artist' && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4 bg-neutral-800">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Overview</TabsTrigger>
                  <TabsTrigger value="albums" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Albums ({pageData.albums.length})</TabsTrigger>
                  <TabsTrigger value="singles" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Singles ({pageData.singles.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <h3 className="text-lg font-semibold mb-2">Top Songs</h3>
                  {pageData.topSongs.map((song: Song, index: number) => (
                    <SongRowItem key={song.id} song={{...song, title: `${index + 1}. ${song.title}`}} 
                        isPlaying={isPlaying && currentSong?.id === song.id}
                        isCurrentTrack={currentSong?.id === song.id}
                        onPlayPause={() => handlePlayPause(song.id)}
                        onLikeToggle={handleLikeToggle}
                     />
                  ))}
                </TabsContent>
                <TabsContent value="albums">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {pageData.albums.map((album: any) => <ContentCard key={album.id} {...album} onClick={() => console.log('View album', album.title)} />)}
                    </div>
                </TabsContent>
                <TabsContent value="singles">
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {pageData.singles.map((single: any) => <ContentCard key={single.id} {...single} onClick={() => console.log('View single', single.title)} />)}
                    </div>
                </TabsContent>
              </Tabs>
            )}
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

export default AlbumArtistPage;