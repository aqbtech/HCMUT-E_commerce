import { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import Cookies from 'js-cookie';
import { logOut } from '../../fetchAPI/fetchAccount';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { search, setSearch, curState, setCurState, setAccount, totalQuantityInCart, role, location } = useContext(ShopContext);
  const pagesWithoutSearch = ['/login', '/reset', '/regist', '/admin', '/shop', '/RegistSeller', '/FakeAPI', `/payment`];

  const onSubmitHandler = async () => {
    try {
      await logOut();
      setCurState('UnLogin');
      Cookies.remove('username');
      Cookies.remove('token'); 
      Cookies.remove("role")
      setAccount(null);
      console.log('logOut success');
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(search)}`;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Thanh điều hướng chính */}
      <div className="flex items-center justify-between py-5 font-medium">
        {/* Logo */}
        <Link to="/" className="Logo flex items-center">
          <img src={assets.logo} className="w-[48px]" alt="Logo" />
          <p className="Name_brand">ATOM</p>
        </Link>
        {!pagesWithoutSearch.some((path) => location.pathname.includes(path)) && ( // Kiểm tra nếu trang hiện tại nằm trong danh sách
          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Search please!!!"
                className="w-full px-4 py-2 rounded-full outline-none text-gray-800"
              />
              <button
                onClick={() => search.trim() && (window.location.href = `/search?query=${encodeURIComponent(search)}`)}
                className="absolute top-0 right-0 px-4 py-2 bg-white text-orange-500 rounded-full"
              >
                <img className="w-4" src={assets.hinh7} alt="" />
              </button>
            </div>
          </div>
        )}
        {/* Phần chức năng bên phải */}
        <div className="flex items-center gap-6">
          {/* Icon người dùng */}
          <div className="group relative">
            <img src={assets.user} className="w-5 cursor-pointer" alt="User" />
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-44 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                {curState === 'UnLogin' ? (
                  <>
                    <Link to="/login">
                      <p className="cursor-pointer hover:text-black">Đăng nhập</p>
                    </Link>
                    <Link to="/regist">
                      <p className="cursor-pointer hover:text-black">Đăng ký</p>
                    </Link>
                    <Link to="/RegistSeller">
                      <p className="cursor-pointer hover:text-black">Đăng ký cửa hàng</p>
                    </Link>
                  </>
                ) : (
                  <>
                    {role === "BUYER" && (
                      <>
                        <Link to="/myProfile">
                          <p className="cursor-pointer hover:text-black">Hồ sơ</p>
                        </Link>
                        <Link to="/review">
                          <p className="cursor-pointer hover:text-black">Đánh giá</p>
                        </Link>
                        <Link to="/orders">
                          <p className="cursor-pointer hover:text-black">Đơn hàng</p>
                        </Link>
                      </>
                    )}
                    {role === 'SELLER' && (
                      <Link to="/shop">
                        <p className="cursor-pointer hover:text-black">Cửa hàng</p>
                      </Link>
                    )}
                    {role === 'ADMIN' && (
                      <>
                        <Link to="/admin">
                          <p className="cursor-pointer hover:text-black">Trang quản lý</p>
                        </Link>
                        <Link to="/FakeAPI">
                          <p className="cursor-pointer hover:text-black">API đơn hàng</p>
                        </Link>
                      </>
                    )}
                    <p onClick={() => onSubmitHandler()} className="cursor-pointer hover:text-black">
                      Đăng xuất
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Icon giỏ hàng */}
          {curState === 'Login' && role == "BUYER"  &&(
           <Link to="/cart" className="relative">
            <img src={assets.hinh5} className="w-5 min-w-5 cursor-pointer" alt="Cart" />
            <span
              className="absolute left-3 bottom-[-5px] min-w-[20px] h-[20px] flex items-center justify-center bg-red-500 text-white rounded-full text-xs leading-none"
              style={{ padding: '2px 4px' }}
            >
              {totalQuantityInCart}
            </span>
          </Link>
          )}

          {/* Menu icon cho thiết bị nhỏ */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      {/* Sidebar menu cho màn hình nhỏ */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? 'w-full' : 'w-zero'
        } sm:hidden`}
      >
        <div className="flex flex-col text-gray-600">
          {visible && (
            <>
              <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                <img src={assets.arrow} className="h-4 rotate-180" alt="Back arrow" />
                <p>Back</p>
              </div>
              <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/">
                HOME
              </NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/search">
                TÌM KIẾM
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
