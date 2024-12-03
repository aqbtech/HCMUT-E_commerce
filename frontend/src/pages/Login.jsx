import  { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';
import { getMininalProfile, SignIn } from '../fetchAPI/fetchAccount';
import Cookies from 'js-cookie'
import ErrorMessage  from '/src/components/errorMessage';
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const Login = () => {
  const {navigate, systemError, setSystemError, setRole} = useContext(ShopContext);
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false) //set loading cho login

  const from = location.state?.from ||  location.state ||"/";

  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // Tài khoản chỉ chứa chữ, số và dấu gạch dưới, ít nhất 3 ký tự
    if (!username.trim() || !usernameRegex.test(username)) {
      toast.error("Tài khoản không hợp lệ! Phải chứa ít nhất 3 ký tự chữ, số hoặc _.");
      return false;
    }
    if (pass.length < 3) {
      toast.error("Mật khẩu phải có ít nhất 3 ký tự!");
      return false;
    }
    return true;
  };
  


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoading) return;
  
    // Validate form trước khi tiếp tục
    if (!validateForm()) return;
  
    setIsLoading(true); // Bắt đầu loading
  
    const body = {
      username: username.trim(),
      password: pass,
    };
  
    try {
      const response = await SignIn(body);
      const token = response.data.result.token;
      if (token) Cookies.set('token', token);
  
      Cookies.set('username', username);
  
      const res = await getMininalProfile();
    
      const role = res.role;
      Cookies.set('role', role);
      setRole(role);
  
      toast.success("Đăng nhập thành công!");
  
      // Điều hướng dựa trên vai trò
      if (role === "ADMIN") navigate('/admin');
      else if (role === "SELLER") navigate('/shop');
      navigate(from, { replace: true });
  
    } catch (error) {
      if (error.status === 401) {
        toast.error("Thông tin đăng nhập sai rồi!");
      } else {
        console.log(error);
        setSystemError(error.response?.data?.message || error.response?.data?.error || "Mất kết nối máy chủ");
      }
    } finally {
      setIsLoading(false); // Hoàn tất loading
    }
  };
  
    
  if (systemError) {
    return <ErrorMessage  message={systemError} />;
  }
  return (
    <div className='min-h-screen'>
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
        <button
          disabled={!username || !pass || isLoading}
          onClick={(event) => onSubmitHandler(event)}
          type="submit"
          className={`bg-black text-white font-light px-8 py-2 mt-4 ${!username || !pass || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-2xl" />
          ) : (
            'Đăng Nhập'
          )}
        </button>
      </form>

    </div>
  )
}

export default Login
