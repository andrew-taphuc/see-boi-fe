import React, { useState, useEffect } from 'react';
import axiosInstance from '@utils/axiosInstance';

const PostCommentManagement = () => {
  const [activeTab, setActiveTab] = useState('POSTS'); // 'POSTS' or 'COMMENTS'
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL', 'TOXIC', 'NEGATIVE', 'NEUTRAL', 'POSITIVE'
  const [selectedItem, setSelectedItem] = useState(null); // For showing moderation details modal

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'POSTS') {
        const response = await axiosInstance.get('/post/admin/all', {
          params: {
            skip: 0,
            take: 100,
            search: searchTerm,
          },
        });
        setPosts(response.data.posts);
      } else {
        const response = await axiosInstance.get('/comment/admin/all', {
          params: {
            skip: 0,
            take: 100,
            search: searchTerm,
          },
        });
        setComments(response.data.comments);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      if (error.response?.status === 403) {
        alert('Bạn không có quyền truy cập chức năng này!');
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    
    try {
      await axiosInstance.delete(`/post/admin/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
      alert('Xóa bài viết thành công!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleTogglePostVisibility = async (postId) => {
    try {
      await axiosInstance.patch(`/post/admin/${postId}/toggle-visibility`);
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, isVisible: !post.isVisible } : post
      ));
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa comment này?')) return;
    
    try {
      await axiosInstance.delete(`/comment/admin/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
      alert('Xóa comment thành công!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleToggleCommentVisibility = async (commentId) => {
    try {
      await axiosInstance.patch(`/comment/admin/${commentId}/toggle-visibility`);
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, isVisible: !comment.isVisible } : comment
      ));
    } catch (error) {
      console.error('Error toggling comment visibility:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'ALL' || post.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const filteredComments = comments.filter(comment => {
    const matchSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'ALL' || comment.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // Helper function to get category badge with click handler
  const getCategoryBadge = (category, item) => {
    if (!category || category === 'NEUTRAL' || category === 'POSITIVE') return null;
    
    if (category === 'TOXIC') {
      return (
        <button
          onClick={() => setSelectedItem(item)}
          className="px-2 py-1 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
          title="Click để xem chi tiết"
        >
          TOXIC
        </button>
      );
    }
    if (category === 'NEGATIVE') {
      return (
        <button
          onClick={() => setSelectedItem(item)}
          className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors cursor-pointer"
          title="Click để xem chi tiết"
        >
          Tiêu cực
        </button>
      );
    }
    return null;
  };

  // Helper to highlight toxic words in content
  const highlightToxicWords = (content, toxicWords) => {
    if (!toxicWords || toxicWords.length === 0) return content;
    
    let result = content;
    toxicWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      result = result.replace(regex, '<mark class="bg-red-200 text-red-900 font-semibold px-1">$1</mark>');
    });
    return result;
  };

  // Modal for showing moderation details
  const ModerationModal = () => {
    if (!selectedItem) return null;

    const isToxic = selectedItem.category === 'TOXIC';
    const severity = selectedItem.moderationSeverity || 'LOW';
    const confidence = selectedItem.moderationConfidence || 0;

    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
        onClick={() => setSelectedItem(null)}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className={`p-6 rounded-t-2xl ${isToxic ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {isToxic ? 'CẢNH BÁO NGHIÊM TRỌNG' : 'CẢNH BÁO NỘI DUNG'}
                    </h2>
                    <p className="text-white text-sm opacity-90">Phân tích tự động bởi AI</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Alert Box */}
            <div className={`p-4 rounded-lg mb-6 border-l-4 ${
              isToxic 
                ? 'bg-red-50 border-red-600' 
                : 'bg-orange-50 border-orange-600'
            }`}>
              <div className="flex items-start gap-3">
                <div>
                  <h3 className={`font-bold mb-1 ${isToxic ? 'text-red-800' : 'text-orange-800'}`}>
                    {isToxic 
                      ? 'Nội dung vi phạm nghiêm trọng - Cần xử lý ngay' 
                      : 'Nội dung tiêu cực - Cần theo dõi'}
                  </h3>
                  <p className={`text-sm ${isToxic ? 'text-red-700' : 'text-orange-700'}`}>
                    {isToxic 
                      ? 'Nội dung này chứa ngôn từ xúc phạm, lăng mạ hoặc không phù hợp với cộng đồng.' 
                      : 'Nội dung có xu hướng tiêu cực, có thể gây ảnh hưởng không tốt đến trải nghiệm người dùng.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className={`text-3xl font-bold mb-1 ${
                  isToxic ? 'text-red-600' : 'text-orange-600'
                }`}>
                </div>
                <div className="text-xs text-gray-600 mb-1">Phân loại</div>
                <div className="font-semibold text-gray-800">
                  {isToxic ? 'TOXIC' : 'NEGATIVE'}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className={`text-3xl font-bold mb-1 ${
                  severity === 'HIGH' ? 'text-red-600' :
                  severity === 'MEDIUM' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                </div>
                <div className="text-xs text-gray-600 mb-1">Mức độ</div>
                <div className="font-semibold text-gray-800">
                  {severity === 'HIGH' ? 'CAO' : severity === 'MEDIUM' ? 'TRUNG BÌNH' : 'THẤP'}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                Thông tin người vi phạm
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Tên người dùng:</span>
                  <p className="text-blue-900 font-semibold mt-1">{selectedItem.authorName}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Thời gian:</span>
                  <p className="text-blue-900 font-semibold mt-1">
                    {new Date(selectedItem.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                {activeTab === 'COMMENTS' && selectedItem.postTitle && (
                  <div className="col-span-2">
                    <span className="text-blue-700 font-medium">Bài viết:</span>
                    <p className="text-blue-900 font-semibold mt-1">{selectedItem.postTitle}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content with highlighting */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Nội dung vi phạm
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <div 
                  className="text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightToxicWords(
                      selectedItem.content || selectedItem.title || '',
                      selectedItem.moderationToxicWords
                    )
                  }}
                />
              </div>
            </div>

            {/* Toxic Words with count */}
            {selectedItem.moderationToxicWords && selectedItem.moderationToxicWords.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Từ khóa vi phạm 
                  <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                    {selectedItem.moderationToxicWords.length} từ
                  </span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.moderationToxicWords.map((word, index) => (
                    <div 
                      key={index}
                      className="group relative"
                    >
                      <span className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-colors cursor-help flex items-center gap-2">
                        "{word}"
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reason */}
            {selectedItem.moderationReason && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Phân tích chi tiết từ AI
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedItem.moderationReason}
                  </p>
                </div>
              </div>
            )}

            {/* Suggestion */}
            {selectedItem.moderationSuggestion && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Khuyến nghị xử lý
                </h4>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-gray-800 leading-relaxed font-medium">
                    {selectedItem.moderationSuggestion}
                  </p>
                </div>
              </div>
            )}

            {/* Actions with icons */}
            <div className="flex gap-3 mt-6 pt-6 border-t-2 border-gray-200">
              <button
                onClick={() => {
                  if (window.confirm('BẠN CÓ CHẮC CHẮN MUỐN XÓA VĨNH VIỄN?\n\nHành động này KHÔNG THỂ hoàn tác!')) {
                    if (activeTab === 'POSTS') {
                      handleDeletePost(selectedItem.id);
                    } else {
                      handleDeleteComment(selectedItem.id);
                    }
                    setSelectedItem(null);
                  }
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-bold shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  XÓA VĨNH VIỄN
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <ModerationModal />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý bài viết & Comment</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('POSTS')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'POSTS'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bài viết ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('COMMENTS')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'COMMENTS'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Comments ({comments.length})
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <input
          type="text"
          placeholder={`Tìm kiếm ${activeTab === 'POSTS' ? 'bài viết' : 'comment'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === 'ALL'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterCategory('TOXIC')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === 'TOXIC'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Toxic
          </button>
          <button
            onClick={() => setFilterCategory('NEGATIVE')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === 'NEGATIVE'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            Tiêu cực
          </button>
          <button
            onClick={() => setFilterCategory('NEUTRAL')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === 'NEUTRAL'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Trung tính
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'POSTS' ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                    {getCategoryBadge(post.category, post)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        post.isVisible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {post.isVisible ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>👤 {post.authorName}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>🕒 {new Date(post.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleTogglePostVisibility(post.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      post.isVisible
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {post.isVisible ? 'Ẩn' : 'Hiện'}
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
              Không tìm thấy bài viết nào
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-500">
                      Comment trên: <span className="text-amber-600">{comment.postTitle}</span>
                    </span>
                    {getCategoryBadge(comment.category, comment)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        comment.isVisible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {comment.isVisible ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-3">{comment.content}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>👤 {comment.authorName}</span>
                    <span>🕒 {new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredComments.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
              Không tìm thấy comment nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCommentManagement;
