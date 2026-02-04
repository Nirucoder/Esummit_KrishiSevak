import React from 'react';
import krishiLogo from 'figma:asset/5c9e2e1af432dbd77dcb8da90393524f10a79024.png';

interface KrishiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function KrishiLogo({ size = 'md', className = '' }: KrishiLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden ${className}`}>
      <img src={krishiLogo} alt="KrishiSevak Logo" className="w-full h-full object-cover" />
    </div>
  );
}