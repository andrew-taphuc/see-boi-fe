import React from 'react';
import BocThamVanMay from './BocThamVanMay';
import PostList from './PostList';

const CenterContent = () => {
  return (
    <main className="w-full lg:ml-[21rem] lg:mr-[28rem] xl:ml-[21rem] xl:mr-[28rem] 2xl:ml-[21rem] 2xl:mr-[28rem] max-w-4xl mx-auto pt-4 px-4 lg:px-6">
      <BocThamVanMay />
      {/* Posts */}
      <PostList />
    </main>
  );
};

export default CenterContent;

