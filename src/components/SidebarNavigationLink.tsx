import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { cn } from '@/lib/utils'; // For conditional class names

interface SidebarNavigationLinkProps {
  to: string;
  icon?: React.ElementType; // e.g., Lucide icon component
  label: string;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

const SidebarNavigationLink: React.FC<SidebarNavigationLinkProps> = ({
  to,
  icon: Icon,
  label,
  className,
  activeClassName = "bg-neutral-700 text-white border-l-4 border-blue-400", // Doraemon Blue accent for active
  inactiveClassName = "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100",
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
  console.log(`Rendering SidebarNavigationLink for ${label}, isActive: ${isActive}`);

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center p-3 space-x-3 rounded-md transition-colors duration-150",
        isActive ? activeClassName : inactiveClassName,
        className
      )}
    >
      {Icon && <Icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "")} />}
      <span>{label}</span>
    </Link>
  );
}
export default SidebarNavigationLink;