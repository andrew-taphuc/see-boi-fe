import React from 'react';
import { Video, Image, Smile, MoreHorizontal, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';

const CenterContent = ({ posts }) => {
  return (
    <main className="flex-1 lg:ml-64 lg:mr-80 max-w-2xl mx-auto">
      {/* Stories */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <div className="min-w-[112px] h-48 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg relative cursor-pointer">
            <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">Tạo tin</div>
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="min-w-[112px] h-48 bg-gray-200 rounded-lg relative cursor-pointer">
              <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-blue-600 bg-white"></div>
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">User {i}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post */}
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

      {/* Posts */}
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow mb-4">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={post.avatar} 
                alt={post.author}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{post.author}</h3>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-2">
            <p>{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image && (
            <img 
              src={post.image} 
              alt="Post" 
              className="w-full object-cover"
            />
          )}

          {/* Post Stats */}
          <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-600">
            <span>{post.likes} lượt thích</span>
            <div className="flex gap-3">
              <span>{post.comments} bình luận</span>
              <span>{post.shares} chia sẻ</span>
            </div>
          </div>

          <hr />

          {/* Post Actions */}
          <div className="p-2 flex justify-around">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
              <ThumbsUp size={20} className="text-gray-600" />
              <span className="font-medium text-gray-600">Thích</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
              <MessageSquare size={20} className="text-gray-600" />
              <span className="font-medium text-gray-600">Bình luận</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
              <Share2 size={20} className="text-gray-600" />
              <span className="font-medium text-gray-600">Chia sẻ</span>
            </button>
          </div>
        </div>
      ))}
    </main>
  );
};

export default CenterContent;

