import React from 'react';
import TrendingPost from '../content-left/TrendingPost';

const RightSidebar = () => {
  return (
    <aside className="hidden lg:block w-[26rem] fixed right-0 top-24 pr-8 pb-6 h-[calc(100vh-6rem)] overflow-y-auto">
      <TrendingPost />
    </aside>
  );
};

export default RightSidebar;

