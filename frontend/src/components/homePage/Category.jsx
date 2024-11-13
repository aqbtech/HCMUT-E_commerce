import { useState } from 'react';
import Title from '../Title';
import { assets } from '../../assets/assets';

const Category = ({ data, onCategorySelect, onSubCategorySelect, selectedCategory }) => {
  const [showSubCategories, setShowSubCategories] = useState(null); // Hiển thị danh mục con

  const handleCategoryClick = (categoryName, subCategories) => {
    onCategorySelect(categoryName);
    setShowSubCategories(subCategories);
  };

  return (
    <div className="my-10">
      <div className="text-left py-8 text-3xl">
        <Title text1={'DANH '} text2={'MỤC'} />
        <p className="w-3/4 text-xs sm:text-sm md:text-base text-gray-600">
          Thỏa thích lựa chọn mọi thứ bạn muốn, khi cần ATOM có, khi khó có ATOM
        </p>
      </div>

      {/* Hiển thị danh mục */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
         <div
            onClick={() => handleCategoryClick("Tất cả", "")}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="bg-gray-200 h-20 w-20 flex items-center justify-center rounded-full mb-2">
              <span className="text-xl font-semibold">
                <img src={assets.logo} alt="" />
              </span>
            </div>
            <p className="text-sm">Tất cả</p>
          </div>
        {data.map((item) => (
          <div
            key={item.categoryId}
            onClick={() => handleCategoryClick(item.categoryName, item.subCategories)}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="bg-gray-200 h-20 w-20 flex items-center justify-center rounded-full mb-2">
              <span className="text-xl font-semibold">
                <img src={assets.logo} alt="" />
              </span>
            </div>
            <p className="text-sm">{item.categoryName}</p>
          </div>
        ))}
      </div>

      {/* Hiển thị danh mục con nếu có */}
      {showSubCategories && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 mt-6">
          {showSubCategories.map((subItem) => (
            <div
              key={subItem.subCategoryId}
              onClick={() => onSubCategorySelect(subItem.subCategoryName)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="bg-gray-200 h-16 w-16 flex items-center justify-center rounded-full mb-1">
                <span className="text-sm font-semibold">{subItem.subCategoryName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
