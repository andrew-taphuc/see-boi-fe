import React from "react";
import UserMenu from "./UserMenu";
import SuggestUser from "./SuggestUser";

const LeftSidebar = () => {
  return (
    <aside className="hidden lg:block w-80 fixed left-0 top-16 pl-6 pt-4 pb-6 h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col gap-4 pr-2 overflow-y-auto">
        <div className="flex-shrink-0">
      <UserMenu />
        </div>
        <div className="flex-shrink-0">
      <SuggestUser />
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
