import {useContext, useState} from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { register } from '../fetchAPI/fetchAccount';
import { toast } from 'react-toastify';
import ErrorMessage  from '/src/components/errorMessage';

const Regist = () => {
  const {navigate, systemError, setSystemError} = useContext(ShopContext);
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [email, setEmail] = useState(''); 
  const [hovatendem, setHovatendem] = useState('');
  const [ten, setTen] = useState(''); 
  const [sdt, setSdt] = useState('');
  const [date, setDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
 
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if(isLoading === true)  return;
    if(id.length === 0 || pass.length === 0 || confirmPass.length === 0 || email.length === 0 || hovatendem.length === 0 || ten.length === 0 
      ||  sdt.length === 0 ||date.length === 0 ) {
      toast.error("Bạn còn sót thông tin nè!");
      return;
    }
 
    if (pass !== confirmPass) {
      toast.error("Mật khẩu không khớp mất rùi :(((");
      return;
    }

   

    const body = {
      "username" : id,
      "password" : pass,
      "firstName" : hovatendem,
      "lastName" : ten,
      "email" : email,
      "DOB" : date,
      "phone" : sdt
    }
    
    await register(body)
    .then(() => {
      toast.success('Đăng kí thành công!')
      navigate('/Login');
    })
    .catch((error) => {
      console.log("Lỗi đăng kí:", error)
      if(error.status === 401) toast.error("Thông tin hiện đã tồn tại!");
      else setSystemError(error.response?.data?.message || error.response?.data?.error || "Mất kết nối máy chủ");
      throw(error)
    })
    .finally(() => {
      setIsLoading(false); //đã gọi API xong

    })
    .finally(() => {
      setIsLoading(false); //đã gọi API xong
    })
  }  
  if (systemError) {
    return <ErrorMessage  message={systemError} />;
  }
  return (
    <div> 
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' action="">
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>Đăng ký</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Tài khoản' value={id} onChange={(e) => setId(e.target.value)}/>
        <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Mật khẩu' value={pass} onChange={(e) => setPass(e.target.value)}/>
        <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Nhập lại mật khẩu' value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}/>
        <input type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <div className='flex gap-3'>
            <input className='border border-gray-300  rounded py-1.5 px-3.5 w-full' type="text" placeholder='Họ và tên đệm' value={hovatendem} onChange={(e) => setHovatendem(e.target.value)}/>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Tên' value={ten} onChange={(e) => setTen(e.target.value)}/>
        </div>
        <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Số điện thoại' value={sdt} onChange={(e) => setSdt(e.target.value)}/>
        <input type="date" className='w-full px-3 py-2 border border-gray-800' placeholder='Ngày-tháng-năm sinh' value={date} onChange={(e) => setDate(e.target.value)}/>

        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          {
            <Link to='/Login'><p className='cursor-pointer hover:text-black hover:underline'>Bạn đã có tài khoản?</p></Link>
          }
        </div>
        <button type="submit" className='bg-black text-white font-light px-8 py-2 mt-4'>{isLoading ? '...Loading' : 'Đăng ký'}</button>
      </form>

    </div>
  )
}
 
export default Regist 
 