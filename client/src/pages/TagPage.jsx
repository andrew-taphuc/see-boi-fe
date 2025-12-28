import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getTagDetail, getPostsByTags } from "@utils/tagService";
import { useToast } from "@context/ToastContext";
import PostCard from "@components/socialMedia/PostCard";
import TagFollowButton from "@components/socialMedia/TagFollowButton";
import MultiTagFilter from "@components/socialMedia/MultiTagFilter";

const TagPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);

  // Get selected tags from URL params
  const urlTagIds =
    searchParams.get("tags")?.split(",").filter(Boolean).map(Number) || [];
  const [selectedTags, setSelectedTags] = useState(
    urlTagIds.length > 0 ? urlTagIds : [Number(id)]
  );

  // Get sort type from URL params or default to 'recent'
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recent");

  const POSTS_PER_PAGE = 20;

  // Fetch tag detail
  useEffect(() => {
    const fetchTag = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await getTagDetail(id);
        if (result.success) {
          setTag(result.data);
        } else {
          showToast(result.error, "error");
          navigate("/social-media");
        }
      } catch (error) {
        console.error("Error fetching tag:", error);
        showToast("Có lỗi xảy ra", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [id, navigate, showToast]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (selectedTags.length === 0) {
        setPosts([]);
        return;
      }

      setPostsLoading(true);
      try {
        const result = await getPostsByTags({
          tagIds: selectedTags,
          sortBy,
          skip,
          take: POSTS_PER_PAGE,
        });

        if (result.success) {
          if (skip === 0) {
            setPosts(result.data.posts);
          } else {
            setPosts((prev) => [...prev, ...result.data.posts]);
          }
          setHasMore(result.data.hasMore);
        } else {
          showToast(result.error, "error");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        showToast("Có lỗi xảy ra khi tải bài viết", "error");
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedTags, sortBy, skip, showToast]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    }
    if (sortBy !== "recent") {
      params.set("sort", sortBy);
    }
    setSearchParams(params, { replace: true });
  }, [selectedTags, sortBy, setSearchParams]);

  // Handle tag selection change
  const handleTagsChange = (newTags) => {
    setSelectedTags(newTags.length > 0 ? newTags : [Number(id)]);
    setSkip(0);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setSkip(0);
  };

  // Handle load more
  const handleLoadMore = () => {
    setSkip((prev) => prev + POSTS_PER_PAGE);
  };

  // Handle follow change
  const handleFollowChange = (isFollowing) => {
    if (tag) {
      setTag({
        ...tag,
        isFollowing,
        _count: {
          ...tag._count,
          followers: tag._count.followers + (isFollowing ? 1 : -1),
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tag Header */}
        {tag && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  #{tag.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {tag._count?.posts || 0} bài viết
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {tag._count?.followers || 0} người theo dõi
                  </span>
                </div>
              </div>
              <TagFollowButton
                tagId={tag.id}
                initialIsFollowing={tag.isFollowing}
                onFollowChange={handleFollowChange}
              />
            </div>
          </div>
        )}

        {/* Multiple Tag Filter */}
        <MultiTagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          className="mb-6"
        />

        {/* Sort Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 dark:text-gray-300 font-medium mr-2">
              Sắp xếp:
            </span>
            <button
              onClick={() => handleSortChange("recent")}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  sortBy === "recent"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
            >
              Mới nhất
            </button>
            <button
              onClick={() => handleSortChange("likes")}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  sortBy === "likes"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
            >
              Nhiều likes nhất
            </button>
            <button
              onClick={() => handleSortChange("views")}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  sortBy === "views"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
            >
              Nhiều views nhất
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {postsLoading && skip === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={postsLoading}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {postsLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Đang tải...
                      </span>
                    ) : (
                      "Xem thêm"
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-sm text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hãy là người đầu tiên viết bài với tag này!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagPage;
