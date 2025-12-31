import React, { useEffect } from 'react';
import LeftSidebar from '@components/socialMedia/content-left/LeftSidebar';
import CenterContent from '@components/socialMedia/content-center/CenterContent';
import RightSidebar from '@components/socialMedia/content-right/RightSidebar';

const SocialMedia = () => {
  useEffect(() => {
    // Đặt background cho body và html để tránh lộ nền trắng khi overscroll
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyOverflow = document.body.style.overscrollBehavior;
    const originalHtmlOverflow = document.documentElement.style.overscrollBehavior;
    
    document.body.style.backgroundColor = '#F5E6D3'; // beige
    document.documentElement.style.backgroundColor = '#F5E6D3';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // Cleanup khi unmount
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.overscrollBehavior = originalBodyOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverflow;
    };
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex gap-4 p-4 pt-4">
        <LeftSidebar />
        <CenterContent />
        <RightSidebar />
      </div>
    </div>
  );
};

export default SocialMedia;