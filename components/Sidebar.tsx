'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Settings, Package, Users, Menu, X, MessageSquare, Bell, LayoutDashboard, Calendar } from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}
interface SidebarProps {
    children: React.ReactNode;
    role: string;
}


const Sidebar = ({ children, role}: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // 768px adalah breakpoint 'md' di Tailwind
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getNavItems = (userRole: string): NavItem[] => {
        switch (userRole) {
            case 'admin':
                return [
                    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
                    { name: 'Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
                    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
                    { name: 'Reviews', href: '/dashboard/admin/reviews', icon: Bell },
                    { name: 'Activity Logs', href: '/dashboard/admin/activity', icon: Settings },
                ];
            case 'seller':
                return [
                    { name: 'Dashboard', href: '/dashboard/seller', icon: Home },
                    { name: 'Packages', href: '/dashboard/seller/packages', icon: Package },
                    { name: 'Bookings', href: '/dashboard/seller/bookings', icon: Bell },
                    { name: 'Profile', href: '/dashboard/profile', icon: Users },
                ];
            case 'customer':
                return [
                    { name: 'Dashboard', href: '/dashboard/customer', icon: Home },
                    { name: 'Bookings', href: '/dashboard/customer/bookings', icon: Package },
                    { name: 'Wishlists', href: '/dashboard/customer/wishlist', icon: Bell },
                    { name: 'Profile', href: '/dashboard/profile', icon: Users },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems(role);
  return (
    <div className="flex min-h-screen">
            <div className="md:hidden p-4 fixed top-0 left-0 z-50">
                <button onClick={toggleSidebar} className="text-gray-700 focus:outline-none">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {isOpen && isMobile && ( 
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside
                className={`
                    flex-shrink-0 bg-gray-800 text-white w-64 p-5 z-50 transition-transform duration-300 ease-in-out
                    ${isMobile ? 'fixed h-full top-0 left-0' : 'relative h-auto'} /* Mobile: fixed, Desktop: relative */
                    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'} /* Mobile hide/show */
                    md:translate-x-0 md:h-auto md:min-h-screen /* Desktop: selalu terlihat & full height */
                `}
            >
                {isMobile && (
                    <div className="flex justify-end mb-4">
                        <button onClick={toggleSidebar} className="text-white focus:outline-none">
                            <X size={28} />
                        </button>
                    </div>
                )}

                <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
                <nav>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.name} className="mb-3">
                                <Link
                                    href={item.href}
                                    scroll={false}
                                    className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md transition-colors duration-200"
                                    onClick={isMobile ? toggleSidebar : undefined}
                                >
                                    <item.icon className="mr-3" size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 p-6 ${isMobile ? 'pt-20' : ''}`}>
                {children}
            </main>
        </div>
  )
}

export default Sidebar