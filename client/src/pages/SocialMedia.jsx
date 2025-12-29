import React from 'react';
import LeftSidebar from '@components/socialMedia/content-left/LeftSidebar';
import CenterContent from '@components/socialMedia/content-center/CenterContent';
import RightSidebar from '@components/socialMedia/content-right/RightSidebar';
import SearchBar from '@components/socialMedia/SearchBar';

const SocialMedia = () => {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex gap-4 p-4">
        <LeftSidebar />
        <CenterContent />
        <RightSidebar />
      </div>
    </div>
  );
};

export default SocialMedia;