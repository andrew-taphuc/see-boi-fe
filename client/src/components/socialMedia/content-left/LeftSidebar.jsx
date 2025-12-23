import React from 'react';
import { Users, Video, ShoppingBag } from 'lucide-react';

const LeftSidebar = () => {
  return (
    <aside className="hidden lg:block w-64 fixed left-0 pl-4 h-screen overflow-y-auto">
      <div className="space-y-2">
        <button className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg w-full">
          <img 
            src="https://ui-avatars.com/api/?name=User&background=4267B2&color=fff" 
            alt="User"
            className="w-9 h-9 rounded-full"
          />
          <span className="font-medium">Người dùng</span>
        </button>
        
        <button className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg w-full">
          <Users className="text-blue-600" size={24} />
          <span>Bạn bè</span>
        </button>
        
        <button className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg w-full">
          <Users className="text-cyan-600" size={24} />
          <span>Nhóm</span>
        </button>
        
        <button className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg w-full">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <span>Kỷ niệm</span>
        </button>
        
        <button className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg w-full">
          <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
          <span>Đã lưu</span>
        </button>
      </div>
    </aside>
  );
};

export default LeftSidebar;

