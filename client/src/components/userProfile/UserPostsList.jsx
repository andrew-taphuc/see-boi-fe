import { Link } from 'react-router-dom';

/**
 * Component hiển thị danh sách bài viết của user
 */
const UserPostsList = ({ posts, formatDateTime }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chưa có bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="block border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 hover:bg-gray-50 -mx-6 px-6 py-2 rounded-lg transition-colors"
        >
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {post.title || '(Không có tiêu đề)'}
              </h3>
              {(post.contentText || post.content) && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {post.contentText || post.content}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {post.createdAt ? formatDateTime(post.createdAt) : ''}
              </p>
            </div>
            {/* Thumbnail preview */}
            {post.thumbnailUrl && (
              <div className="flex-shrink-0">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title || "Post thumbnail"}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserPostsList;
