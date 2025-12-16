import React from "react";

export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="36" height="36" rx="5" fill="#F0F0F0" />
      <g clipPath="url(#clip0_eye)">
        <path
          d="M8.8335 18.0002C8.8335 18.0002 12.1668 11.3335 18.0002 11.3335C23.8335 11.3335 27.1668 18.0002 27.1668 18.0002C27.1668 18.0002 23.8335 24.6668 18.0002 24.6668C12.1668 24.6668 8.8335 18.0002 8.8335 18.0002Z"
          stroke="#40393A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.0002 20.5002C19.3809 20.5002 20.5002 19.3809 20.5002 18.0002C20.5002 16.6195 19.3809 15.5002 18.0002 15.5002C16.6195 15.5002 15.5002 16.6195 15.5002 18.0002C15.5002 19.3809 16.6195 20.5002 18.0002 20.5002Z"
          stroke="#40393A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_eye">
          <rect width="20" height="20" fill="white" transform="translate(8 8)" />
        </clipPath>
      </defs>
    </svg>
  );
};
