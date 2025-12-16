import React from 'react';
import { Video, Image, Smile } from 'lucide-react';

const CreatePost = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <img 
          src="https://ui-avatars.com/api/?name=User&background=4267B2&color=fff" 
          alt="User"
          className="w-10 h-10 rounded-full"
        />
        <input 
          type="text" 
          placeholder="Bạn đang nghĩ gì?"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none hover:bg-gray-200 cursor-pointer"
        />
      </div>
      <hr />
      <div className="flex justify-around pt-2">
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
          <Video className="text-red-500" size={24} />
          <span className="text-gray-600 font-medium">Video trực tiếp</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
          <Image className="text-green-500" size={24} />
          <span className="text-gray-600 font-medium">Ảnh/video</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
          <Smile className="text-yellow-500" size={24} />
          <span className="text-gray-600 font-medium">Cảm xúc</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

