import React from 'react';
import { Home, Users, Video, ShoppingBag, Menu, Search, MessageCircle, Bell, ChevronDown } from 'lucide-react';

const SocialHeader = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            f
          </div>
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-2 w-60">
            <Search size={16} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm trên Facebook"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex gap-2 flex-1 justify-center">
          <button className="px-8 py-2 hover:bg-gray-100 rounded-lg border-b-4 border-blue-600">
            <Home className="text-blue-600" size={24} />
          </button>
          <button className="px-8 py-2 hover:bg-gray-100 rounded-lg">
            <Users className="text-gray-500" size={24} />
          </button>
          <button className="px-8 py-2 hover:bg-gray-100 rounded-lg">
            <Video className="text-gray-500" size={24} />
          </button>
          <button className="px-8 py-2 hover:bg-gray-100 rounded-lg">
            <ShoppingBag className="text-gray-500" size={24} />
          </button>
        </nav>

        {/* Right: Icons & Profile */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <Menu size={20} />
          </button>
          <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <MessageCircle size={20} />
          </button>
          <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <Bell size={20} />
          </button>
          <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default SocialHeader;

