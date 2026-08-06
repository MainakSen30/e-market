import React from 'react';

const ProfileIcon = ({ size = 28, color = '#2c3e6b' }: { size?: number; color?: string }) => {
  return (
    <div
      style={{
        width: 55,
        height: 55,
        border: `2.5px solid ${color}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Head */}
        <circle cx="12" cy="8" r="4" fill={color} />
        {/* Body */}
        <path
          d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default ProfileIcon;
