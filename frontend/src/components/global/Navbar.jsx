import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { search, setSearch, curState, setCurState, setAccount } = useContext(ShopContext);

  const onSubmitHandler = async () => {
    setCurState('UnLogin');
    Cookies.remove('username');
    Cookies.remove('token');
    setAccount(null);
    window.location.reload();
  };

  // Xử lý tìm kiếm khi nhấn Enter
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
        {/* Thanh tìm kiếm */}
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
        {/* Phần chức năng bên phải */}
        <div className="flex items-center gap-6">
          {/* Icon người dùng */}
          <div className="group relative">
            <img src={assets.user} className="w-5 cursor-pointer" alt="User" />
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                {curState === 'UnLogin' ? (
                  <div>
                    <Link to="/Login">
                      <p className="cursor-pointer hover:text-black">Đăng nhập</p>
                    </Link>
                    <Link to="/Regist">
                      <p className="cursor-pointer hover:text-black">Đăng kí</p>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link to="/myProfile">
                      <p className="cursor-pointer hover:text-black">Hồ sơ</p>
                    </Link>
                    <Link to="/orders">
                      <p className="cursor-pointer hover:text-black">Đơn hàng</p>
                    </Link>
                    <Link to="/">
                      <p onClick={() => onSubmitHandler()} className="cursor-pointer hover:text-black">
                        Đăng xuất
                      </p>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Icon giỏ hàng */}
          {curState === 'Login' && (
            <Link to="/cart" className="relative">
              <img src={assets.hinh5} className="w-5 cursor-pointer" alt="Cart" />
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
          {/* Hiện nút back khi menu mở */}
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
