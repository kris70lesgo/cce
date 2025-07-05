'use client';

import React from 'react';

const SendButton: React.FC = () => {
  return (
    <button
      id="sendButton"
      className="group p-2 transition-all duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 664 663"
        className="h-[18px] transition-all duration-300"
      >
        <path
          fill="none"
          d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
          className="transition-all duration-300"
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={33.67}
          stroke="#6c6c6c"
          d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
          className="transition-all duration-300 group-hover:stroke-white group-hover:fill-[#3c3c3c]"
        />
      </svg>
    </button>
  );
};

export default SendButton;

