import React from 'react';

export default function BrandLogo({ className = 'w-[34px] h-[34px]' }) {
  return (
    <img
      src="/smvdu_logo.svg"
      alt="SMVDU logo"
      className={`rounded-xl bg-white p-0.5 object-contain ${className}`}
    />
  );
}
