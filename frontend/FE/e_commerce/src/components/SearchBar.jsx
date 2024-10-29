import { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  // luôn hiển thị search khi ở searchPage
  useEffect(() => {
    if (location.pathname.includes('search')) {
      setShowSearch(true);
    }
  }, [location]);

  // xử lý tìm kiếm
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  return showSearch ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown} 
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search please!!!"
        />
        <img className="w-4" src={assets.hinh7} alt="" />
      </div>
      <img onClick={() => setShowSearch(false)} className="inline w-3 cursor-pointer" src={assets.x} alt="" />
    </div>
  ) : null;
};

export default SearchBar;
