import React from 'react';
import ThemedHeader from '@components/common/ThemedHeader';
import LeftSidebar from '@components/socialMedia/content-left/LeftSidebar';
import CenterContent from '@components/socialMedia/content-center/CenterContent';
import RightSidebar from '@components/socialMedia/content-right/RightSidebar';

const SocialMedia = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <ThemedHeader variant="social" />

      {/* Main Content */}
      <div className="pt-16 max-w-screen-2xl mx-auto">
        <div className="flex gap-4 p-4">
          {/* Left Sidebar */}
          <LeftSidebar />

          {/* Center: News Feed */}
          <CenterContent />

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;