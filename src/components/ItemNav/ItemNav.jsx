import React from "react";

const ItemNav = ({ icon, name, onClick }) => {
  const handleClick = () => {
    onClick && onClick();
  };
  return (
    <div onClick={handleClick}>
      <div className="flex space-x-2 items-center p-2 mr-1 hover:bg-white/10 rounded-lg hover:cursor-pointer">
        <div className="w-10 flex justify-center">{icon}</div>
        <div>{name}</div>
      </div>
    </div>
  );
};

export default ItemNav;
