import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAll } from '@utils/searchService';
import { Search, User, FileText, TrendingUp } from 'lucide-react';

const SearchBar = ({ compact = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ users: [], posts: [] });
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchAll(query);
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
    setShowDropdown(false);
    setQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  const handlePostKeywordClick = (keyword) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
    setShowDropdown(false);
    setQuery('');
  };

  const hasResults = results.users.length > 0 || results.posts.length > 0;

  // Tính toán width dựa trên focus state và compact mode
  const getContainerWidth = () => {
    if (!compact) return 'w-full max-w-2xl mx-auto';
    if (isFocused || query) return 'w-full';
    return 'w-auto';
  };

  return (
    <div ref={searchRef} className={`relative ${getContainerWidth()} transition-all duration-300 ease-in-out`}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Search className={`absolute ${compact ? 'left-3' : 'left-4'} top-1/2 -translate-y-1/2 ${compact ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay để cho phép click vào dropdown
              setTimeout(() => {
                if (!query) {
                  setIsFocused(false);
                }
              }, 200);
            }}
            placeholder={compact ? "Tìm kiếm..." : "Tìm kiếm trên diễn đàn"}
            className={`${compact && !isFocused && !query ? 'w-[135px]' : 'w-full'} ${compact ? 'pl-10 pr-3 py-2 text-sm' : 'pl-12 pr-4 py-3'} rounded-full border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     transition-all duration-300 ease-in-out`}
          />
        </div>
      </form>

      {/* Dropdown Results */}
      {showDropdown && query.trim().length >= 2 && (
        <div className={`absolute z-[2000] w-full ${compact ? 'mt-1' : 'mt-2'} bg-white dark:bg-gray-800 rounded-xl shadow-2xl 
                      border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto`}>
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : hasResults ? (
            <>
              {/* Users Section */}
              {results.users.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Người dùng
                    </span>
                  </div>
                  {results.users.slice(0, 5).map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 
                               transition-colors duration-150 text-left"
                    >
                      <img
                        src={user.avatarUrl || '/default-avatar.png'}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          @{user.userName || user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Posts Keywords Section */}
              {results.posts.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Gợi ý tìm kiếm bài viết
                    </span>
                  </div>
                  {results.posts.slice(0, 5).map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handlePostKeywordClick(post.title || post.contentText?.slice(0, 50))}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 
                               transition-colors duration-150 text-left"
                    >
                      <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-gray-100 truncate">
                          {post.title || post.contentText}
                        </p>
                        {post.relevance && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {post.likeCount} lượt thích · {post.commentCount} bình luận
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* View All Results */}
              <button
                onClick={handleSearchSubmit}
                className="w-full px-4 py-3 text-center text-purple-600 dark:text-purple-400 
                         hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium
                         transition-colors duration-150 border-t border-gray-200 dark:border-gray-700"
              >
                Xem tất cả kết quả cho "{query}"
              </button>
            </>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Không tìm thấy kết quả</p>
              <p className="text-sm mt-1">Thử từ khóa khác</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
