import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-gray-100
        ${padding ? 'p-5' : ''}
        ${hover ? 'hover:shadow-lg hover:border-gray-200 hover:scale-[1.02] cursor-pointer' : 'shadow-sm'}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`pb-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`py-4 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
