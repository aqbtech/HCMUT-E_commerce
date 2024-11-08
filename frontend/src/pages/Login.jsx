import  { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';
import { SignIn } from '../fetchAPI/fetchAccount';
import Cookies from 'js-cookie'



const Login = () => {
  const {navigate} = useContext(ShopContext);
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false) //set loading cho login


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if(isLoading === true) return; //lúc đang call api thì không gọi nhiều lần!
    setIsLoading(true); //lúc đang call api

    const body = { 
      "username":id, 
      "password":pass
    };
    
    await SignIn(body)
    .then((response) => {
      toast.success('Đăng nhập thành công!');
      setIsLoading(false); //đã gọi xong
      const token = response.data.result.token;
      Cookies.set('token', token) //set token cho cookies
      Cookies.set('username', id); //set username cho cookies
      navigate('/'); //chuyển hướng đến trang home
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API đăng nhập:", error);
      setIsLoading(false);
      toast.error('Có lỗi xảy ra khi đăng nhập.');
      throw(error)
    })
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
