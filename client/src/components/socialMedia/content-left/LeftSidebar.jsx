import React from "react";
import UserMenu from "./UserMenu";
import SuggestUser from "./SuggestUser";

const LeftSidebar = () => {
  return (
    <aside className="hidden lg:block w-80 fixed left-0 top-24 pl-8 pb-6 h-[calc(100vh-6rem)] overflow-y-auto">
      <UserMenu />
      <SuggestUser />
    </aside>
  );
};

export default LeftSidebar;
