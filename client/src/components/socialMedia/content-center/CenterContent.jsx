import React from 'react';
import BocThamVanMay from './BocThamVanMay';
import PostList from './PostList';

const CenterContent = () => {
  return (
    <main className="flex-1 lg:ml-64 lg:mr-80 max-w-4xl mx-auto pt-0">
      <BocThamVanMay />
      {/* Posts */}
      <PostList />
    </main>
  );
};

export default CenterContent;

