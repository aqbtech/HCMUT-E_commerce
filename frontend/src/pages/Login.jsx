import  { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';
import { SignIn } from '../fetchAPI/fetchAccount';
import Cookies from 'js-cookie'
import ErrorMessage  from '/src/components/errorMessage';
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const Login = () => {
  const {navigate, systemError, setSystemError} = useContext(ShopContext);
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false) //set loading cho login

  const from = location.state?.from ||  location.state ||"/";

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if(isLoading === true) return; //lúc đang call api thì không gọi nhiều lần!

    if (!username || !pass) {
      toast.error("Bạn còn sót thông tin nè!");
      return;
    }
    setIsLoading(true); //lúc đang call api
 
    const body = { 
      "username":username, 
      "password":pass
    };
    
    await SignIn(body)
    .then((response) => {
      toast.success('Đăng nhập thành công!');
      const token = response.data.result.token;
      const role = response.data.result.role;
      token && Cookies.set('token', token) //set token cho cookies
      Cookies.set('username', username); //set username cho cookies
      role && Cookies.set("role", role) //set role cho phiên đăng nhập này
      navigate(from, { replace: true });
    })
    .catch((error) => { 
      if(error.status === 401) toast.error("Thông tin đăng nhập sai rồi!");
      else if(error.status === 404) toast.error("Tài khoản không hợp lệ");
      else setSystemError(error.response?.data?.message || error.response?.data?.error || "Mất kết nối máy chủ");
      throw(error)
    })
    .finally(() => {
      setIsLoading(false); //đã gọi xong
    })
  };
  if (systemError) {
    return <ErrorMessage  message={systemError} />;
  }
  return (
    <div>
      <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' action="">
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>Đăng Nhập</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Tài khoản' value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Mật khẩu' value={pass} onChange={(e) => setPass(e.target.value)}/>
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <Link to='/reset'><p className='cursor-pointer hover:underline'>Quên mật khẩu?</p> </Link>
          {
            <Link to='/regist'><p className='cursor-pointer hover:text-black hover:underline'>Đăng kí</p></Link>
          }
        </div>
        <button onClick={(event) => onSubmitHandler(event, username, pass)} type='submit' className='bg-black text-white font-light px-8 py-2 mt-4 '>{isLoading ? <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-2xl" />
          : 'Đăng Nhập'}</button>
      </form>

    </div>
  )
}

export default Login
