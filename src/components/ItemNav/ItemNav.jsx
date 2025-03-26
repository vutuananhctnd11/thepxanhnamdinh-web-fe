import React from "react";

const ItemNav = ({ icon, name, onClick }) => {
  const handleClick = () => {
    onClick && onClick();
  };
  return (
    <div onClick={handleClick}>
      <div className="flex space-x-2 items-center p-1 hover:bg-white/10 rounded-lg hover:cursor-pointer">
        <div className="w-9 h-9 flex justify-center items-center my-1 ml-2">
          {icon}
        </div>
        <div className="pr-2">{name}</div>
      </div>
    </div>
  );
};

export default ItemNav;
