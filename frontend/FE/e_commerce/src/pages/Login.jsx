import  { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';
import { fetchAccount } from '../../fetchAPI/fetchAccount';

const Login = () => {


  const {navigate, setCurState, setAccount} = useContext(ShopContext);
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  const onSubmitHandler = async (event, id, pass) => {
    event.preventDefault();
    
    try {
      // Đợi kết quả từ fetchAccount
      const account = {"username":id, "password":pass};
      const response = await fetchAccount(account);
      if(response.ok) {
        setAccount(response);
        toast.success('Đăng nhập thành công!');
        navigate('/');
        setCurState('Login');
      }
    } catch (error) {
      console.error("Error fetching account:", error);
      toast.error('Có lỗi xảy ra khi đăng nhập.');
    }
  };

  return (
    <div>
      <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' action="">
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>Đăng Nhập</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Tài khoản' value={id} onChange={(e) => setId(e.target.value)}/>
        <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Mật khẩu' value={pass} onChange={(e) => setPass(e.target.value)}/>
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer hover:underline'>Quên mật khẩu?</p>
          {
            <Link to='/Regist'><p className='cursor-pointer hover:text-black hover:underline'>Đăng kí</p></Link>
          }
        </div>
        <button onClick={(event) => onSubmitHandler(event, id, pass)} type='submit' className='bg-black text-white font-light px-8 py-2 mt-4 '>Đăng nhập</button>
      </form>

    </div>
  )
}

export default Login
