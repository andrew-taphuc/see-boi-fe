import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, ThumbsUp, MessageSquare, Heart } from 'lucide-react';
import postsData from '../data/posts.json';
import usersData from '../data/users.json';
import SocialHeader from '../components/socialMedia/SocialHeader';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const postId = parseInt(id);
    const foundPost = postsData.find(p => p.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
      const foundUser = usersData.find(u => u.id === foundPost.userId);
      setUser(foundUser);
      
      // Format date
      const postDate = new Date(foundPost.time);
      const formatted = postDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      setFormattedDate(formatted);
    }
  }, [id]);

  if (!post || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy bài viết</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SocialHeader />
      
      <div className="pt-14 max-w-4xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        {/* Single white container for all content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Thread Title */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
          </div>

          {/* Thread Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a href={`#/user/${user.id}`} className="block">
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-blue-500 bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.avatar})` }}
                  />
                </a>
                <div>
                  <div className="flex items-center gap-2">
                    <a href={`#/user/${user.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {user.name}
                    </a>
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      + Theo dõi
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{formattedDate}</span>
                    <span>Phản hồi: {Math.floor(Math.random() * 20) + 2}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Thread Cover Image */}
          {post.image && (
            <div className="w-full overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="p-6 border-b border-gray-200">
            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>

          {/* Actions */}
          <div className="p-4">
            <div className="flex items-center justify-around">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ThumbsUp size={20} className="text-gray-600" />
                <span className="font-medium text-gray-600">
                  {Math.floor(Math.random() * 100) + 10} lượt thích
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageSquare size={20} className="text-gray-600" />
                <span className="font-medium text-gray-600">Bình luận</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 size={20} className="text-gray-600" />
                <span className="font-medium text-gray-600">Chia sẻ</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart size={20} className="text-gray-600" />
                <span className="font-medium text-gray-600">Yêu thích</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

