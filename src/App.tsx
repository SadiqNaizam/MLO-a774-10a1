import { Toaster as ShadToaster } from "@/components/ui/toaster"; // Renamed to avoid conflict
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Renamed to avoid conflict
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import LibraryPage from "./pages/LibraryPage";
import PlaylistViewPage from "./pages/PlaylistViewPage";
import AlbumArtistPage from "./pages/AlbumArtistPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShadToaster /> {/* Shadcn Toaster */}
      <SonnerToaster /> {/* Sonner Toaster */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/playlist/:id" element={<PlaylistViewPage />} />
          {/* Mock IDs for testing the routes directly */}
          <Route path="/album/chronosonic" element={<AlbumArtistPage viewType="album" />} /> 
          <Route path="/artist/doraemon-band" element={<AlbumArtistPage viewType="artist" />} />
          {/* Generic routes for dynamic IDs */}
          <Route path="/album/:id" element={<AlbumArtistPage viewType="album" />} />
          <Route path="/artist/:id" element={<AlbumArtistPage viewType="artist" />} />
          
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;