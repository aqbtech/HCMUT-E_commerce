import  { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';
import { SignIn } from '../fetchAPI/fetchAccount';
import Cookies from 'js-cookie'

const Login = () => {
  const {navigate} = useContext(ShopContext);

  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false) //set loading cho login


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
      navigate('/'); //chuyển hướng đến trang home
    })
    .catch((error) => { 
      console.error("Lỗi khi gọi API đăng nhập:", error);
      toast.error('Có lỗi xảy ra khi đăng nhập.');
      throw(error)
    })
    .finally(() => {
      setIsLoading(false); //đã gọi xong
    })
  };
   
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
        <button onClick={(event) => onSubmitHandler(event, username, pass)} type='submit' className='bg-black text-white font-light px-8 py-2 mt-4 '>{isLoading ? '...Loading' : 'Đăng Nhập'}</button>
      </form>

    </div>
  )
}

export default Login
