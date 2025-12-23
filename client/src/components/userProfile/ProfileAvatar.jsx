import { Camera } from 'lucide-react';

/**
 * Component Avatar với hover effect
 */
const ProfileAvatar = ({ 
  avatarUrl, 
  isOwnProfile, 
  onAvatarClick 
}) => {
  return (
    <div className="flex-shrink-0 relative">
      <div
        className="w-32 h-32 rounded-full border-4 border-blue-500 bg-cover bg-center cursor-pointer transition-all duration-200 relative group"
        style={{ backgroundImage: `url(${avatarUrl || ''})` }}
        onClick={onAvatarClick}
      >
        {/* Hover overlay với icon camera - chỉ hiện khi là own profile */}
        {isOwnProfile && (
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Camera size={32} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;

