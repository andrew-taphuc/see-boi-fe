import { Calendar, Users } from 'lucide-react';

/**
 * Component hiển thị stats của profile
 */
const ProfileStats = ({ postsCount, followersCount = 0, followingCount = 0 }) => {
  return (
    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-gray-500" />
        <div>
          <span className="font-bold text-gray-900">{postsCount}</span>
          <span className="text-gray-600 ml-1">Bài viết</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users size={18} className="text-gray-500" />
        <div>
          <span className="font-bold text-gray-900">{followersCount}</span>
          <span className="text-gray-600 ml-1">Người theo dõi</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users size={18} className="text-gray-500" />
        <div>
          <span className="font-bold text-gray-900">{followingCount}</span>
          <span className="text-gray-600 ml-1">Đang theo dõi</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;

