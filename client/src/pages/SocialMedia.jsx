import React, { useState } from 'react';
import SocialHeader from '../components/socialMedia/SocialHeader';
import LeftSidebar from '../components/socialMedia/LeftSidebar';
import CenterContent from '../components/socialMedia/CenterContent';
import RightSidebar from '../components/socialMedia/RightSidebar';

const SocialMedia = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=4267B2&color=fff',
      time: '2 giờ trước',
      content: 'Hôm nay thời tiết đẹp quá! 🌞',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      likes: 24,
      comments: 5,
      shares: 2
    },
    {
      id: 2,
      author: 'Trần Thị B',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=E91E63&color=fff',
      time: '4 giờ trước',
      content: 'Vừa hoàn thành dự án mới! Cảm ơn team đã support 💪',
      likes: 42,
      comments: 8,
      shares: 3
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <SocialHeader />

      {/* Main Content */}
      <div className="pt-14 max-w-screen-2xl mx-auto">
        <div className="flex gap-4 p-4">
          {/* Left Sidebar */}
          <LeftSidebar />

          {/* Center: News Feed */}
          <CenterContent posts={posts} />

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;