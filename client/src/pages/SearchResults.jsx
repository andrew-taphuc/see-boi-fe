import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchAll } from '@utils/searchService';
import { Search, User, FileText, ArrowLeft } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState({ users: [], posts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, users, posts

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const data = await searchAll(query);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const filteredUsers = activeTab === 'posts' ? [] : results.users;
  const filteredPosts = activeTab === 'users' ? [] : results.posts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Kết quả tìm kiếm
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                "{query}"
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'all'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Tất cả ({results.users.length + results.posts.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-2 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Người dùng ({results.users.length})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-2 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'posts'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Bài viết ({results.posts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Users Section */}
            {filteredUsers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Người dùng
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 
                               transition-colors text-left"
                    >
                      <img
                        src={user.avatarUrl || '/default-avatar.png'}
                        alt={user.fullName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{user.userName || user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {filteredPosts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Bài viết
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handlePostClick(post.id)}
                      className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 
                               transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={post.user?.avatarUrl || '/default-avatar.png'}
                          alt={post.user?.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {post.user?.fullName}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              @{post.user?.userName}
                            </span>
                          </div>
                          {post.title && (
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {post.title}
                            </h3>
                          )}
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                            {post.contentText}
                          </p>
                          {post.thumbnailUrl && (
                            <img
                              src={post.thumbnailUrl}
                              alt=""
                              className="mt-3 rounded-lg w-full max-h-64 object-cover"
                            />
                          )}
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <span>❤️ {post.likeCount}</span>
                            <span>💬 {post.commentCount}</span>
                            {post.relevance && (
                              <span className="text-purple-500">
                                Độ phù hợp: {(post.relevance * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!filteredUsers.length && !filteredPosts.length && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Không tìm thấy kết quả nào cho "{query}"
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
