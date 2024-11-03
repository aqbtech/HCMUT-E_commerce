import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import Title from '../Title';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
 
const Category = ({data}) => {
  const {setSearch, setShowSearch } = useContext(ShopContext);
  
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    setSearch(categoryName); // Đặt search theo tên danh mục
    setShowSearch(true); // Hiển thị thanh tìm kiếm
    navigate('/search'); // Chuyển hướng sang trang tìm kiếm
  };

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={'DANH '} text2={'MỤC'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Thỏa thích lựa chọn mọi thứ bạn muốn, khi cần ATOM có, khi khó có ATOM
        </p>
      </div>

      {/* Rendering Product */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCategoryClick(item.name)} // Gọi hàm khi nhấn vào danh mục
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="bg-gray-200 h-20 w-20 flex items-center justify-center rounded-full mb-2">
              <span className="text-xl font-semibold">
                <img src={assets.logo} alt="" />
              </span>
            </div>
            <p className="text-sm">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
