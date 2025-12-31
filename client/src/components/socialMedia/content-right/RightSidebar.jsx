import React from 'react';
import TrendingPost from '../content-left/TrendingPost';

const RightSidebar = () => {
  return (
    <aside className="hidden lg:block w-[26rem] fixed right-0 top-16 pr-8 pt-4 pb-6 h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto pl-2">
        <TrendingPost />
      </div>
    </aside>
  );
};

export default RightSidebar;

