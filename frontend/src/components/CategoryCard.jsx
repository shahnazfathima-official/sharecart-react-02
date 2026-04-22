import React from 'react';

const CategoryCard = ({ category, onClick, isSelected }) => {
  return (
    <button
      onClick={() => onClick(category)}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-2xl
        transition-all duration-200 min-w-[100px]
        ${isSelected
          ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md'
        }
      `}
    >
      <span className="text-3xl">{category.icon}</span>
      <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
    </button>
  );
};

export default CategoryCard;
