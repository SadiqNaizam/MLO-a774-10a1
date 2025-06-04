import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import SidebarNavigationLink from '@/components/SidebarNavigationLink';
import Carousel, { CarouselItem } from '@/components/Carousel';
import ContentCard from '@/components/ContentCard';
import MusicPlayerControls from '@/components/layout/MusicPlayerControls';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search as SearchIcon, Library, Music, Settings, Bell, Play } from 'lucide-react'; // Added Play
import { Song } from '@/components/SongRowItem'; // For MusicPlayerControls currentSong

// Mock Data
const mockUser = { name: "Dora Emon", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" }; // Pikachu as Dora Emon

const carouselItems: CarouselItem[] = [
  { id: 'c1', title: 'Doraemon\'s Gadget Grooves', subtitle: 'Catchy tunes for every adventure!', imageUrl: 'https://picsum.photos/seed/dora1/800/450' },
  { id: 'c2', title: 'Nobita\'s Study Beats', subtitle: 'Focus music for homework time.', imageUrl: 'https://picsum.photos/seed/dora2/800/450' },
  { id: 'c3', title: 'Future Funk Fest', subtitle: 'Sounds from the 22nd Century!', imageUrl: 'https://picsum.photos/seed/dora3/800/450' },
];

const mockContent = (type: 'album' | 'playlist' | 'artist', count: number, seedPrefix: string) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${seedPrefix}${i + 1}`,
    title: `${seedPrefix.charAt(0).toUpperCase() + seedPrefix.slice(1)} ${type === 'playlist' ? 'Mix' : 'Album'} ${i + 1}`,
    subtitle: type === 'artist' ? `Artist ${i + 1}` : `Various Artists`,
    imageUrl: `https://picsum.photos/seed/${seedPrefix}${i + 1}/300/300`,
    type,
  }));

const HomePage: React.FC = () => {
  console.log('HomePage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSong, setCurrentSong] = useState<Song | undefined>({
    id: 'hp_song_1',
    title: 'Yume o Kanaete Doraemon',
    artist: 'MAO',
    artworkUrl: 'https://picsum.photos/seed/doraemonSong/100/100',
    duration: 245, // in seconds
    album: 'Doraemon Soundtrack'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSeek = (newProgress: number) => setProgress(newProgress);

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      <Sidebar appName="MusicVerse" user={mockUser}>
        <SidebarNavigationLink to="/" icon={Home} label="Home" />
        <SidebarNavigationLink to="/search" icon={SearchIcon} label="Search" />
        <SidebarNavigationLink to="/library" icon={Library} label="Your Library" />
        <SidebarNavigationLink to="/settings" icon={Settings} label="Settings" />
      </Sidebar>

      <div className="flex-1 flex flex-col ml-64"> {/* Ensure this ml matches sidebar width */}
        {/* Top bar in main content */}
        <header className="p-4 sticky top-0 bg-neutral-950/80 backdrop-blur-sm z-10 flex items-center justify-between border-b border-neutral-800">
          <div className="relative w-1/3">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              type="search"
              placeholder="Search artists, songs, podcasts..."
              className="bg-neutral-800 border-neutral-700 placeholder-neutral-500 text-neutral-200 rounded-full pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                <Bell className="h-5 w-5"/>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={mockUser.imageUrl} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6 pb-[120px]"> {/* Adjusted pb for player */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Featured Gadgets</h2>
            <Carousel items={carouselItems} aspectRatio="aspect-[16/7]" />
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Top Charts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {mockContent('album', 6, 'top').map(item => (
                <ContentCard key={item.id} {...item} onClick={() => console.log(`Clicked ${item.title}`)} />
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Recommended Playlists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {mockContent('playlist', 6, 'rec').map(item => (
                <ContentCard key={item.id} {...item} onClick={() => console.log(`Clicked ${item.title}`)} />
              ))}
            </div>
          </section>

           <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Recently Played</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {mockContent('artist', 6, 'recent').map(item => (
                <ContentCard key={item.id} {...item} onClick={() => console.log(`Clicked ${item.title}`)} />
              ))}
            </div>
          </section>
        </ScrollArea>
        
        <MusicPlayerControls
          currentSong={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          // Mock handlers for other controls
          onNext={() => console.log('Next song')}
          onPrevious={() => console.log('Previous song')}
          volume={70}
          onVolumeChange={(v) => console.log('Volume changed to', v)}
          onToggleRepeat={() => console.log('Toggle repeat')}
          onToggleShuffle={() => console.log('Toggle shuffle')}
        />
      </div>
    </div>
  );
};

export default HomePage;