import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <img src={imgSrc} alt="Empty" className="w-1/3 mb-4" />
      <p className="text-lg text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyCard;
