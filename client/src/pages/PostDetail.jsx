import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Share2, ThumbsUp, MessageSquare, Heart } from 'lucide-react';
import SocialHeader from '../components/socialMedia/SocialHeader';
import axiosInstance from '../utils/axiosInstance';
import TiptapViewer from '../components/richtext/TiptapViewer';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const postId = parseInt(id);
      if (!postId || Number.isNaN(postId)) {
        setErrorMsg('ID bài viết không hợp lệ');
        return;
      }

      setIsLoading(true);
      setErrorMsg('');
      try {
        const res = await axiosInstance.get(`/post/${postId}`);
        if (cancelled) return;
        const p = res.data;
        
        // Parse contentJson nếu là string
        if (p?.contentJson && typeof p.contentJson === 'string') {
          try {
            p.contentJson = JSON.parse(p.contentJson);
          } catch (e) {
            console.error('Error parsing contentJson:', e);
            p.contentJson = null;
          }
        }
        
        setPost(p);
        setUser(p?.user || null);

        const postDate = new Date(p?.createdAt || Date.now());
        const formatted = postDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        setFormattedDate(formatted);
      } catch (e) {
        if (cancelled) return;
        const status = e?.response?.status;
        if (status === 404) setErrorMsg('Không tìm thấy bài viết');
        else setErrorMsg(e?.response?.data?.message || 'Không thể tải bài viết. Vui lòng thử lại.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SocialHeader />
        <div className="pt-14 flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SocialHeader />
        <div className="pt-14 flex items-center justify-center min-h-screen">
          <p className="text-gray-600">{errorMsg || 'Không tìm thấy bài viết'}</p>
        </div>
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
          {post.title && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
            </div>
          )}

          {/* Thread Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to={user?.id ? `/user/${user.id}` : '#'} className="block">
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-blue-500 bg-cover bg-center"
                    style={{ backgroundImage: `url(${user?.avatarUrl || ''})` }}
                  />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Link to={user?.id ? `/user/${user.id}` : '#'} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {user?.fullName || user?.userName || 'Người dùng'}
                    </Link>
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
              {post?.contentJson && typeof post.contentJson === 'object' ? (
                <TiptapViewer contentJson={post.contentJson} />
              ) : post?.contentText || post?.content ? (
                <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                  {(post.contentText || post.content || '').split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">Không có nội dung</div>
              )}
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

