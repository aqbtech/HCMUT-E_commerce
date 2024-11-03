import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import Cookies from 'js-cookie'

const Navbar = () => {

  const [visible, setVisible] = useState(false)
  const {setShowSearch, getCartCount, curState, setCurState, account, setAccount} = useContext(ShopContext); 
 
  const onSubmitHandler = async () => {
    setCurState('UnLogin');
    Cookies.remove('username');
    Cookies.remove('token');
    setAccount(null);
    window.location.reload();
  }

  return ( 
    <div className='flex items-center justify-between py-5 font-medium'>
      
      <Link to='/' className='Logo flex items-center'>
        <img src={assets.logo} className='w-[48px]' alt="" />
        <p className='Name_brand w'>ATOM</p>
      </Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700 ' >
        <NavLink to='/' className='flex flex-col items-center gap-1'> 
          <p>HOME</p>
          <hr className='w-1/2 border-none h-[1.5px] bg-gray-700 hidden ' />
        </NavLink>
        <NavLink to='/search' className='flex flex-col items-center gap-1'>
          <p>TÌM KIẾM</p>
          <hr className='w-1/2 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink> 
        {/* <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-1/2 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-1/2 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/test' className='flex flex-col items-center gap-1'>
          <p>TEST</p>
          <hr className='w-1/2 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink> */}
      </ul>

      <div className='flex items-center gap-6'> 
        <img onClick={() =>setShowSearch(true)} src={assets.hinh7} className='w-5 cursor-pointer' alt="" />
        <div className='group relative'>
          <img src={assets.user} className='w-5 cursor-pointer' alt="" />
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-slate-100 text-gray-500 rounded'> 
              {
                curState === 'UnLogin' 
                ? <div>
                  <Link to='/Login'><p className='cursor-pointer hover:text-black'>Đăng nhập</p></Link>
                  <Link to='/Regist'><p className='cursor-pointer hover:text-black'>Đăng kí</p></Link>
                </div> 
                : <div>
                    <Link to='/myProfile'><p className='cursor-pointer hover:text-black'>Hồ sơ</p></Link>
                    <Link to='/orders'><p className='cursor-pointer hover:text-black'>Đơn hàng</p></Link>
                    {/* {account.role === 'a' ? <Link to='/admin' className='cursor-pointer hover:text-black'>Admin Page</Link> : ""} */}
                    <Link to='/'><p onClick={() =>onSubmitHandler()} className='cursor-pointer hover:text-black'>Đăng xuất</p></Link>
                </div> 
              }
            </div>
          </div>
        </div> 
        {
          curState === "Login" ?   <Link to='/cart' className='relative'>
                                    <img src={assets.hinh5} className='w-5 min w-5 cursor-pointer' alt="" />
                                    {/* <p className='absolute top-[-5px] right-[-5px] w-4 text-center leading-4 bg-red-500 text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p> */}
                                  </Link> 
                              : ""
        }
        <img onClick={() =>setVisible(true)} src={assets.menu} className='w-5 cursor-pointer sm:hidden' alt="" />
      </div>

      {/* Sidebar menu for small screens */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-zero'} sm:hidden`}>
        <div className='flex flex-col text-gray-600'>
          {/* Hiện nút back chỉ khi menu mở */}
          {visible && ( 
            <>
            <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
              <img src={assets.arrow} className='h-4 rotate-180' alt="Back arrow" />
              <p>Back</p>
            </div>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/search'>TÌM KIẾM</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
