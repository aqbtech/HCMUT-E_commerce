import Title from '../Title';

const Category = ({ data, onCategorySelect }) => {
  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <div className="my-10">
      <div className="text-left py-8 text-3xl">
        <Title text1={'DANH '} text2={'MỤC'} />
        <p className="w-3/4 text-xs sm:text-sm md:text-base text-gray-600">
          Thỏa thích lựa chọn mọi thứ bạn muốn, khi cần ATOM có, khi khó có ATOM
        </p>
      </div>

      {/* Thanh cuộn ngang */}
      <div
        className="flex overflow-x-auto space-x-4 py-4 no-scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-600"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        {/* Danh mục Tất cả */}
        <div
          className="flex-none w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-center cursor-pointer hover:scale-105 transform transition duration-300"
          onClick={() => handleCategoryClick('')}
        >
          <span className="text-sm font-semibold">Tất cả</span>
        </div>

        {/* Các danh mục */}
        {data.map((item) => (
          <div
            key={item.name}
            onClick={() => handleCategoryClick(item.name)}
            className="flex-none w-32 h-32 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center text-center cursor-pointer hover:bg-gray-300 hover:scale-105 transform transition duration-300"
          >
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
