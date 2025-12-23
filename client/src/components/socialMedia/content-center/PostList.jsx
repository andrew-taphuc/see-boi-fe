import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postsData from '@data/posts.json';
import usersData from '@data/users.json';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Kết hợp dữ liệu từ posts và users
    const combinedPosts = postsData.map(post => {
      const user = usersData.find(u => u.id === post.userId);
      
      // Format thời gian
      const postTime = new Date(post.time);
      const now = new Date();
      const diffInMs = now - postTime;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      
      let timeAgo = '';
      if (diffInDays > 0) {
        timeAgo = `${diffInDays} ngày trước`;
      } else if (diffInHours > 0) {
        timeAgo = `${diffInHours} giờ trước`;
      } else {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        timeAgo = diffInMinutes > 0 ? `${diffInMinutes} phút trước` : 'Vừa xong';
      }

      return {
        id: post.id,
        userId: post.userId, // Lưu userId để link đến profile
        author: user?.userName || 'Người dùng',
        avatar: user?.avatarUrl || 'https://ui-avatars.com/api/?name=User',
        time: timeAgo,
        title: post.title,
        content: post.content,
        image: post.image,
        likes: Math.floor(Math.random() * 100) + 10, // Random likes từ 10-110
        comments: Math.floor(Math.random() * 20) + 2, // Random comments từ 2-22
        shares: Math.floor(Math.random() * 10) // Random shares từ 0-10
      };
    });

    // Sắp xếp theo thời gian mới nhất trước
    combinedPosts.sort((a, b) => {
      const timeA = new Date(postsData.find(p => p.id === a.id)?.time);
      const timeB = new Date(postsData.find(p => p.id === b.id)?.time);
      return timeB - timeA;
    });

    // Chỉ lấy 4 bài viết đầu tiên
    setPosts(combinedPosts.slice(0, 4));
  }, []);

  // Hàm rút gọn nội dung
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {posts.map((post, index) => (
        <article 
          key={post.id} 
          className="flex gap-4 p-4 hover:bg-gray-50 transition-colors duration-200"
        >
          {/* Ảnh đại diện bài viết bên trái với aspect ratio 16:9 */}
          <div className="flex-shrink-0 w-40">
            <Link to={`/post/${post.id}`} className="block">
              <div className="relative rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${post.image})`,
                    borderRadius: '8px'
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Nội dung bên phải */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              {/* Tiêu đề in đậm với link */}
              <Link to={`/post/${post.id}`} className="block mb-2">
                <h4 className="font-bold text-lg text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h4>
              </Link>
              
              {/* Nội dung ngắn (không hiển thị hết) với link */}
              <Link to={`/post/${post.id}`} className="block mb-3">
                <p className="text-gray-600 text-sm line-clamp-3 hover:text-gray-800 transition-colors">
                  {truncateContent(post.content)}
                </p>
              </Link>
            </div>

            {/* Avatar bo tròn có viền xanh + tên người dùng */}
            <div className="flex items-center gap-2 mt-auto">
              <Link to={`/user/${post.userId}`} className="block">
                <img 
                  src={post.avatar} 
                  alt={post.author}
                  className="w-8 h-8 rounded-full border border-blue-500 min-w-[32px] min-h-[32px]"
                />
              </Link>
              <Link to={`/user/${post.userId}`} className="block">
                <span className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  {post.author}
                </span>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default PostList;

