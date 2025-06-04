import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar'; // Assuming Avatar is also used for user profile
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Bell } from 'lucide-react'; // Example icons

interface SidebarProps {
  children: React.ReactNode; // For SidebarNavigationLink components
  appName?: string;
  user?: { name: string; imageUrl?: string };
  onSearchSubmit?: (searchTerm: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  appName = "MusicApp",
  user,
  onSearchSubmit
}) => {
  console.log("Rendering Sidebar");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get('search') as string;
    if (onSearchSubmit && searchTerm.trim()) {
      onSearchSubmit(searchTerm.trim());
    }
    console.log("Sidebar search submitted:", searchTerm);
  };

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-100 h-screen flex flex-col p-4 space-y-6 fixed top-0 left-0">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">{appName}</h1>
          {user && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback>{user.name?.substring(0, 1).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            name="search"
            placeholder="Search in Sidebar..."
            className="bg-neutral-800 border-neutral-700 placeholder-neutral-500 text-neutral-200 rounded-md pl-10 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Sidebar search"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
        </form>
      </header>

      <nav className="flex-grow space-y-1 overflow-y-auto">
        {children}
      </nav>

      <footer className="mt-auto">
        {/* Example footer content if any, like settings or notifications icon */}
        <button className="w-full flex items-center p-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 rounded-md">
          <Bell className="h-5 w-5 mr-3" />
          Notifications
        </button>
      </footer>
    </aside>
  );
}
export default Sidebar;