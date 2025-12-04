import React from 'react';
import { Video, Search, MoreHorizontal } from 'lucide-react';

const RightSidebar = () => {
  return (
    <aside className="hidden lg:block w-80 fixed right-0 pr-4 h-screen overflow-y-auto">
      {/* Sponsored */}
      <div className="mb-4">
        <h3 className="text-gray-500 font-semibold mb-2">Được tài trợ</h3>
        <div className="flex gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
          <div>
            <h4 className="font-semibold text-sm">Quảng cáo mẫu</h4>
            <p className="text-xs text-gray-500">example.com</p>
          </div>
        </div>
      </div>

      <hr className="my-3" />

      {/* Contacts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-500 font-semibold">Người liên hệ</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Video size={16} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Search size={16} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <MoreHorizontal size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          {[
            'Nguyễn Văn A',
            'Trần Thị B', 
            'Lê Văn C',
            'Phạm Thị D',
            'Hoàng Văn E',
            'Đặng Thị F',
            'Vũ Văn G',
            'Bùi Thị H'
          ].map((name, i) => (
            <button key={i} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg w-full">
              <div className="relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${name}&background=random`}
                  alt={name}
                  className="w-9 h-9 rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <span className="text-sm">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;

